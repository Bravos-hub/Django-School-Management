import { Request, Response, NextFunction } from 'express';
import { generateToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt';
import { hashPassword, comparePassword } from '../utils/bcrypt';
import prisma from '../config/database';
import { logger } from '../utils/logger';
import { ValidationError, UnauthorizedError, NotFoundError } from '@school-management/shared';
import { z } from 'zod';
import redis from '../config/redis';

const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  role: z.enum(['ADMIN', 'TEACHER', 'STUDENT', 'PARENT']).optional(),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const authController = {
  register: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = registerSchema.parse(req.body);
      const { email, password, firstName, lastName, role } = validatedData;

      // Check if user exists
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        throw new ValidationError('User with this email already exists');
      }

      // Hash password
      const hashedPassword = await hashPassword(password);

      // Create user
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          firstName,
          lastName,
          role: role || 'STUDENT',
        },
      });

      // Generate tokens
      const token = generateToken({
        id: user.id,
        email: user.email,
        role: user.role,
      });

      const refreshToken = generateRefreshToken({
        id: user.id,
        email: user.email,
        role: user.role,
      });

      // Store refresh token in database
      await prisma.refreshToken.create({
        data: {
          token: refreshToken,
          userId: user.id,
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        },
      });

      logger.info(`User registered: ${user.email}`);

      res.status(201).json({
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            role: user.role,
            firstName: user.firstName,
            lastName: user.lastName,
          },
          token,
          refreshToken,
        },
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return next(new ValidationError(error.errors[0].message));
      }
      next(error);
    }
  },

  login: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = loginSchema.parse(req.body);
      const { email, password } = validatedData;

      // Find user
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        throw new UnauthorizedError('Invalid email or password');
      }

      // Check if user is active
      if (!user.isActive) {
        throw new UnauthorizedError('Account is deactivated');
      }

      // Compare password
      const isPasswordValid = await comparePassword(password, user.password);

      if (!isPasswordValid) {
        throw new UnauthorizedError('Invalid email or password');
      }

      // Generate tokens
      const token = generateToken({
        id: user.id,
        email: user.email,
        role: user.role,
      });

      const refreshToken = generateRefreshToken({
        id: user.id,
        email: user.email,
        role: user.role,
      });

      // Store refresh token in database
      await prisma.refreshToken.create({
        data: {
          token: refreshToken,
          userId: user.id,
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        },
      });

      // Cache user session in Redis
      await redis.setex(`session:${user.id}`, 7 * 24 * 60 * 60, JSON.stringify({
        id: user.id,
        email: user.email,
        role: user.role,
      }));

      logger.info(`User logged in: ${user.email}`);

      res.json({
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            role: user.role,
            firstName: user.firstName,
            lastName: user.lastName,
          },
          token,
          refreshToken,
        },
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return next(new ValidationError(error.errors[0].message));
      }
      next(error);
    }
  },

  logout: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user?.id;
      const refreshToken = req.body.refreshToken || req.cookies?.refreshToken;

      if (refreshToken) {
        // Delete refresh token from database
        await prisma.refreshToken.deleteMany({
          where: { token: refreshToken },
        });
      }

      // Remove session from Redis
      if (userId) {
        await redis.del(`session:${userId}`);
      }

      res.json({
        success: true,
        message: 'Logged out successfully',
      });
    } catch (error) {
      next(error);
    }
  },

  refreshToken: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        throw new ValidationError('Refresh token is required');
      }

      // Verify refresh token
      const decoded = verifyRefreshToken(refreshToken);

      // Check if refresh token exists in database
      const tokenRecord = await prisma.refreshToken.findUnique({
        where: { token: refreshToken },
        include: { user: true },
      });

      if (!tokenRecord || tokenRecord.expiresAt < new Date()) {
        throw new UnauthorizedError('Invalid or expired refresh token');
      }

      // Generate new access token
      const newToken = generateToken({
        id: decoded.id,
        email: decoded.email,
        role: decoded.role,
      });

      res.json({
        success: true,
        data: {
          token: newToken,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  getMe: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user?.id;

      if (!userId) {
        throw new UnauthorizedError('User not authenticated');
      }

      // Try to get from Redis cache first
      const cachedUser = await redis.get(`session:${userId}`);
      if (cachedUser) {
        return res.json({
          success: true,
          data: JSON.parse(cachedUser),
        });
      }

      // Get from database
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          role: true,
          firstName: true,
          lastName: true,
          phoneNumber: true,
          isActive: true,
          createdAt: true,
        },
      });

      if (!user) {
        throw new NotFoundError('User');
      }

      res.json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  },
};
