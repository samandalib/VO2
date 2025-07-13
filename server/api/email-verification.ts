import { Request, Response } from "express";
import { prisma } from "../../client/lib/prisma";
import { EmailService } from "../services/email";
import {
  generateVerificationToken,
  getVerificationExpiry,
  isTokenExpired,
} from "../utils/auth";

// POST /api/auth/verify-email
export async function verifyEmail(req: Request, res: Response) {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        error: "Verification token is required",
      });
    }

    // Find user with this verification token
    const user = await prisma.user.findFirst({
      where: {
        emailVerificationToken: token,
        emailVerified: false,
      },
    });

    if (!user) {
      return res.status(404).json({
        error: "Invalid or expired verification token",
      });
    }

    // Check if token is expired
    if (
      user.emailVerificationExpiry &&
      isTokenExpired(user.emailVerificationExpiry)
    ) {
      return res.status(400).json({
        error:
          "Verification token has expired. Please request a new verification email.",
        expired: true,
      });
    }

    // Update user as verified
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        emailVerificationToken: null,
        emailVerificationExpiry: null,
      },
    });

    // Send welcome email
    await EmailService.sendWelcomeEmail(
      updatedUser.email,
      updatedUser.name || "",
    );

    res.json({
      message:
        "Email verified successfully! You can now sign in to your account.",
      verified: true,
    });
  } catch (error) {
    console.error("Email verification error:", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
}

// POST /api/auth/resend-verification
export async function resendVerification(req: Request, res: Response) {
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

    if (!user) {
      // Don't reveal if user exists or not for security
      return res.json({
        message:
          "If an account with this email exists and is unverified, a new verification email has been sent.",
      });
    }

    if (user.emailVerified) {
      return res.status(400).json({
        error: "This email address is already verified",
      });
    }

    // Generate new verification token
    const verificationToken = generateVerificationToken();
    const verificationExpiry = getVerificationExpiry();

    // Update user with new token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerificationToken: verificationToken,
        emailVerificationExpiry: verificationExpiry,
      },
    });

    // Send new verification email
    await EmailService.sendVerificationEmail({
      email: user.email,
      name: user.name || "",
      verificationToken,
    });

    res.json({
      message:
        "A new verification email has been sent. Please check your inbox.",
    });
  } catch (error) {
    console.error("Resend verification error:", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
}

// GET /api/auth/verify-email (for link verification)
export async function verifyEmailFromLink(req: Request, res: Response) {
  try {
    const { token } = req.query;

    if (!token || typeof token !== "string") {
      return res.status(400).send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Verification Error</title>
          <style>
            body { font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; text-align: center; }
            .error { color: #e74c3c; }
          </style>
        </head>
        <body>
          <h1 class="error">Verification Error</h1>
          <p>Invalid verification link. Please check your email for the correct link or request a new verification email.</p>
        </body>
        </html>
      `);
    }

    // Find user with this verification token
    const user = await prisma.user.findFirst({
      where: {
        emailVerificationToken: token,
        emailVerified: false,
      },
    });

    if (!user) {
      return res.status(404).send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Verification Error</title>
          <style>
            body { font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; text-align: center; }
            .error { color: #e74c3c; }
          </style>
        </head>
        <body>
          <h1 class="error">Verification Error</h1>
          <p>Invalid or expired verification token. Please request a new verification email.</p>
          <a href="/" style="color: #3498db;">Return to Home</a>
        </body>
        </html>
      `);
    }

    // Check if token is expired
    if (
      user.emailVerificationExpiry &&
      isTokenExpired(user.emailVerificationExpiry)
    ) {
      return res.status(400).send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Verification Expired</title>
          <style>
            body { font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; text-align: center; }
            .error { color: #e74c3c; }
          </style>
        </head>
        <body>
          <h1 class="error">Verification Link Expired</h1>
          <p>This verification link has expired. Please request a new verification email.</p>
          <a href="/" style="color: #3498db;">Return to Home</a>
        </body>
        </html>
      `);
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

    // Return success page
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Email Verified!</title>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            max-width: 600px; 
            margin: 50px auto; 
            padding: 20px; 
            text-align: center;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            margin: 0;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .container {
            background: white;
            padding: 40px;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .success { color: #27ae60; }
          .btn {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 50px;
            font-weight: bold;
            display: inline-block;
            margin-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1 class="success">✅ Email Verified Successfully!</h1>
          <p>Welcome to VO₂Max Training, ${user.name}! Your email has been verified and your account is now active.</p>
          <p>You can now sign in and start tracking your fitness journey.</p>
          <a href="/" class="btn">Go to Sign In</a>
        </div>
      </body>
      </html>
    `);
  } catch (error) {
    console.error("Email verification from link error:", error);
    res.status(500).send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Verification Error</title>
        <style>
          body { font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; text-align: center; }
          .error { color: #e74c3c; }
        </style>
      </head>
      <body>
        <h1 class="error">Verification Error</h1>
        <p>An error occurred while verifying your email. Please try again or contact support.</p>
        <a href="/" style="color: #3498db;">Return to Home</a>
      </body>
      </html>
    `);
  }
}
