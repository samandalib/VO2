// Comprehensive monitoring configuration
// Includes uptime monitoring, performance tracking, and alerting

import { createPrometheusMetrics } from "./prometheus.config.js";

// Monitoring service configurations
const monitoringServices = {
  // UptimeRobot (Free tier: 50 monitors)
  uptimeRobot: {
    apiKey: process.env.UPTIMEROBOT_API_KEY,
    monitors: [
      {
        name: "VO2Max Frontend",
        url: "https://your-app.com",
        type: "HTTP",
        interval: 300, // 5 minutes
      },
      {
        name: "VO2Max API",
        url: "https://api.your-app.com/health",
        type: "HTTP",
        interval: 300,
      },
      {
        name: "VO2Max Staging",
        url: "https://staging.your-app.com",
        type: "HTTP",
        interval: 600, // 10 minutes
      },
    ],
  },

  // StatusPage.io for status communication
  statusPage: {
    pageId: process.env.STATUSPAGE_PAGE_ID,
    apiKey: process.env.STATUSPAGE_API_KEY,
    components: {
      frontend: "Frontend Application",
      api: "API Backend",
      database: "Database",
      authentication: "Authentication Service",
    },
  },

  // Pingdom (Alternative to UptimeRobot)
  pingdom: {
    apiKey: process.env.PINGDOM_API_KEY,
    checkType: "http",
    interval: 5, // minutes
  },
};

// Performance monitoring configuration
const performanceConfig = {
  // Core Web Vitals thresholds
  webVitals: {
    lcp: {
      good: 2500, // Largest Contentful Paint
      needsImprovement: 4000,
    },
    fid: {
      good: 100, // First Input Delay
      needsImprovement: 300,
    },
    cls: {
      good: 0.1, // Cumulative Layout Shift
      needsImprovement: 0.25,
    },
  },

  // API performance thresholds
  api: {
    responseTime: {
      good: 200, // ms
      warning: 500,
      critical: 1000,
    },
    errorRate: {
      good: 0.01, // 1%
      warning: 0.05, // 5%
      critical: 0.1, // 10%
    },
  },

  // Database performance thresholds
  database: {
    queryTime: {
      good: 50, // ms
      warning: 200,
      critical: 500,
    },
    connectionPool: {
      good: 0.7, // 70% utilization
      warning: 0.85,
      critical: 0.95,
    },
  },
};

// Alert configuration
const alertConfig = {
  channels: {
    slack: {
      webhookUrl: process.env.SLACK_WEBHOOK_URL,
      channel: "#alerts",
      username: "VO2Max Monitor",
      emoji: ":warning:",
    },
    email: {
      smtpHost: process.env.SMTP_HOST,
      smtpPort: process.env.SMTP_PORT,
      smtpUser: process.env.SMTP_USER,
      smtpPass: process.env.SMTP_PASS,
      to: process.env.ALERT_EMAIL_TO?.split(",") || [],
      from: process.env.ALERT_EMAIL_FROM,
    },
    discord: {
      webhookUrl: process.env.DISCORD_WEBHOOK_URL,
    },
  },

  rules: {
    // Critical alerts (immediate notification)
    critical: {
      conditions: [
        "api_response_time > 2000ms",
        "error_rate > 10%",
        "database_connections > 95%",
        "uptime < 99%",
      ],
      cooldown: 300, // 5 minutes between alerts
      channels: ["slack", "email"],
    },

    // Warning alerts (less frequent)
    warning: {
      conditions: [
        "api_response_time > 500ms",
        "error_rate > 5%",
        "database_connections > 85%",
        "ssl_certificate_expires < 7days",
      ],
      cooldown: 1800, // 30 minutes between alerts
      channels: ["slack"],
    },

    // Info alerts (status updates)
    info: {
      conditions: ["deployment_completed", "backup_completed"],
      cooldown: 0,
      channels: ["slack"],
    },
  },
};

