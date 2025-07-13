/**
 * Authentication routes
 * Simplified route handlers using centralized AuthService
 */

import { Request, Response } from "express";
import { AuthService } from "../services/auth";
import { authenticate, handleAuthError } from "../middleware/auth";

/**
 * POST /api/auth/signup
 */
export async function signUp(req: Request, res: Response) {
  try {
    const { email, password, name } = req.body;
    const result = await AuthService.signUpWithEmail(email, password, name);
    res.status(201).json(result);
  } catch (error) {
    handleAuthError(error, req, res, () => {});
  }
}

/**
 * POST /api/auth/signin
 */
export async function signIn(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    const result = await AuthService.signInWithEmail(email, password);
    res.json(result);
  } catch (error) {
    handleAuthError(error, req, res, () => {});
  }
}

/**
 * POST /api/auth/verify-email
 */
export async function verifyEmail(req: Request, res: Response) {
  try {
    const { token } = req.body;
    const result = await AuthService.verifyEmail(token);
    res.json(result);
  } catch (error) {
    handleAuthError(error, req, res, () => {});
  }
}

/**
 * POST /api/auth/forgot-password
 */
export async function forgotPassword(req: Request, res: Response) {
  try {
    const { email } = req.body;
    const result = await AuthService.requestPasswordReset(email);
    res.json(result);
  } catch (error) {
    handleAuthError(error, req, res, () => {});
  }
}

/**
 * POST /api/auth/reset-password
 */
export async function resetPassword(req: Request, res: Response) {
  try {
    const { token, password } = req.body;
    const result = await AuthService.resetPassword(token, password);
    res.json(result);
  } catch (error) {
    handleAuthError(error, req, res, () => {});
  }
}

/**
 * GET /api/auth/me
 */
export async function getCurrentUser(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({
        error: "Authentication required",
      });
    }

    const user = await AuthService.getUserById(req.user.id);
    res.json(user);
  } catch (error) {
    handleAuthError(error, req, res, () => {});
  }
}

/**
 * POST /api/auth/signout
 */
export async function signOut(req: Request, res: Response) {
  try {
    // In production, you might want to blacklist the token
    res.json({ message: "Signed out successfully" });
  } catch (error) {
    handleAuthError(error, req, res, () => {});
  }
}
