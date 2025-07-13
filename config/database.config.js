// Database configuration for different cloud providers
// This file helps generate the correct DATABASE_URL format

const databaseConfigs = {
  // Railway PostgreSQL
  railway: {
    host: "containers-us-west-{id}.railway.app",
    port: 5432,
    database: "railway",
    username: "postgres",
    ssl: true,
    format: (config) =>
      `postgresql://${config.username}:${config.password}@${config.host}:${config.port}/${config.database}?sslmode=require`,
  },

  // Render PostgreSQL
  render: {
    host: "dpg-{id}-a.{region}.render.com",
    port: 5432,
    database: "vo2max_production",
    username: "vo2max_user",
    ssl: true,
    format: (config) =>
      `postgresql://${config.username}:${config.password}@${config.host}:${config.port}/${config.database}?sslmode=require`,
  },

  // Neon PostgreSQL
  neon: {
    host: "ep-{id}.{region}.aws.neon.tech",
    port: 5432,
    database: "vo2max_production",
    username: "vo2max_user",
    ssl: true,
    format: (config) =>
      `postgresql://${config.username}:${config.password}@${config.host}:${config.port}/${config.database}?sslmode=require`,
  },

  // Supabase PostgreSQL
  supabase: {
    host: "db.{project_id}.supabase.co",
    port: 5432,
    database: "postgres",
    username: "postgres",
    ssl: true,
    format: (config) =>
      `postgresql://${config.username}:${config.password}@${config.host}:${config.port}/${config.database}?sslmode=require`,
  },

  // PlanetScale (MySQL - alternative)
  planetscale: {
    host: "aws.connect.psdb.cloud",
    port: 3306,
    database: "vo2max_production",
    username: "your_username",
    ssl: true,
    format: (config) =>
      `mysql://${config.username}:${config.password}@${config.host}:${config.port}/${config.database}?sslaccept=strict`,
  },

  // Local development
  local: {
    host: "localhost",
    port: 5432,
    database: "vo2max_dev",
    username: "vo2max_user",
    ssl: false,
    format: (config) =>
      `postgresql://${config.username}:${config.password}@${config.host}:${config.port}/${config.database}`,
  },
};

// Database pool configurations for different environments
const poolConfigs = {
  development: {
    min: 2,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  },

  staging: {
    min: 5,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
  },

  production: {
    min: 10,
    max: 30,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  },
};

// Prisma-specific configurations
const prismaConfigs = {
  development: {
    log: ["query", "info", "warn", "error"],
    errorFormat: "pretty",
  },

  staging: {
    log: ["info", "warn", "error"],
    errorFormat: "minimal",
  },

  production: {
    log: ["warn", "error"],
    errorFormat: "minimal",
  },
};

// Helper function to generate DATABASE_URL
function generateDatabaseUrl(provider, config) {
  const template = databaseConfigs[provider];
  if (!template) {
    throw new Error(`Unknown database provider: ${provider}`);
  }

  return template.format({ ...template, ...config });
}

// Helper function to validate DATABASE_URL
function validateDatabaseUrl(url) {
  try {
    const parsed = new URL(url);

    // Check protocol
    if (!["postgresql:", "mysql:", "postgres:"].includes(parsed.protocol)) {
      return { valid: false, error: "Invalid protocol" };
    }

    // Check required components
    if (!parsed.hostname || !parsed.pathname) {
      return { valid: false, error: "Missing hostname or database name" };
    }

    return { valid: true };
  } catch (error) {
    return { valid: false, error: error.message };
  }
}

// Helper function to parse DATABASE_URL
function parseDatabaseUrl(url) {
  try {
    const parsed = new URL(url);

    return {
      protocol: parsed.protocol.replace(":", ""),
      username: parsed.username,
      password: parsed.password,
      hostname: parsed.hostname,
      port: parsed.port || (parsed.protocol === "postgresql:" ? 5432 : 3306),
      database: parsed.pathname.replace("/", ""),
      ssl: parsed.searchParams.get("sslmode") === "require",
    };
  } catch (error) {
    throw new Error(`Invalid DATABASE_URL: ${error.message}`);
  }
}

module.exports = {
  databaseConfigs,
  poolConfigs,
  prismaConfigs,
  generateDatabaseUrl,
  validateDatabaseUrl,
  parseDatabaseUrl,
};

// Example usage:
// const config = generateDatabaseUrl('railway', {
//   password: 'your_password',
//   host: 'containers-us-west-123.railway.app'
// });
