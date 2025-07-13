/**
 * Authentication constants and configuration
 * Centralized place for all auth-related constants
 */

export const AUTH_CONFIG = {
  // Token configuration
  JWT_EXPIRY: "7d",

  // Password requirements
  PASSWORD: {
    MIN_LENGTH: 6,
    MAX_LENGTH: 128,
  },

  // Token expiry times
  EXPIRY: {
    EMAIL_VERIFICATION: 24 * 60 * 60 * 1000, // 24 hours
    PASSWORD_RESET: 60 * 60 * 1000, // 1 hour
  },

  // Provider types
  PROVIDERS: {
    EMAIL: "email",
    GOOGLE: "google",
  } as const,

  // Error codes for better error handling
  ERROR_CODES: {
    INVALID_CREDENTIALS: "INVALID_CREDENTIALS",
    EMAIL_NOT_VERIFIED: "EMAIL_NOT_VERIFIED",
    TOKEN_EXPIRED: "TOKEN_EXPIRED",
    USER_NOT_FOUND: "USER_NOT_FOUND",
    EMAIL_ALREADY_EXISTS: "EMAIL_ALREADY_EXISTS",
    INVALID_TOKEN: "INVALID_TOKEN",
    PROVIDER_MISMATCH: "PROVIDER_MISMATCH",
    VALIDATION_ERROR: "VALIDATION_ERROR",
  } as const,

  // Rate limiting
  RATE_LIMITS: {
    PASSWORD_RESET: 3, // Max attempts per hour
    EMAIL_VERIFICATION: 5, // Max resends per hour
  },
} as const;

export type AuthProvider =
  (typeof AUTH_CONFIG.PROVIDERS)[keyof typeof AUTH_CONFIG.PROVIDERS];
export type AuthErrorCode =
  (typeof AUTH_CONFIG.ERROR_CODES)[keyof typeof AUTH_CONFIG.ERROR_CODES];
