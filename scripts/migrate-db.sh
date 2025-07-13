#!/bin/bash

# Database migration script for different environments
# Usage: ./scripts/migrate-db.sh [environment]
# Environments: development, staging, production

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Get environment parameter
ENVIRONMENT=${1:-development}

echo -e "${GREEN}🚀 Starting database migration for ${ENVIRONMENT} environment${NC}"

# Load environment variables
if [ -f ".env.${ENVIRONMENT}" ]; then
    echo -e "${YELLOW}📂 Loading environment variables from .env.${ENVIRONMENT}${NC}"
    export $(cat .env.${ENVIRONMENT} | grep -v '^#' | xargs)
else
    echo -e "${RED}❌ Environment file .env.${ENVIRONMENT} not found${NC}"
    exit 1
fi

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo -e "${RED}❌ DATABASE_URL not set in environment file${NC}"
    exit 1
fi

echo -e "${YELLOW}🔍 Checking database connection...${NC}"

# Test database connection
if ! npx prisma db push --preview-feature > /dev/null 2>&1; then
    echo -e "${RED}❌ Cannot connect to database. Please check your DATABASE_URL${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Database connection successful${NC}"

# Generate Prisma client
echo -e "${YELLOW}🔄 Generating Prisma client...${NC}"
npx prisma generate

# Run migrations
echo -e "${YELLOW}🔄 Running database migrations...${NC}"
if [ "$ENVIRONMENT" = "production" ]; then
    # For production, use deploy (no prompts)
    npx prisma migrate deploy
else
    # For development/staging, use migrate dev
    npx prisma migrate dev --name "migrate-${ENVIRONMENT}-$(date +%Y%m%d-%H%M%S)"
fi

# Seed database if in development
if [ "$ENVIRONMENT" = "development" ]; then
    echo -e "${YELLOW}🌱 Seeding database...${NC}"
    npm run db:seed
fi

echo -e "${GREEN}✅ Database migration completed successfully for ${ENVIRONMENT}${NC}"

# Optional: Run database health check
echo -e "${YELLOW}🔍 Running database health check...${NC}"
npm run db:test

echo -e "${GREEN}🎉 All done! Database is ready for ${ENVIRONMENT} environment${NC}"
