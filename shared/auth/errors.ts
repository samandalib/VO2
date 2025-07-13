/**
 * Custom error classes for authentication
 * Provides better error handling and type safety
 */

import { AuthErrorCode, AUTH_CONFIG } from "./constants";

export class AuthError extends Error {
  public readonly code: AuthErrorCode;
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(
    message: string,
    code: AuthErrorCode,
    statusCode: number = 400,
    isOperational: boolean = true,
  ) {
    super(message);
    this.name = "AuthError";
    this.code = code;
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AuthError);
    }
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      statusCode: this.statusCode,
    };
  }
}

// Specific error classes for common scenarios
export class ValidationError extends AuthError {
  constructor(message: string, field?: string) {
    super(
      field ? `${field}: ${message}` : message,
      AUTH_CONFIG.ERROR_CODES.VALIDATION_ERROR,
      400,
    );
    this.name = "ValidationError";
  }
}

export class InvalidCredentialsError extends AuthError {
  constructor(message: string = "Invalid email or password") {
    super(message, AUTH_CONFIG.ERROR_CODES.INVALID_CREDENTIALS, 401);
    this.name = "InvalidCredentialsError";
  }
}

export class EmailNotVerifiedError extends AuthError {
  constructor(
    message: string = "Please verify your email address before signing in",
  ) {
    super(message, AUTH_CONFIG.ERROR_CODES.EMAIL_NOT_VERIFIED, 403);
    this.name = "EmailNotVerifiedError";
  }
}

export class TokenExpiredError extends AuthError {
  constructor(tokenType: string = "token") {
    super(
      `The ${tokenType} has expired. Please request a new one.`,
      AUTH_CONFIG.ERROR_CODES.TOKEN_EXPIRED,
      400,
    );
    this.name = "TokenExpiredError";
  }
}

export class UserNotFoundError extends AuthError {
  constructor(message: string = "User not found") {
    super(message, AUTH_CONFIG.ERROR_CODES.USER_NOT_FOUND, 404);
    this.name = "UserNotFoundError";
  }
}

export class EmailAlreadyExistsError extends AuthError {
  constructor(message: string = "An account with this email already exists") {
    super(message, AUTH_CONFIG.ERROR_CODES.EMAIL_ALREADY_EXISTS, 409);
    this.name = "EmailAlreadyExistsError";
  }
}

export class InvalidTokenError extends AuthError {
  constructor(tokenType: string = "token") {
    super(
      `Invalid ${tokenType}. Please check the link or request a new one.`,
      AUTH_CONFIG.ERROR_CODES.INVALID_TOKEN,
      400,
    );
    this.name = "InvalidTokenError";
  }
}

export class ProviderMismatchError extends AuthError {
  constructor(provider: string) {
    super(
      `This account uses ${provider} authentication. Please sign in with ${provider}.`,
      AUTH_CONFIG.ERROR_CODES.PROVIDER_MISMATCH,
      400,
    );
    this.name = "ProviderMismatchError";
  }
}

// Type guard to check if error is an AuthError
export function isAuthError(error: unknown): error is AuthError {
  return error instanceof AuthError;
}

// Error factory for creating errors from error codes
export function createAuthError(
  code: AuthErrorCode,
  message?: string,
): AuthError {
  switch (code) {
    case AUTH_CONFIG.ERROR_CODES.INVALID_CREDENTIALS:
      return new InvalidCredentialsError(message);
    case AUTH_CONFIG.ERROR_CODES.EMAIL_NOT_VERIFIED:
      return new EmailNotVerifiedError(message);
    case AUTH_CONFIG.ERROR_CODES.TOKEN_EXPIRED:
      return new TokenExpiredError();
    case AUTH_CONFIG.ERROR_CODES.USER_NOT_FOUND:
      return new UserNotFoundError(message);
    case AUTH_CONFIG.ERROR_CODES.EMAIL_ALREADY_EXISTS:
      return new EmailAlreadyExistsError(message);
    case AUTH_CONFIG.ERROR_CODES.INVALID_TOKEN:
      return new InvalidTokenError();
    case AUTH_CONFIG.ERROR_CODES.PROVIDER_MISMATCH:
      return new ProviderMismatchError(message || "unknown");
    case AUTH_CONFIG.ERROR_CODES.VALIDATION_ERROR:
      return new ValidationError(message || "Validation failed");
    default:
      return new AuthError(message || "Authentication error", code);
  }
}
