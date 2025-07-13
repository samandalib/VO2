/**
 * Authentication middleware
 * Centralized auth middleware with better error handling and logging
 */

import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthError, InvalidTokenError } from "../../shared/auth/errors";
import { prisma } from "../../client/lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Extend Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        emailVerified: boolean;
      };
    }
  }
}

/**
 * Extract token from Authorization header
 */
function extractToken(authHeader?: string): string | null {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  return authHeader.substring(7);
}

/**
 * Verify JWT token
 */
function verifyJWT(token: string): { userId: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string };
  } catch (error) {
    return null;
  }
}

/**
 * Base authentication middleware
 * Extracts and validates JWT token, adds user to request
 */
export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const authHeader = req.headers.authorization;
    const token = extractToken(authHeader);

    if (!token) {
      throw new InvalidTokenError("No authentication token provided");
    }

    const decoded = verifyJWT(token);
    if (!decoded) {
      throw new InvalidTokenError("Invalid authentication token");
    }

    // Fetch user from database to ensure they still exist
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        emailVerified: true,
      },
    });

    if (!user) {
      throw new InvalidTokenError("User not found");
    }

    // Add user to request
    req.user = user;
    next();
  } catch (error) {
    if (error instanceof AuthError) {
      return res.status(error.statusCode).json({
        error: error.message,
        code: error.code,
      });
    }

    console.error("Authentication middleware error:", error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
}

/**
 * Require verified email middleware
 * Must be used after authenticate middleware
 */
export function requireVerifiedEmail(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (!req.user) {
    return res.status(401).json({
      error: "Authentication required",
    });
  }

  if (!req.user.emailVerified) {
    return res.status(403).json({
      error:
        "Email verification required. Please verify your email address first.",
      code: "EMAIL_NOT_VERIFIED",
    });
  }

  next();
}

/**
 * Optional authentication middleware
 * Adds user to request if token is valid, but doesn't fail if not
 */
export async function optionalAuthenticate(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const authHeader = req.headers.authorization;
    const token = extractToken(authHeader);

    if (!token) {
      return next(); // No token, continue without user
    }

    const decoded = verifyJWT(token);
    if (!decoded) {
      return next(); // Invalid token, continue without user
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        emailVerified: true,
      },
    });

    if (user) {
      req.user = user;
    }

    next();
  } catch (error) {
    console.error("Optional authentication middleware error:", error);
    next(); // Continue without user on error
  }
}

/**
 * Rate limiting middleware factory
 */
export function createRateLimit(
  maxAttempts: number,
  windowMs: number,
  keyGenerator: (req: Request) => string = (req) =>
    req.ip || req.connection.remoteAddress || "unknown",
) {
  const attempts = new Map<string, { count: number; resetTime: number }>();

  return (req: Request, res: Response, next: NextFunction) => {
    const key = keyGenerator(req);
    const now = Date.now();
    const record = attempts.get(key);

    if (record && now < record.resetTime) {
      if (record.count >= maxAttempts) {
        return res.status(429).json({
          error: "Too many requests. Please try again later.",
          retryAfter: Math.ceil((record.resetTime - now) / 1000),
        });
      }
      record.count++;
    } else {
      attempts.set(key, {
        count: 1,
        resetTime: now + windowMs,
      });
    }

    next();
  };
}

/**
 * Error handler for auth routes
 */
export function handleAuthError(
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (error instanceof AuthError) {
    return res.status(error.statusCode).json({
      error: error.message,
      code: error.code,
    });
  }

  console.error("Unhandled auth error:", error);
  return res.status(500).json({
    error: "Internal server error",
  });
}