// Health check endpoints configuration
const healthChecks = {
  basic: {
    path: "/health",
    checks: ["server", "timestamp"],
  },
  detailed: {
    path: "/health/detailed",
    checks: ["server", "database", "redis", "external_apis"],
  },
  database: {
    path: "/health/db",
    checks: ["database_connection", "migration_status"],
  },
  external: {
    path: "/health/external",
    checks: ["sentry", "auth_providers"],
  },
};

// Metrics collection configuration
const metricsConfig = {
  // Application metrics
  application: {
    requests: {
      total: "Total HTTP requests",
      duration: "Request duration histogram",
      errors: "HTTP errors by status code",
    },
    database: {
      queries: "Database queries total",
      queryDuration: "Database query duration",
      connections: "Active database connections",
    },
    auth: {
      logins: "User logins total",
      registrations: "User registrations total",
      failures: "Authentication failures",
    },
    business: {
      vo2maxCalculations: "VO2Max calculations performed",
      protocolsStarted: "Training protocols started",
      sessionsLogged: "Training sessions logged",
    },
  },

  // Infrastructure metrics
  infrastructure: {
    system: {
      cpuUsage: "CPU utilization percentage",
      memoryUsage: "Memory utilization percentage",
      diskUsage: "Disk utilization percentage",
    },
    network: {
      requestsPerSecond: "Requests per second",
      bandwidth: "Network bandwidth usage",
    },
  },
};

// Monitoring initialization functions
export function initializeMonitoring() {
  const environment = process.env.NODE_ENV || "development";

  if (environment === "development") {
    console.log("Monitoring disabled in development");
    return;
  }

  console.log(`Initializing monitoring for ${environment} environment`);

  // Initialize metrics collection
  initializeMetrics();

  // Set up health checks
  setupHealthChecks();

  // Configure alerts
  setupAlerts();

  console.log("Monitoring initialization completed");
}

function initializeMetrics() {
  // Initialize Prometheus metrics if available
  try {
    createPrometheusMetrics(metricsConfig);
    console.log("Prometheus metrics initialized");
  } catch (error) {
    console.warn("Failed to initialize Prometheus metrics:", error.message);
  }
}

function setupHealthChecks() {
  // Health check implementation will be added to Express app
  console.log("Health checks configured");
}

function setupAlerts() {
  // Alert system setup
  console.log("Alert system configured");
}

// Uptime monitoring setup
export async function setupUptimeMonitoring() {
  if (!monitoringServices.uptimeRobot.apiKey) {
    console.warn("UptimeRobot API key not configured");
    return;
  }

  try {
    // Create monitors via UptimeRobot API
    for (const monitor of monitoringServices.uptimeRobot.monitors) {
      await createUptimeMonitor(monitor);
    }
    console.log("Uptime monitoring configured");
  } catch (error) {
    console.error("Failed to set up uptime monitoring:", error);
  }
}

async function createUptimeMonitor(monitor) {
  // UptimeRobot API implementation
  const response = await fetch("https://api.uptimerobot.com/v2/newMonitor", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      api_key: monitoringServices.uptimeRobot.apiKey,
      format: "json",
      type: monitor.type === "HTTP" ? "1" : "1",
      url: monitor.url,
      friendly_name: monitor.name,
      interval: monitor.interval,
    }),
  });

  const data = await response.json();
  if (data.stat === "ok") {
    console.log(`Created monitor: ${monitor.name}`);
  } else {
    console.error(`Failed to create monitor ${monitor.name}:`, data.error);
  }
}

// Performance monitoring helpers
export function trackWebVitals() {
  // Client-side performance tracking
  if (typeof window !== "undefined") {
    import("web-vitals").then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      function sendToAnalytics(metric) {
        // Send to your analytics service
        console.log("Web Vital:", metric);

        // Send to Sentry
        if (window.Sentry) {
          window.Sentry.addBreadcrumb({
            category: "web-vital",
            message: `${metric.name}: ${metric.value}`,
            level: "info",
          });
        }
      }

      getCLS(sendToAnalytics);
      getFID(sendToAnalytics);
      getFCP(sendToAnalytics);
      getLCP(sendToAnalytics);
      getTTFB(sendToAnalytics);
    });
  }
}

