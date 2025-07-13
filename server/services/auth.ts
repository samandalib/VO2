/**
 * Authentication service
 * Centralized business logic for authentication operations
 */

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../../client/lib/prisma";
import { AUTH_CONFIG } from "../../shared/auth/constants";
import {
  AuthError,
  InvalidCredentialsError,
  EmailNotVerifiedError,
  UserNotFoundError,
  EmailAlreadyExistsError,
  ProviderMismatchError,
  TokenExpiredError,
  InvalidTokenError,
} from "../../shared/auth/errors";
import {
  validateSignUpData,
  validateSignInData,
  validateEmail,
  validatePassword,
  validateToken,
  sanitizeEmail,
  sanitizeName,
  assertValid,
} from "../../shared/auth/validation";
import { generateVerificationToken, isTokenExpired } from "../utils/auth";
import { EmailService } from "./email";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export interface AuthResult {
  user: {
    id: string;
    email: string;
    name: string;
    emailVerified: boolean;
    provider: string;
  };
  token: string;
  expiresAt: string;
}

export interface SignUpResult {
  message: string;
  email: string;
  requiresVerification: boolean;
  verificationLink?: string; // Only in development
}

export class AuthService {
  /**
   * Generate JWT token for user
   */
  private static generateJWT(userId: string): string {
    return jwt.sign({ userId }, JWT_SECRET, {
      expiresIn: AUTH_CONFIG.JWT_EXPIRY,
    });
  }

  /**
   * Get token expiry date
   */
  private static getTokenExpiry(): string {
    const expiryMs = 7 * 24 * 60 * 60 * 1000; // 7 days
    return new Date(Date.now() + expiryMs).toISOString();
  }

  /**
   * Hash password
   */
  private static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  /**
   * Verify password
   */
  private static async verifyPassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  /**
   * Sign up with email and password
   */
  static async signUpWithEmail(
    email: string,
    password: string,
    name: string,
  ): Promise<SignUpResult> {
    // Sanitize inputs
    const cleanEmail = sanitizeEmail(email);
    const cleanName = sanitizeName(name);

    // Validate inputs
    const validation = validateSignUpData({
      email: cleanEmail,
      password,
      name: cleanName,
    });
    assertValid(validation);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (existingUser) {
      throw new EmailAlreadyExistsError();
    }

    // Hash password
    const hashedPassword = await this.hashPassword(password);

    // Generate verification token
    const verificationToken = generateVerificationToken();
    const verificationExpiry = new Date(
      Date.now() + AUTH_CONFIG.EXPIRY.EMAIL_VERIFICATION,
    );

    // Create user
    const user = await prisma.user.create({
      data: {
        email: cleanEmail,
        name: cleanName,
        password: hashedPassword,
        provider: AUTH_CONFIG.PROVIDERS.EMAIL,
        emailVerified: false,
        emailVerificationToken: verificationToken,
        emailVerificationExpiry: verificationExpiry,
      },
    });

    // Send verification email
    await EmailService.sendVerificationEmail({
      email: cleanEmail,
      name: cleanName,
      verificationToken,
    });

    const result: SignUpResult = {
      message:
        "Account created successfully! Please check your email to verify your account.",
      email: cleanEmail,
      requiresVerification: true,
    };

    // In development mode, include the verification link
    if (process.env.NODE_ENV !== "production") {
      const baseUrl = process.env.APP_BASE_URL || "http://localhost:8080";
      result.verificationLink = `${baseUrl}/verify-email?token=${verificationToken}`;
    }

    return result;
  }

