import type { Request, Response, NextFunction } from 'express';

// Simple mock user type
interface MockUser {
  id: string;
  phone?: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: MockUser;
    }
  }
}

// Mock auth verification - accepts any token that starts with "mock_token_"
export async function verifyAuth(token: string): Promise<MockUser | null> {
  if (!token) {
    return null;
  }

  // Accept any mock token
  if (token.startsWith('mock_token_')) {
    return {
      id: 'mock_user_' + token.substring(11, 20),
    };
  }

  return null;
}

// Middleware that requires authentication - now always passes with a mock user
export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    const user = await verifyAuth(token);

    if (user) {
      req.user = user;
      return next();
    }
  }

  // For crawling purposes, create a mock user if no auth provided
  req.user = { id: 'anonymous_user' };
  next();
}

// Optional auth - attaches user if token provided, continues regardless
export async function optionalAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    const user = await verifyAuth(token);
    if (user) {
      req.user = user;
    }
  }

  next();
}
