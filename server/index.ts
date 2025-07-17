import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { handleDemo } from "./routes/demo";

import { chat } from "./routes/chat";
import { authenticate } from "./middleware/auth";
import {
  signUp,
  signIn,
  verifyEmail,
  forgotPassword,
  resetPassword,
  getCurrentUser,
  signOut,
} from "./routes/auth";
import {
  verifyEmailFromLink,
  resendVerification,
} from "./api/email-verification";
import { validateResetToken, resetPasswordPage } from "./api/password-reset";
import { authenticateWithGoogle } from "./api/auth";
import {
  getWeeklyMetrics,
  createWeeklyMetric,
  updateWeeklyMetric,
  deleteWeeklyMetric,
  getSessionMetrics,
  createSessionMetric,
  updateSessionMetric,
  deleteSessionMetric,
  getBiomarkers,
  createBiomarker,
  updateBiomarker,
  deleteBiomarker,
} from "./api/metrics";
import openaiAssistantRouter from "./api/openai-assistant";

// Load environment variables from .env file
dotenv.config();

export function createServer() {
  const app = express();

  // Security middleware disabled for debugging

  // Middleware
  app.use(
    cors({
      origin:
        process.env.NODE_ENV === "production"
          ? ["https://your-domain.com"] // Replace with your production domain
          : ["http://localhost:3000", "http://localhost:8080"],
      credentials: true,
    }),
  );
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    res.json({ message: "Hello from Express server v2!" });
  });

  app.get("/api/demo", handleDemo);

  // OpenAI Assistant chat endpoint
  app.use("/api", openaiAssistantRouter);

  // Chat with Assistant
  app.post("/api/chat", chat);

  // Authentication routes (refactored)
  app.post("/api/auth/signup", signUp);
  app.post("/api/auth/signin", signIn);
  app.post("/api/auth/verify-email", verifyEmail);
  app.post("/api/auth/forgot-password", forgotPassword);
  app.post("/api/auth/reset-password", resetPassword);
  app.get("/api/auth/me", authenticate, getCurrentUser);
  app.post("/api/auth/signout", signOut);

  // Legacy Google OAuth (keeping for now)
  app.post("/api/auth/google", authenticateWithGoogle);

  // Email verification routes (keeping existing)
  app.post("/api/auth/resend-verification", resendVerification);
  app.get("/verify-email", verifyEmailFromLink);

  // Password reset routes (keeping existing)
  app.get("/api/auth/validate-reset-token", validateResetToken);
  app.get("/reset-password", resetPasswordPage);

  // Metrics routes (protected with authentication)
  // Weekly Metrics
  app.get("/api/metrics/weekly/:userId", authenticate, getWeeklyMetrics);
  app.post("/api/metrics/weekly", authenticate, createWeeklyMetric);
  app.put("/api/metrics/weekly/:id", authenticate, updateWeeklyMetric);
  app.delete("/api/metrics/weekly/:id", authenticate, deleteWeeklyMetric);

  // Session Metrics
  app.get("/api/metrics/session/:userId", authenticate, getSessionMetrics);
  app.post("/api/metrics/session", authenticate, createSessionMetric);
  app.put("/api/metrics/session/:id", authenticate, updateSessionMetric);
  app.delete("/api/metrics/session/:id", authenticate, deleteSessionMetric);

  // Biomarkers
  app.get("/api/metrics/biomarkers/:userId", authenticate, getBiomarkers);
  app.post("/api/metrics/biomarkers", authenticate, createBiomarker);
  app.put("/api/metrics/biomarkers/:id", authenticate, updateBiomarker);
  app.delete("/api/metrics/biomarkers/:id", authenticate, deleteBiomarker);

  return app;
}
