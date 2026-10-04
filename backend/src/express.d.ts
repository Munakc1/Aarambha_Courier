// Adds req.user (populated by requireAuth) to Express's Request type.
import "express";

declare global {
  namespace Express {
    interface Request {
      user?: { sub: string; email: string; iat?: number; exp?: number; iss?: string };
    }
  }
}

export {};
