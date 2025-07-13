/**
 * Enhanced useAuth hook
 * Provides better error handling and type safety
 */

import { useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import { AuthError, isAuthError } from "../../shared/auth/errors";
import { AUTH_CONFIG } from "../../shared/auth/constants";

export interface UseAuthResult {
  // State
  user: any;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;

  // Actions
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<any>;
  signOut: () => Promise<void>;
  forgotPassword: (email: string) => Promise<any>;
  verifyEmail: (token: string) => Promise<any>;
  clearError: () => void;

  // Utilities
  isEmailVerificationRequired: (error: unknown) => boolean;
  isPasswordResetRequired: (error: unknown) => boolean;
  getErrorMessage: (error: unknown) => string;
}

export function useAuth(): UseAuthResult {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  // Helper functions for error handling
  const isEmailVerificationRequired = (error: unknown): boolean => {
    if (isAuthError(error)) {
      return error.code === AUTH_CONFIG.ERROR_CODES.EMAIL_NOT_VERIFIED;
    }
    if (error instanceof Error) {
      return error.message.includes("verify your email");
    }
    return false;
  };

  const isPasswordResetRequired = (error: unknown): boolean => {
    if (isAuthError(error)) {
      return error.code === AUTH_CONFIG.ERROR_CODES.INVALID_CREDENTIALS;
    }
    if (error instanceof Error) {
      return error.message.includes("Invalid credentials");
    }
    return false;
  };

  const getErrorMessage = (error: unknown): string => {
    if (isAuthError(error)) {
      return error.message;
    }
    if (error instanceof Error) {
      return error.message;
    }
    return "An unexpected error occurred";
  };

  return {
    // State
    user: context.user,
    isLoading: context.isLoading,
    isAuthenticated: context.isAuthenticated,
    error: context.error,

    // Actions
    signIn: context.signInWithEmail,
    signUp: context.signUpWithEmail,
    signOut: context.signOut,
    forgotPassword: context.forgotPassword,
    verifyEmail: context.verifyEmail,
    clearError: context.clearError,

    // Utilities
    isEmailVerificationRequired,
    isPasswordResetRequired,
    getErrorMessage,
  };
}
