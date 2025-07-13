import { z } from "zod";

// Environment variable validation schema
const envSchema = z.object({
  // Core
  NODE_ENV: z
    .enum(["development", "staging", "production"])
    .default("development"),
  PORT: z.coerce.number().default(3000),

  // Database
  DATABASE_URL: z.string().url("DATABASE_URL must be a valid PostgreSQL URL"),

  // Authentication
  JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters"),
  GOOGLE_CLIENT_ID: z.string().optional(),

  // Optional APIs
  OPENAI_API_KEY: z.string().optional(),

  // Client variables (optional validation)
  VITE_API_URL: z.string().url().optional(),
  VITE_GOOGLE_CLIENT_ID: z.string().optional(),
  VITE_APP_ENV: z.string().optional(),

  // Optional monitoring
  SENTRY_DSN: z.string().url().optional(),

  // Security (production)
  RATE_LIMIT_WINDOW_MS: z.coerce.number().optional(),
  RATE_LIMIT_MAX_REQUESTS: z.coerce.number().optional(),
});

export type Env = z.infer<typeof envSchema>;

// Validate and export environment variables
function validateEnv(): Env {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors
        .map((err) => `${err.path.join(".")}: ${err.message}`)
        .join("\n");

      throw new Error(
        `❌ Invalid environment variables:\n${missingVars}\n\n` +
          `Please check your .env file and ensure all required variables are set correctly.`,
      );
    }
    throw error;
  }
}

export const env = validateEnv();

// Helper to check if we're in specific environments
export const isDevelopment = env.NODE_ENV === "development";
export const isStaging = env.NODE_ENV === "staging";
export const isProduction = env.NODE_ENV === "production";

// Log environment info (non-sensitive)
if (isDevelopment) {
  console.log(`🌍 Environment: ${env.NODE_ENV}`);
  console.log(`🚀 Server will run on port: ${env.PORT}`);
  console.log(`💾 Database: ${env.DATABASE_URL.split("@")[1] || "configured"}`);
}
