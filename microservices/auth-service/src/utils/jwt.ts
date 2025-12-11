import jwt from 'jsonwebtoken';
import { UserRole } from '@school-management/shared';

export interface TokenPayload {
  id: string;
  email: string;
  role: UserRole;
  service?: string;
}

export const generateToken = (payload: TokenPayload): string => {
  return jwt.sign(
    { ...payload, service: 'auth-service' },
    process.env.JWT_SECRET || 'default-secret',
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    }
  );
};

export const generateRefreshToken = (payload: TokenPayload): string => {
  return jwt.sign(
    payload,
    process.env.JWT_REFRESH_SECRET || 'default-refresh-secret',
    {
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
    }
  );
};

export const verifyToken = (token: string): TokenPayload => {
  return jwt.verify(
    token,
    process.env.JWT_SECRET || 'default-secret'
  ) as TokenPayload;
};

export const verifyRefreshToken = (token: string): TokenPayload => {
  return jwt.verify(
    token,
    process.env.JWT_REFRESH_SECRET || 'default-refresh-secret'
  ) as TokenPayload;
};