  /**
   * Sign in with email and password
   */
  static async signInWithEmail(
    email: string,
    password: string,
  ): Promise<AuthResult> {
    // Sanitize inputs
    const cleanEmail = sanitizeEmail(email);

    // Validate inputs
    const validation = validateSignInData({
      email: cleanEmail,
      password,
    });
    assertValid(validation);

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (
      !user ||
      user.provider !== AUTH_CONFIG.PROVIDERS.EMAIL ||
      !user.password
    ) {
      throw new InvalidCredentialsError();
    }

    // Check if email is verified
    if (!user.emailVerified) {
      throw new EmailNotVerifiedError();
    }

    // Verify password
    const isValidPassword = await this.verifyPassword(password, user.password);
    if (!isValidPassword) {
      throw new InvalidCredentialsError();
    }

    // Generate JWT
    const token = this.generateJWT(user.id);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name || "",
        emailVerified: user.emailVerified,
        provider: user.provider,
      },
      token,
      expiresAt: this.getTokenExpiry(),
    };
  }

  /**
   * Verify email address
   */
  static async verifyEmail(token: string): Promise<{ message: string }> {
    // Validate token format
    const validation = validateToken(token);
    assertValid(validation);

    // Find user with this verification token
    const user = await prisma.user.findFirst({
      where: {
        emailVerificationToken: token,
        emailVerified: false,
      },
    });

    if (!user) {
      throw new InvalidTokenError("verification token");
    }

    // Check if token is expired
    if (
      user.emailVerificationExpiry &&
      isTokenExpired(user.emailVerificationExpiry)
    ) {
      throw new TokenExpiredError("verification token");
    }

    // Update user as verified
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        emailVerificationToken: null,
        emailVerificationExpiry: null,
      },
    });

    // Send welcome email
    await EmailService.sendWelcomeEmail(user.email, user.name || "");

    return {
      message:
        "Email verified successfully! You can now sign in to your account.",
    };
  }

  /**
   * Request password reset
   */
  static async requestPasswordReset(
    email: string,
  ): Promise<{ message: string }> {
    // Sanitize input
    const cleanEmail = sanitizeEmail(email);

    // Validate email
    const validation = validateEmail(cleanEmail);
    assertValid(validation);

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    // Don't reveal if user exists for security
    const defaultMessage =
      "If an account with this email exists, a password reset link has been sent.";

    if (!user) {
      return { message: defaultMessage };
    }

    // Check if user is email provider
    if (user.provider !== AUTH_CONFIG.PROVIDERS.EMAIL) {
      throw new ProviderMismatchError("Google");
    }

    // Check if email is verified
    if (!user.emailVerified) {
      throw new EmailNotVerifiedError(
        "Please verify your email address first before resetting your password.",
      );
    }

    // Generate reset token
    const resetToken = generateVerificationToken();
    const resetExpiry = new Date(
      Date.now() + AUTH_CONFIG.EXPIRY.PASSWORD_RESET,
    );

    // Update user with reset token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetToken: resetToken,
        passwordResetExpiry: resetExpiry,
      },
    });

    // Send password reset email
    await EmailService.sendPasswordResetEmail({
      email: user.email,
      name: user.name || "",
      resetToken,
    });

    return { message: defaultMessage };
  }

  /**
   * Reset password with token
   */
  static async resetPassword(
    token: string,
    newPassword: string,
  ): Promise<{ message: string }> {
    // Validate inputs
    const tokenValidation = validateToken(token);
    assertValid(tokenValidation);

    const passwordValidation = validatePassword(newPassword);
    assertValid(passwordValidation);

    // Find user with this reset token
    const user = await prisma.user.findFirst({
      where: {
        passwordResetToken: token,
      },
    });

    if (!user) {
      throw new InvalidTokenError("reset token");
    }

    // Check if token is expired
    if (user.passwordResetExpiry && isTokenExpired(user.passwordResetExpiry)) {
      throw new TokenExpiredError("reset token");
    }

    // Hash new password
    const hashedPassword = await this.hashPassword(newPassword);

    // Update user with new password and clear reset token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        passwordResetToken: null,
        passwordResetExpiry: null,
      },
    });

    return {
      message:
        "Password has been reset successfully. You can now sign in with your new password.",
    };
  }

  /**
   * Get user by ID
   */
  static async getUserById(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        emailVerified: true,
        provider: true,
        picture: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new UserNotFoundError();
    }

    return user;
  }
}
