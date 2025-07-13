// Sentry configuration for error tracking
// This file provides setup for both client and server-side error tracking

import * as Sentry from "@sentry/node";
import * as SentryReact from "@sentry/react";
import { Integrations } from "@sentry/tracing";

// Environment-specific Sentry configurations
const sentryConfigs = {
  development: {
    enabled: false, // Disable in development
    tracesSampleRate: 1.0,
    debug: true,
    environment: "development",
  },
  staging: {
    enabled: true,
    tracesSampleRate: 0.5, // Sample 50% of transactions
    debug: false,
    environment: "staging",
  },
  production: {
    enabled: true,
    tracesSampleRate: 0.1, // Sample 10% of transactions to reduce quota usage
    debug: false,
    environment: "production",
  },
};

// Server-side Sentry configuration (Node.js/Express)
export function initServerSentry() {
  const environment = process.env.NODE_ENV || "development";
  const config = sentryConfigs[environment];

  if (!config.enabled) {
    console.log("Sentry disabled for", environment);
    return;
  }

  if (!process.env.SENTRY_DSN) {
    console.warn("SENTRY_DSN not configured, skipping Sentry initialization");
    return;
  }

  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: config.environment,
    tracesSampleRate: config.tracesSampleRate,
    debug: config.debug,

    // Performance monitoring
    integrations: [
      new Sentry.Integrations.Http({ tracing: true }),
      new Sentry.Integrations.Express({ app: true }),
      new Sentry.Integrations.Postgres(),
    ],

    // Release tracking
    release:
      process.env.SENTRY_RELEASE || `vo2max@${process.env.npm_package_version}`,

    // Error filtering
    beforeSend(event, hint) {
      // Filter out development errors
      if (environment === "development") {
        return null;
      }

      // Filter out specific errors you don't want to track
      const error = hint.originalException;
      if (error && error.message) {
        // Skip common non-critical errors
        if (error.message.includes("Network Error")) {
          return null;
        }
        if (error.message.includes("Loading chunk")) {
          return null;
        }
      }

      return event;
    },

    // Add user context
    initialScope: {
      tags: {
        component: "backend",
      },
    },
  });

  console.log(`Sentry initialized for ${environment} environment`);
}

// Client-side Sentry configuration (React)
export function initClientSentry() {
  const environment = import.meta.env.VITE_APP_ENV || "development";
  const config = sentryConfigs[environment];

  if (!config.enabled) {
    console.log("Sentry disabled for", environment);
    return;
  }

  if (!import.meta.env.VITE_SENTRY_DSN) {
    console.warn(
      "VITE_SENTRY_DSN not configured, skipping Sentry initialization",
    );
    return;
  }

  SentryReact.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    environment: config.environment,
    tracesSampleRate: config.tracesSampleRate,
    debug: config.debug,

    // Performance monitoring
    integrations: [
      new Integrations.BrowserTracing({
        // Set up automatic route change tracking for React Router
        routingInstrumentation: SentryReact.reactRouterV6Instrumentation(
          React.useEffect,
          useLocation,
          useNavigationType,
          createRoutesFromChildren,
          matchRoutes,
        ),
      }),
    ],

    // Release tracking
    release:
      import.meta.env.VITE_SENTRY_RELEASE ||
      `vo2max-frontend@${import.meta.env.VITE_APP_VERSION}`,

    // Error filtering
    beforeSend(event, hint) {
      // Filter out development errors
      if (environment === "development") {
        return null;
      }

      // Filter out specific client errors
      const error = hint.originalException;
      if (error && error.message) {
        // Skip non-critical client errors
        if (error.message.includes("ChunkLoadError")) {
          return null;
        }
        if (error.message.includes("Loading CSS chunk")) {
          return null;
        }
        if (error.message.includes("Script error")) {
          return null;
        }
      }

      return event;
    },

    // Add user context
    initialScope: {
      tags: {
        component: "frontend",
      },
    },
  });

  console.log(`Sentry initialized for ${environment} environment`);
}

// Express middleware for server error handling
export function sentryErrorHandler() {
  return [
    // Request handler must be the first middleware
    Sentry.Handlers.requestHandler(),

    // TracingHandler creates a trace for every incoming request
    Sentry.Handlers.tracingHandler(),

    // Error handler must be registered before any other error middleware
    Sentry.Handlers.errorHandler({
      shouldHandleError(error) {
        // Capture all 4xx and 5xx errors
        return error.status >= 400;
      },
    }),
  ];
}

// Custom error boundary for React
export const SentryErrorBoundary = SentryReact.ErrorBoundary;

// Helper functions for manual error reporting
export function captureError(error, context = {}) {
  Sentry.captureException(error, {
    tags: context.tags,
    extra: context.extra,
    user: context.user,
  });
}

export function captureMessage(message, level = "info", context = {}) {
  Sentry.captureMessage(message, level, {
    tags: context.tags,
    extra: context.extra,
    user: context.user,
  });
}

// Performance monitoring helpers
export function startTransaction(name, operation) {
  return Sentry.startTransaction({
    name,
    op: operation,
  });
}

export function addBreadcrumb(message, category = "default", level = "info") {
  Sentry.addBreadcrumb({
    message,
    category,
    level,
    timestamp: Date.now() / 1000,
  });
}

// User context helpers
export function setUserContext(user) {
  Sentry.setUser({
    id: user.id,
    email: user.email,
    username: user.name,
  });
}

export function clearUserContext() {
  Sentry.setUser(null);
}

// Custom Sentry integration for VO2Max app
export class VO2MaxSentryIntegration {
  static id = "VO2MaxIntegration";

  name = VO2MaxSentryIntegration.id;

  setupOnce() {
    // Add custom tags for VO2Max app
    Sentry.setTag("app", "vo2max-training");
    Sentry.setTag("version", process.env.npm_package_version || "unknown");

    // Add custom context
    Sentry.setContext("app_info", {
      name: "VO2Max Training App",
      version: process.env.npm_package_version || "unknown",
      environment: process.env.NODE_ENV || "development",
    });
  }
}

// Health check integration
export function setupSentryHealthCheck(app) {
  app.get("/health/sentry", (req, res) => {
    try {
      // Test Sentry connection
      Sentry.captureMessage("Health check", "info");
      res.json({ sentry: "ok", timestamp: new Date().toISOString() });
    } catch (error) {
      Sentry.captureException(error);
      res.status(500).json({ sentry: "error", error: error.message });
    }
  });
}

export default {
  initServerSentry,
  initClientSentry,
  sentryErrorHandler,
  SentryErrorBoundary,
  captureError,
  captureMessage,
  startTransaction,
  addBreadcrumb,
  setUserContext,
  clearUserContext,
  VO2MaxSentryIntegration,
  setupSentryHealthCheck,
};
