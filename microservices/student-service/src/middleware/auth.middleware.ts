import { Request, Response, NextFunction } from 'express';
import axios from 'axios';
import { UnauthorizedError } from '@school-management/shared';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token =
      req.cookies?.token ||
      req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      throw new UnauthorizedError('Authentication required');
    }

    // Verify token with auth service
    const authServiceUrl = process.env.AUTH_SERVICE_URL || 'http://localhost:3001';
    const response = await axios.get(`${authServiceUrl}/api/v1/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data.success) {
      req.user = response.data.data;
      next();
    } else {
      throw new UnauthorizedError('Invalid token');
    }
  } catch (error: any) {
    if (error.response?.status === 401) {
      return next(new UnauthorizedError('Invalid or expired token'));
    }
    next(new UnauthorizedError('Authentication failed'));
  }
};
