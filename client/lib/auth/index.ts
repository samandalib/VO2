/**
 * Authentication module barrel export
 * Provides clean imports for auth functionality
 */

// Main hook
export { useAuth } from "@/contexts/SupabaseAuthContext";

// Types
export * from "./types";

// API client
export { AuthAPI } from "./api";

// Configuration
export { AUTH_CLIENT_CONFIG } from "./config";

// Re-export context for legacy compatibility
export { useAuth as useAuthContext } from "@/contexts/AuthContext";
