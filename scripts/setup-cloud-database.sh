#!/bin/bash

# Cloud database setup script
# Usage: ./scripts/setup-cloud-database.sh [environment] [provider]
# Environments: staging, production
# Providers: railway, render, neon, supabase

set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

ENVIRONMENT=${1:-staging}
PROVIDER=${2:-railway}

echo -e "${GREEN}🗄️ Setting up ${PROVIDER} database for ${ENVIRONMENT} environment${NC}"

case $PROVIDER in
  "railway")
    setup_railway_database
    ;;
  "render")
    setup_render_database
    ;;
  "neon")
    setup_neon_database
    ;;
  "supabase")
    setup_supabase_database
    ;;
  *)
    echo -e "${RED}❌ Unknown provider: $PROVIDER${NC}"
    echo "Available providers: railway, render, neon, supabase"
    exit 1
    ;;
esac

setup_railway_database() {
  echo -e "${YELLOW}🚂 Setting up Railway PostgreSQL database...${NC}"
  
  # Check if Railway CLI is installed
  if ! command -v railway &> /dev/null; then
    echo -e "${YELLOW}Installing Railway CLI...${NC}"
    npm install -g @railway/cli
  fi

  # Check if logged in
  if ! railway whoami &> /dev/null; then
    echo -e "${RED}❌ Please login to Railway first: railway login${NC}"
    exit 1
  fi

  echo -e "${YELLOW}📋 Railway Database Setup Instructions:${NC}"
  echo -e "${BLUE}1. Add PostgreSQL service to your Railway project:${NC}"
  echo -e "   railway add postgresql"
  echo -e "${BLUE}2. Get the database URL:${NC}"
  echo -e "   railway env"
  echo -e "${BLUE}3. The DATABASE_URL will be automatically available in your environment${NC}"
  
  echo -e "${GREEN}✅ Railway database setup instructions provided${NC}"
}

setup_render_database() {
  echo -e "${YELLOW}🔄 Setting up Render PostgreSQL database...${NC}"
  
  echo -e "${YELLOW}📋 Render Database Setup Instructions:${NC}"
  echo -e "${BLUE}1. Go to your Render dashboard${NC}"
  echo -e "${BLUE}2. Create a new PostgreSQL database${NC}"
  echo -e "${BLUE}3. Configure database settings:${NC}"
  echo -e "   - Name: vo2max-db-${ENVIRONMENT}"
  echo -e "   - User: vo2max_user"
  echo -e "   - Database: vo2max_${ENVIRONMENT}"
  echo -e "${BLUE}4. Note the connection details from the dashboard${NC}"
  echo -e "${BLUE}5. Add DATABASE_URL to your web service environment variables${NC}"
  
  echo -e "${GREEN}✅ Render database setup instructions provided${NC}"
}

setup_neon_database() {
  echo -e "${YELLOW}⚡ Setting up Neon PostgreSQL database...${NC}"
  
  echo -e "${YELLOW}📋 Neon Database Setup Instructions:${NC}"
  echo -e "${BLUE}1. Go to neon.tech and create an account${NC}"
  echo -e "${BLUE}2. Create a new project: vo2max-${ENVIRONMENT}${NC}"
  echo -e "${BLUE}3. Create a new database: vo2max_${ENVIRONMENT}${NC}"
  echo -e "${BLUE}4. Copy the connection string from the dashboard${NC}"
  echo -e "${BLUE}5. Add DATABASE_URL to your hosting provider's environment variables${NC}"
  
  echo -e "${GREEN}✅ Neon database setup instructions provided${NC}"
}

setup_supabase_database() {
  echo -e "${YELLOW}⚡ Setting up Supabase PostgreSQL database...${NC}"
  
  echo -e "${YELLOW}📋 Supabase Database Setup Instructions:${NC}"
  echo -e "${BLUE}1. Go to supabase.com and create an account${NC}"
  echo -e "${BLUE}2. Create a new project: vo2max-${ENVIRONMENT}${NC}"
  echo -e "${BLUE}3. Get the database URL from Settings > Database${NC}"
  echo -e "${BLUE}4. Add DATABASE_URL to your hosting provider's environment variables${NC}"
  
  echo -e "${GREEN}✅ Supabase database setup instructions provided${NC}"
}