// Custom monitoring middleware for Express
export function createMonitoringMiddleware() {
  const startTime = Date.now();
  let requestCount = 0;

  return (req, res, next) => {
    const requestStart = Date.now();
    requestCount++;

    // Add request ID for tracing
    req.id = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Override res.end to capture response metrics
    const originalEnd = res.end;
    res.end = function (...args) {
      const responseTime = Date.now() - requestStart;

      // Log request metrics
      console.log(
        JSON.stringify({
          timestamp: new Date().toISOString(),
          requestId: req.id,
          method: req.method,
          url: req.url,
          statusCode: res.statusCode,
          responseTime,
          userAgent: req.headers["user-agent"],
          ip: req.ip,
        }),
      );

      // Update metrics
      if (global.metrics) {
        global.metrics.httpRequests.inc({
          method: req.method,
          status_code: res.statusCode,
          route: req.route?.path || req.url,
        });

        global.metrics.httpDuration.observe(
          {
            method: req.method,
            status_code: res.statusCode,
            route: req.route?.path || req.url,
          },
          responseTime / 1000,
        );
      }

      originalEnd.apply(this, args);
    };

    next();
  };
}

// Alert functions
export async function sendAlert(type, message, details = {}) {
  const alertRule = alertConfig.rules[type];
  if (!alertRule) {
    console.error(`Unknown alert type: ${type}`);
    return;
  }

  for (const channel of alertRule.channels) {
    try {
      await sendAlertToChannel(channel, type, message, details);
    } catch (error) {
      console.error(`Failed to send alert to ${channel}:`, error);
    }
  }
}

async function sendAlertToChannel(channel, type, message, details) {
  const config = alertConfig.channels[channel];
  if (!config) return;

  switch (channel) {
    case "slack":
      await sendSlackAlert(config, type, message, details);
      break;
    case "email":
      await sendEmailAlert(config, type, message, details);
      break;
    case "discord":
      await sendDiscordAlert(config, type, message, details);
      break;
  }
}

async function sendSlackAlert(config, type, message, details) {
  const color =
    type === "critical"
      ? "#ff0000"
      : type === "warning"
        ? "#ffaa00"
        : "#00ff00";

  const payload = {
    channel: config.channel,
    username: config.username,
    icon_emoji: config.emoji,
    attachments: [
      {
        color,
        title: `${type.toUpperCase()}: VO2Max App Alert`,
        text: message,
        fields: Object.entries(details).map(([key, value]) => ({
          title: key,
          value: value,
          short: true,
        })),
        footer: "VO2Max Monitoring",
        ts: Math.floor(Date.now() / 1000),
      },
    ],
  };

  await fetch(config.webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

async function sendEmailAlert(config, type, message, details) {
  // Email implementation would go here
  console.log(`Email alert: ${type} - ${message}`);
}

async function sendDiscordAlert(config, type, message, details) {
  const color =
    type === "critical" ? 0xff0000 : type === "warning" ? 0xffaa00 : 0x00ff00;

  const payload = {
    embeds: [
      {
        title: `${type.toUpperCase()}: VO2Max App Alert`,
        description: message,
        color,
        fields: Object.entries(details).map(([key, value]) => ({
          name: key,
          value: value,
          inline: true,
        })),
        footer: {
          text: "VO2Max Monitoring",
        },
        timestamp: new Date().toISOString(),
      },
    ],
  };

  await fetch(config.webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export default {
  monitoringServices,
  performanceConfig,
  alertConfig,
  healthChecks,
  metricsConfig,
  initializeMonitoring,
  setupUptimeMonitoring,
  trackWebVitals,
  createMonitoringMiddleware,
  sendAlert,
};
