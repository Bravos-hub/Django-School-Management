import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../middleware/errorHandler';
import { generateToken, generateRefreshToken } from '../utils/jwt';
import { hashPassword, comparePassword } from '../utils/bcrypt';
import prisma from '../config/database';
import { logger } from '../utils/logger';

// This is a placeholder controller - implement based on your Prisma schema
export const authController = {
  register: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password, name, role } = req.body;

      // Check if user exists
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        throw new CustomError('User already exists', 400);
      }

      // Hash password
      const hashedPassword = await hashPassword(password);

      // Create user
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
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

      logger.info(`User registered: ${user.email}`);

      res.status(201).json({
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            role: user.role,
          },
          token,
          refreshToken,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  login: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;

      // Find user
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        throw new CustomError('Invalid credentials', 401);
      }

      // Check if user is active
      if (!user.isActive) {
        throw new CustomError('Account is deactivated', 403);
      }

      // Compare password
      const isPasswordValid = await comparePassword(password, user.password);

      if (!isPasswordValid) {
        throw new CustomError('Invalid credentials', 401);
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

      logger.info(`User logged in: ${user.email}`);

      res.json({
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            role: user.role,
          },
          token,
          refreshToken,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  logout: async (req: Request, res: Response, next: NextFunction) => {
    try {
      // In a real implementation, you might want to blacklist the token
      // For now, we'll just return success
      res.json({
        success: true,
        message: 'Logged out successfully',
      });
    } catch (error) {
      next(error);
    }
  },

  getMe: async (req: Request, res: Response, next: NextFunction) => {
    try {
      // This assumes you have the authenticate middleware
      const userId = (req as any).user?.id;

      if (!userId) {
        throw new CustomError('User not authenticated', 401);
      }

      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          role: true,
          isActive: true,
          createdAt: true,
        },
      });

      if (!user) {
        throw new CustomError('User not found', 404);
      }

      res.json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  },

  refreshToken: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        throw new CustomError('Refresh token required', 400);
      }

      // Verify refresh token and generate new access token
      // Implementation depends on your JWT setup
      res.json({
        success: true,
        message: 'Token refreshed',
      });
    } catch (error) {
      next(error);
    }
  },
};