# Database migration and seeding functions
run_migrations() {
  local DATABASE_URL=$1
  
  echo -e "${YELLOW}🔄 Running database migrations...${NC}"
  
  if [ -z "$DATABASE_URL" ]; then
    echo -e "${RED}❌ DATABASE_URL not provided${NC}"
    exit 1
  fi
  
  # Export DATABASE_URL for Prisma
  export DATABASE_URL=$DATABASE_URL
  
  # Generate Prisma client
  echo -e "${YELLOW}🔧 Generating Prisma client...${NC}"
  npx prisma generate
  
  # Run migrations
  echo -e "${YELLOW}📊 Running database migrations...${NC}"
  npx prisma migrate deploy
  
  echo -e "${GREEN}✅ Database migrations completed${NC}"
}

seed_database() {
  local DATABASE_URL=$1
  
  if [ "$ENVIRONMENT" = "production" ]; then
    echo -e "${YELLOW}⚠️ Skipping database seeding for production environment${NC}"
    return
  fi
  
  echo -e "${YELLOW}🌱 Seeding database...${NC}"
  
  # Export DATABASE_URL for Prisma
  export DATABASE_URL=$DATABASE_URL
  
  # Run seed script
  npm run db:seed
  
  echo -e "${GREEN}✅ Database seeding completed${NC}"
}

# Test database connection
test_connection() {
  local DATABASE_URL=$1
  
  echo -e "${YELLOW}🔍 Testing database connection...${NC}"
  
  if [ -z "$DATABASE_URL" ]; then
    echo -e "${RED}❌ DATABASE_URL not provided${NC}"
    exit 1
  fi
  
  # Export DATABASE_URL for testing
  export DATABASE_URL=$DATABASE_URL
  
  # Test connection
  if npm run db:test; then
    echo -e "${GREEN}✅ Database connection successful${NC}"
  else
    echo -e "${RED}❌ Database connection failed${NC}"
    exit 1
  fi
}

# Interactive setup function
interactive_setup() {
  echo -e "${BLUE}🛠️ Interactive Database Setup${NC}"
  echo -e "${YELLOW}This will guide you through setting up your cloud database${NC}"
  echo ""
  
  read -p "Enter your DATABASE_URL: " DATABASE_URL
  
  if [ -n "$DATABASE_URL" ]; then
    echo -e "${GREEN}✅ DATABASE_URL provided${NC}"
    
    echo -e "${YELLOW}Testing connection...${NC}"
    test_connection "$DATABASE_URL"
    
    echo -e "${YELLOW}Running migrations...${NC}"
    run_migrations "$DATABASE_URL"
    
    if [ "$ENVIRONMENT" != "production" ]; then
      read -p "Do you want to seed the database? (y/n): " SEED_DB
      if [ "$SEED_DB" = "y" ] || [ "$SEED_DB" = "Y" ]; then
        seed_database "$DATABASE_URL"
      fi
    fi
    
    echo -e "${GREEN}🎉 Database setup completed successfully!${NC}"
  else
    echo -e "${RED}❌ No DATABASE_URL provided${NC}"
    exit 1
  fi
}

# Check if DATABASE_URL is provided as environment variable
if [ -n "$DATABASE_URL" ]; then
  echo -e "${GREEN}✅ DATABASE_URL found in environment${NC}"
  test_connection "$DATABASE_URL"
  run_migrations "$DATABASE_URL"
  
  if [ "$ENVIRONMENT" != "production" ]; then
    seed_database "$DATABASE_URL"
  fi
else
  echo -e "${YELLOW}⚠️ DATABASE_URL not found in environment${NC}"
  echo -e "${YELLOW}Run this script interactively or set DATABASE_URL environment variable${NC}"
  
  read -p "Do you want to run interactive setup? (y/n): " INTERACTIVE
  if [ "$INTERACTIVE" = "y" ] || [ "$INTERACTIVE" = "Y" ]; then
    interactive_setup
  fi
fi

echo -e "${GREEN}🎉 Cloud database setup completed!${NC}"
