import { Request, Response } from "express";
import { prisma } from "../../client/lib/prisma";
import { EmailService } from "../services/email";
import { generateVerificationToken, isTokenExpired } from "../utils/auth";
import bcrypt from "bcryptjs";

// Helper function to get password reset expiry (1 hour)
function getPasswordResetExpiry(): Date {
  return new Date(Date.now() + 60 * 60 * 1000); // 1 hour
}

// POST /api/auth/forgot-password
export async function forgotPassword(req: Request, res: Response) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        error: "Email is required",
      });
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Don't reveal if user exists or not for security
    if (!user) {
      return res.json({
        message:
          "If an account with this email exists, a password reset link has been sent.",
      });
    }

    // Check if user is email provider (can't reset Google OAuth passwords)
    if (user.provider !== "email") {
      return res.status(400).json({
        error:
          "This account uses Google OAuth. Please sign in with Google instead.",
      });
    }

    // Check if email is verified
    if (!user.emailVerified) {
      return res.status(400).json({
        error:
          "Please verify your email address first before resetting your password.",
      });
    }

    // Generate reset token
    const resetToken = generateVerificationToken();
    const resetExpiry = getPasswordResetExpiry();

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

    res.json({
      message:
        "If an account with this email exists, a password reset link has been sent.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
}

// POST /api/auth/reset-password
export async function resetPassword(req: Request, res: Response) {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({
        error: "Reset token and new password are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        error: "Password must be at least 6 characters long",
      });
    }

    // Find user with this reset token
    const user = await prisma.user.findFirst({
      where: {
        passwordResetToken: token,
      },
    });

    if (!user) {
      return res.status(404).json({
        error: "Invalid or expired reset token",
      });
    }

    // Check if token is expired
    if (user.passwordResetExpiry && isTokenExpired(user.passwordResetExpiry)) {
      return res.status(400).json({
        error: "Reset token has expired. Please request a new password reset.",
        expired: true,
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user with new password and clear reset token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        passwordResetToken: null,
        passwordResetExpiry: null,
      },
    });

    res.json({
      message:
        "Password has been reset successfully. You can now sign in with your new password.",
      success: true,
    });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
}

// GET /api/auth/validate-reset-token
export async function validateResetToken(req: Request, res: Response) {
  try {
    const { token } = req.query;

    if (!token || typeof token !== "string") {
      return res.status(400).json({
        error: "Reset token is required",
        valid: false,
      });
    }

    // Find user with this reset token
    const user = await prisma.user.findFirst({
      where: {
        passwordResetToken: token,
      },
    });

    if (!user) {
      return res.status(404).json({
        error: "Invalid reset token",
        valid: false,
      });
    }

    // Check if token is expired
    if (user.passwordResetExpiry && isTokenExpired(user.passwordResetExpiry)) {
      return res.status(400).json({
        error: "Reset token has expired",
        valid: false,
        expired: true,
      });
    }

    res.json({
      message: "Reset token is valid",
      valid: true,
      email: user.email, // Safe to return email for token validation
    });
  } catch (error) {
    console.error("Validate reset token error:", error);
    res.status(500).json({
      error: "Internal server error",
      valid: false,
    });
  }
}

// GET /reset-password (for link handling with HTML response)
export async function resetPasswordPage(req: Request, res: Response) {
  try {
    const { token } = req.query;

    if (!token || typeof token !== "string") {
      return res.status(400).send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Invalid Reset Link</title>
          <style>
            body { font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; text-align: center; }
            .error { color: #e74c3c; }
          </style>
        </head>
        <body>
          <h1 class="error">Invalid Reset Link</h1>
          <p>This password reset link is invalid. Please request a new password reset.</p>
          <a href="/" style="color: #3498db;">Return to Home</a>
        </body>
        </html>
      `);
    }

    // Find user with this reset token
    const user = await prisma.user.findFirst({
      where: {
        passwordResetToken: token,
      },
    });

    if (!user) {
      return res.status(404).send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Invalid Reset Link</title>
          <style>
            body { font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; text-align: center; }
            .error { color: #e74c3c; }
          </style>
        </head>
        <body>
          <h1 class="error">Invalid Reset Link</h1>
          <p>This password reset link is invalid or has already been used. Please request a new password reset.</p>
          <a href="/" style="color: #3498db;">Return to Home</a>
        </body>
        </html>
      `);
    }

    // Check if token is expired
    if (user.passwordResetExpiry && isTokenExpired(user.passwordResetExpiry)) {
      return res.status(400).send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Reset Link Expired</title>
          <style>
            body { font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; text-align: center; }
            .error { color: #e74c3c; }
          </style>
        </head>
        <body>
          <h1 class="error">Reset Link Expired</h1>
          <p>This password reset link has expired. Please request a new password reset.</p>
          <a href="/" style="color: #3498db;">Return to Home</a>
        </body>
        </html>
      `);
    }

    // Redirect to frontend with token
    const frontendUrl = process.env.APP_BASE_URL || "http://localhost:8080";
    return res.redirect(`${frontendUrl}/?reset-token=${token}`);
  } catch (error) {
    console.error("Reset password page error:", error);
    res.status(500).send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Reset Error</title>
        <style>
          body { font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; text-align: center; }
          .error { color: #e74c3c; }
        </style>
      </head>
      <body>
        <h1 class="error">Reset Error</h1>
        <p>An error occurred while processing your password reset. Please try again or contact support.</p>
        <a href="/" style="color: #3498db;">Return to Home</a>
      </body>
      </html>
    `);
  }
}
