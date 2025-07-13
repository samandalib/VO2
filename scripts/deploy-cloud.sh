#!/bin/bash

# Cloud deployment script for different hosting providers
# Usage: ./scripts/deploy-cloud.sh [provider] [environment]
# Providers: vercel, railway, render
# Environments: staging, production

set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

PROVIDER=${1:-vercel}
ENVIRONMENT=${2:-staging}

echo -e "${GREEN}🚀 Deploying to ${PROVIDER} (${ENVIRONMENT} environment)${NC}"

case $PROVIDER in
  "vercel")
    deploy_vercel
    ;;
  "railway")
    deploy_railway
    ;;
  "render")
    deploy_render
    ;;
  *)
    echo -e "${RED}❌ Unknown provider: $PROVIDER${NC}"
    echo "Available providers: vercel, railway, render"
    exit 1
    ;;
esac

deploy_vercel() {
  echo -e "${YELLOW}📦 Deploying frontend to Vercel...${NC}"
  
  # Check if Vercel CLI is installed
  if ! command -v vercel &> /dev/null; then
    echo -e "${YELLOW}Installing Vercel CLI...${NC}"
    npm install -g vercel
  fi

  # Build the application
  echo -e "${YELLOW}🏗️ Building application...${NC}"
  npm run build

  # Deploy to Vercel
  if [ "$ENVIRONMENT" = "production" ]; then
    echo -e "${YELLOW}🚀 Deploying to production...${NC}"
    vercel --prod --confirm
  else
    echo -e "${YELLOW}🚀 Deploying to staging...${NC}"
    vercel --confirm
  fi

  echo -e "${GREEN}✅ Vercel deployment completed!${NC}"
}

deploy_railway() {
  echo -e "${YELLOW}🚂 Deploying backend to Railway...${NC}"
  
  # Check if Railway CLI is installed
  if ! command -v railway &> /dev/null; then
    echo -e "${YELLOW}Installing Railway CLI...${NC}"
    npm install -g @railway/cli
  fi

  # Login check
  if ! railway whoami &> /dev/null; then
    echo -e "${RED}❌ Please login to Railway first: railway login${NC}"
    exit 1
  fi

  # Deploy to Railway
  echo -e "${YELLOW}🚀 Deploying to Railway...${NC}"
  railway up --environment $ENVIRONMENT

  echo -e "${GREEN}✅ Railway deployment completed!${NC}"
}

deploy_render() {
  echo -e "${YELLOW}🔄 Deploying to Render...${NC}"
  
  # Render deployments are typically git-based
  # This script helps prepare the deployment
  
  echo -e "${YELLOW}🏗️ Building application...${NC}"
  npm run build

  echo -e "${YELLOW}📝 Render deployment is git-based.${NC}"
  echo -e "${YELLOW}Push to the main branch to trigger deployment.${NC}"
  
  if [ -f "render.yaml" ]; then
    echo -e "${GREEN}✅ render.yaml configuration found${NC}"
  else
    echo -e "${RED}❌ render.yaml configuration not found${NC}"
    exit 1
  fi

  echo -e "${GREEN}✅ Ready for Render deployment!${NC}"
}

# Health check after deployment
health_check() {
  local URL=$1
  echo -e "${YELLOW}🔍 Running health check on ${URL}...${NC}"
  
  # Wait a bit for deployment to settle
  sleep 30
  
  if curl -f "${URL}/health" --max-time 30; then
    echo -e "${GREEN}✅ Health check passed!${NC}"
  else
    echo -e "${RED}❌ Health check failed!${NC}"
    exit 1
  fi
}

echo -e "${GREEN}🎉 Deployment script completed!${NC}"
