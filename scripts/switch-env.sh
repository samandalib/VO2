#!/bin/bash

# Environment switcher script
# Usage: ./scripts/switch-env.sh [environment]
# Environments: development, staging, production

set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

ENVIRONMENT=${1:-development}

echo -e "${GREEN}🔄 Switching to ${ENVIRONMENT} environment${NC}"

# Check if environment file exists
if [ ! -f ".env.${ENVIRONMENT}" ]; then
    echo -e "${RED}❌ Environment file .env.${ENVIRONMENT} not found${NC}"
    exit 1
fi

# Backup current .env if it exists
if [ -f ".env" ]; then
    echo -e "${YELLOW}📦 Backing up current .env to .env.backup${NC}"
    cp .env .env.backup
fi

# Copy environment file to .env
echo -e "${YELLOW}📂 Copying .env.${ENVIRONMENT} to .env${NC}"
cp ".env.${ENVIRONMENT}" .env

echo -e "${GREEN}✅ Successfully switched to ${ENVIRONMENT} environment${NC}"
echo -e "${YELLOW}💡 Remember to restart your development server${NC}"
