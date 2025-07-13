import { prisma } from "../prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";
const JWT_EXPIRES_IN = "7d";

export interface CreateUserData {
  email: string;
  name: string;
  password?: string;
  provider: "email" | "google";
  googleId?: string;
  picture?: string;
}

export class AuthService {
  /**
   * Create a new user
   */
  static async createUser(userData: CreateUserData) {
    const hashedPassword = userData.password
      ? await bcrypt.hash(userData.password, 12)
      : undefined;

    const user = await prisma.user.create({
      data: {
        email: userData.email,
        name: userData.name,
        password: hashedPassword,
        provider: userData.provider,
        googleId: userData.googleId,
        picture: userData.picture,
      },
    });

    return this.sanitizeUser(user);
  }

  /**
   * Find user by email
   */
  static async findUserByEmail(email: string) {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    return user ? this.sanitizeUser(user) : null;
  }

  /**
   * Find user by ID
   */
  static async findUserById(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    return user ? this.sanitizeUser(user) : null;
  }

  /**
   * Verify password
   */
  static async verifyPassword(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  /**
   * Generate JWT token
   */
  static generateToken(userId: string): string {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  }

  /**
   * Verify JWT token
   */
  static verifyToken(token: string): { userId: string } | null {
    try {
      return jwt.verify(token, JWT_SECRET) as { userId: string };
    } catch (error) {
      return null;
    }
  }

  /**
   * Remove sensitive data from user object
   */
  private static sanitizeUser(user: any) {
    const { password, googleId, ...sanitizedUser } = user;
    return {
      ...sanitizedUser,
      provider: user.provider || "email",
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  }

  /**
   * Sign up with email and password
   */
  static async signUpWithEmail(email: string, password: string, name: string) {
    // Check if user already exists
    const existingUser = await this.findUserByEmail(email);
    if (existingUser) {
      throw new Error("User already exists with this email");
    }

    // Create new user
    const user = await this.createUser({
      email,
      name,
      password,
      provider: "email",
    });

    // Generate token
    const token = this.generateToken(user.id);

    return {
      user,
      token,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
    };
  }

  /**
   * Sign in with email and password
   */
  static async signInWithEmail(email: string, password: string) {
    // Find user
    const userRecord = await prisma.user.findUnique({
      where: { email },
    });

    if (!userRecord) {
      throw new Error("Invalid email or password");
    }

    // Check password
    if (!userRecord.password) {
      throw new Error(
        "This account uses Google sign-in. Please use Google to sign in.",
      );
    }

    const isPasswordValid = await this.verifyPassword(
      password,
      userRecord.password,
    );
    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }

    const user = this.sanitizeUser(userRecord);
    const token = this.generateToken(user.id);

    return {
      user,
      token,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    };
  }

  /**
   * Get user from token
   */
  static async getUserFromToken(token: string) {
    const decoded = this.verifyToken(token);
    if (!decoded) {
      return null;
    }

    return this.findUserById(decoded.userId);
  }
}
