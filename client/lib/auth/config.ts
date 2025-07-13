/**
 * Client-side authentication configuration
 */

export const AUTH_CLIENT_CONFIG = {
  API_BASE_URL: import.meta.env.VITE_API_URL || "/api",

  // Local storage keys
  STORAGE_KEYS: {
    TOKEN: "auth_token",
    USER: "auth_user",
  },

  // HTTP configuration
  HTTP: {
    TIMEOUT: 10000, // 10 seconds
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 1000, // 1 second
  },

  // Google OAuth
  GOOGLE: {
    CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID,
    DISABLED: import.meta.env.VITE_DISABLE_GOOGLE_OAUTH === "true",
  },
} as const;

// Environment-specific settings
export const isDevelopment = import.meta.env.MODE === "development";
export const isProduction = import.meta.env.MODE === "production";
