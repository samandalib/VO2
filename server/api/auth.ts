import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { prisma } from "../../client/lib/prisma";
import { EmailService } from "../services/email";
import {
  generateVerificationToken,
  getVerificationExpiry,
} from "../utils/auth";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

interface GoogleTokenPayload {
  sub: string;
  email: string;
  name: string;
  picture?: string;
  email_verified: boolean;
}

// Verify Google ID token (simplified - in production use Google Auth Library)
async function verifyGoogleToken(
  idToken: string,
): Promise<GoogleTokenPayload | null> {
  try {
    // This is a simplified implementation
    // In production, use @google-cloud/auth-library to verify the token

    // For demo purposes, we'll decode the JWT without verification
    // DO NOT USE THIS IN PRODUCTION
    const payload = jwt.decode(idToken) as any;

    if (!payload || !payload.email) {
      return null;
    }

    return {
      sub: payload.sub,
      email: payload.email,
      name: payload.name || payload.email,
      picture: payload.picture,
      email_verified: payload.email_verified || false,
    };
  } catch (error) {
    console.error("Error verifying Google token:", error);
    return null;
  }
}

// Generate JWT token for user
function generateJWT(userId: string): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" });
}

// Verify JWT token
function verifyJWT(token: string): { userId: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string };
  } catch (error) {
    return null;
  }
}

// POST /api/auth/signup
export async function signUpWithEmail(req: Request, res: Response) {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({
        error: "Email, password, and name are required",
      });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(409).json({
        error: "User with this email already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate verification token
    const verificationToken = generateVerificationToken();
    const verificationExpiry = getVerificationExpiry();

    // Create user in database
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        provider: "email",
        emailVerified: false,
        emailVerificationToken: verificationToken,
        emailVerificationExpiry: verificationExpiry,
      },
    });

    // Send verification email
    await EmailService.sendVerificationEmail({
      email,
      name,
      verificationToken,
    });

    // Return success message without JWT token (user must verify email first)
    const response: any = {
      message:
        "Account created successfully! Please check your email to verify your account.",
      email,
      requiresVerification: true,
    };

    // In development mode, include the verification link
    if (process.env.NODE_ENV !== "production") {
      const baseUrl = process.env.APP_BASE_URL || "http://localhost:8080";
      response.verificationLink = `${baseUrl}/verify-email?token=${verificationToken}`;
    }

    res.status(201).json(response);
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
}

// POST /api/auth/signin
export async function signInWithEmail(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "Email and password are required",
      });
    }

    // Find user in database
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || user.provider !== "email" || !user.password) {
      return res.status(401).json({
        error: "Invalid credentials",
      });
    }

    // Check if email is verified
    if (!user.emailVerified) {
      return res.status(403).json({
        error:
          "Please verify your email address before signing in. Check your inbox for the verification email.",
        requiresVerification: true,
      });
    }

    // Check password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({
        error: "Invalid credentials",
      });
    }

    // Generate JWT
    const token = generateJWT(user.id);

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      user: userWithoutPassword,
      token,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    });
  } catch (error) {
    console.error("Signin error:", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
}

// POST /api/auth/google
export async function authenticateWithGoogle(req: Request, res: Response) {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ message: "ID token is required" });
    }

    const payload = await verifyGoogleToken(idToken);
    if (!payload) {
      return res.status(401).json({ message: "Invalid ID token" });
    }

    // Find or create user in database
    let user = await prisma.user.findUnique({
      where: { email: payload.email },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: payload.email,
          name: payload.name,
          picture: payload.picture,
          provider: "google",
          googleId: payload.sub,
        },
      });
    } else {
      // Update user info
      user = await prisma.user.update({
        where: { email: payload.email },
        data: {
          name: payload.name,
          picture: payload.picture,
        },
      });
    }

    // Generate JWT
    const token = generateJWT(user.id);

    res.json({
      user,
      token,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    });
  } catch (error) {
    console.error("Google authentication error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// GET /api/auth/me
export async function getCurrentUser(req: Request, res: Response) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.substring(7);
    const decoded = verifyJWT(token);
    if (!decoded) {
      return res.status(401).json({ message: "Invalid token" });
    }

    // Find user by ID in database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Get current user error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// POST /api/auth/signout
export async function signOut(req: Request, res: Response) {
  try {
    // In production, you might want to blacklist the token
    res.json({ message: "Signed out successfully" });
  } catch (error) {
    console.error("Sign out error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Middleware to authenticate requests
export function authenticateToken(req: Request, res: Response, next: any) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.substring(7);
  const decoded = verifyJWT(token);
  if (!decoded) {
    return res.status(401).json({ message: "Invalid token" });
  }

  // Add user ID to request
  (req as any).userId = decoded.userId;
  next();
}
