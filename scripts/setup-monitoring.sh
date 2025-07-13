#!/bin/bash

# Monitoring setup script
# Usage: ./scripts/setup-monitoring.sh [service] [environment]
# Services: uptimerobot, statuspage, sentry, all
# Environments: staging, production

set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

SERVICE=${1:-all}
ENVIRONMENT=${2:-staging}

echo -e "${GREEN}🔍 Setting up monitoring: ${SERVICE} for ${ENVIRONMENT} environment${NC}"

case $SERVICE in
  "uptimerobot")
    setup_uptimerobot
    ;;
  "statuspage")
    setup_statuspage
    ;;
  "sentry")
    setup_sentry
    ;;
  "all")
    setup_all_monitoring
    ;;
  *)
    echo -e "${RED}❌ Unknown service: $SERVICE${NC}"
    echo "Available services: uptimerobot, statuspage, sentry, all"
    exit 1
    ;;
esac

setup_uptimerobot() {
  echo -e "${YELLOW}📊 Setting up UptimeRobot monitoring...${NC}"
  
  echo -e "${BLUE}📋 UptimeRobot Setup Instructions:${NC}"
  echo -e "${BLUE}1. Sign up at uptimerobot.com${NC}"
  echo -e "${BLUE}2. Go to Settings > API Settings${NC}"
  echo -e "${BLUE}3. Generate API Key${NC}"
  echo -e "${BLUE}4. Add monitors for:${NC}"
  
  if [ "$ENVIRONMENT" = "production" ]; then
    echo -e "   - https://your-app.com (Frontend)"
    echo -e "   - https://api.your-app.com/health (API)"
    echo -e "   - https://api.your-app.com/health/db (Database)"
  else
    echo -e "   - https://staging.your-app.com (Staging Frontend)"
    echo -e "   - https://api-staging.your-app.com/health (Staging API)"
  fi
  
  echo -e "${BLUE}5. Set alert contacts (email, SMS, Slack)${NC}"
  echo -e "${BLUE}6. Configure monitoring intervals (5-15 minutes)${NC}"
  
  echo -e "${YELLOW}💡 Recommended settings:${NC}"
  echo -e "   - Monitor Type: HTTP(s)"
  echo -e "   - Interval: 5 minutes"
  echo -e "   - Alert When: Down"
  echo -e "   - Confirmation: 2 confirmations"
  
  echo -e "${GREEN}✅ UptimeRobot setup instructions provided${NC}"
}

setup_statuspage() {
  echo -e "${YELLOW}📢 Setting up StatusPage.io...${NC}"
  
  echo -e "${BLUE}📋 StatusPage Setup Instructions:${NC}"
  echo -e "${BLUE}1. Sign up at statuspage.io${NC}"
  echo -e "${BLUE}2. Create a new status page${NC}"
  echo -e "${BLUE}3. Add these components:${NC}"
  echo -e "   - Frontend Application"
  echo -e "   - API Backend"
  echo -e "   - Database"
  echo -e "   - Authentication Service"
  
  echo -e "${BLUE}4. Configure component monitors:${NC}"
  if [ "$ENVIRONMENT" = "production" ]; then
    echo -e "   - Frontend: https://your-app.com"
    echo -e "   - API: https://api.your-app.com/health"
    echo -e "   - Database: https://api.your-app.com/health/db"
  else
    echo -e "   - Frontend: https://staging.your-app.com"
    echo -e "   - API: https://api-staging.your-app.com/health"
  fi
  
  echo -e "${BLUE}5. Set up incident templates${NC}"
  echo -e "${BLUE}6. Configure subscriber notifications${NC}"
  echo -e "${BLUE}7. Customize status page design${NC}"
  
  echo -e "${GREEN}✅ StatusPage setup instructions provided${NC}"
}

setup_sentry() {
  echo -e "${YELLOW}🐛 Setting up Sentry error tracking...${NC}"
  
  echo -e "${BLUE}📋 Sentry Setup Instructions:${NC}"
  echo -e "${BLUE}1. Sign up at sentry.io${NC}"
  echo -e "${BLUE}2. Create organization: 'vo2max-training'${NC}"
  echo -e "${BLUE}3. Create projects:${NC}"
  echo -e "   - vo2max-frontend-${ENVIRONMENT}"
  echo -e "   - vo2max-backend-${ENVIRONMENT}"
  
  echo -e "${BLUE}4. Get DSN URLs from project settings${NC}"
  echo -e "${BLUE}5. Add environment variables:${NC}"
  
  if [ "$ENVIRONMENT" = "production" ]; then
    echo -e "   Frontend (Vercel):"
    echo -e "     VITE_SENTRY_DSN=https://...@sentry.io/project-id"
    echo -e "   Backend (Railway):"
    echo -e "     SENTRY_DSN=https://...@sentry.io/project-id"
  else
    echo -e "   Frontend (Vercel Preview):"
    echo -e "     VITE_SENTRY_DSN=https://...@sentry.io/staging-project-id"
    echo -e "   Backend (Railway Staging):"
    echo -e "     SENTRY_DSN=https://...@sentry.io/staging-project-id"
  fi
  
  echo -e "${BLUE}6. Configure alert rules${NC}"
  echo -e "${BLUE}7. Set up Slack/email notifications${NC}"
  echo -e "${BLUE}8. Configure performance monitoring${NC}"
  
  echo -e "${YELLOW}💡 Recommended Sentry settings:${NC}"
  echo -e "   - Sample Rate: 10% for production, 50% for staging"
  echo -e "   - Alert on: New issues, regressions, spike in errors"
  echo -e "   - Performance threshold: 1 second for API calls"
  
  echo -e "${GREEN}✅ Sentry setup instructions provided${NC}"
}

setup_all_monitoring() {
  echo -e "${YELLOW}🚀 Setting up comprehensive monitoring...${NC}"
  
  setup_sentry
  echo ""
  setup_uptimerobot
  echo ""
  setup_statuspage
  echo ""
  
  echo -e "${BLUE}📋 Additional Monitoring Tools (Optional):${NC}"
  echo -e "${BLUE}1. LogRocket for session replay${NC}"
  echo -e "${BLUE}2. Hotjar for user behavior analytics${NC}"
  echo -e "${BLUE}3. Google Analytics for usage metrics${NC}"
  echo -e "${BLUE}4. Mixpanel for event tracking${NC}"
  
  echo -e "${YELLOW}🔧 Infrastructure Monitoring:${NC}"
  echo -e "${BLUE}1. Vercel Analytics (automatic)${NC}"
  echo -e "${BLUE}2. Railway Metrics (automatic)${NC}"
  echo -e "${BLUE}3. Database monitoring via provider${NC}"
  
  echo -e "${GREEN}✅ Comprehensive monitoring setup instructions provided${NC}"
}

# Environment-specific configuration
configure_environment() {
  echo -e "${YELLOW}🌍 Environment-specific configuration for ${ENVIRONMENT}:${NC}"
  
  if [ "$ENVIRONMENT" = "production" ]; then
    echo -e "${BLUE}Production Monitoring Setup:${NC}"
    echo -e "  - Monitor intervals: 1-5 minutes"
    echo -e "  - Alert thresholds: Strict (99.9% uptime)"
    echo -e "  - Error tracking: All errors"
    echo -e "  - Performance monitoring: Enabled"
    echo -e "  - User monitoring: Enabled"
    echo -e "  - Security monitoring: Enabled"
  else
    echo -e "${BLUE}Staging Monitoring Setup:${NC}"
    echo -e "  - Monitor intervals: 5-15 minutes"
    echo -e "  - Alert thresholds: Relaxed (95% uptime)"
    echo -e "  - Error tracking: Major errors only"
    echo -e "  - Performance monitoring: Basic"
    echo -e "  - User monitoring: Basic"
    echo -e "  - Security monitoring: Basic"
  fi
}

# Health check endpoints verification
verify_health_endpoints() {
  echo -e "${YELLOW}🔍 Verifying health check endpoints...${NC}"
  
  if [ "$ENVIRONMENT" = "production" ]; then
    FRONTEND_URL="https://your-app.com"
    API_URL="https://api.your-app.com"
  else
    FRONTEND_URL="https://staging.your-app.com"
    API_URL="https://api-staging.your-app.com"
  fi
  
  echo -e "${BLUE}Testing endpoints:${NC}"
  
  # Test frontend
  if curl -f "$FRONTEND_URL" --max-time 10 >/dev/null 2>&1; then
    echo -e "  ✅ Frontend: $FRONTEND_URL"
  else
    echo -e "  ❌ Frontend: $FRONTEND_URL"
  fi
  
  # Test API health
  if curl -f "$API_URL/health" --max-time 10 >/dev/null 2>&1; then
    echo -e "  ✅ API Health: $API_URL/health"
  else
    echo -e "  ❌ API Health: $API_URL/health"
  fi
  
  # Test database health
  if curl -f "$API_URL/health/db" --max-time 10 >/dev/null 2>&1; then
    echo -e "  ✅ Database Health: $API_URL/health/db"
  else
    echo -e "  ❌ Database Health: $API_URL/health/db"
  fi
}

# Create monitoring dashboard script
create_monitoring_dashboard() {
  echo -e "${YELLOW}📊 Creating monitoring dashboard...${NC}"
  
  cat > monitoring-dashboard.html << 'EOF'
<!DOCTYPE html>
<html>
<head>
    <title>VO2Max Monitoring Dashboard</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .status { padding: 10px; margin: 10px 0; border-radius: 5px; }
        .up { background-color: #d4edda; color: #155724; }
        .down { background-color: #f8d7da; color: #721c24; }
        .warning { background-color: #fff3cd; color: #856404; }
    </style>
</head>
<body>
    <h1>VO2Max Monitoring Dashboard</h1>
    
    <h2>Service Status</h2>
    <div id="status-container">
        <div class="status up">Frontend: ✅ Operational</div>
        <div class="status up">API: ✅ Operational</div>
        <div class="status up">Database: ✅ Operational</div>
        <div class="status up">Authentication: ✅ Operational</div>
    </div>
    
    <h2>Quick Links</h2>
    <ul>
        <li><a href="https://uptimerobot.com/dashboard" target="_blank">UptimeRobot Dashboard</a></li>
        <li><a href="https://sentry.io" target="_blank">Sentry Error Tracking</a></li>
        <li><a href="https://statuspage.io" target="_blank">Status Page</a></li>
        <li><a href="/health" target="_blank">Health Check</a></li>
    </ul>
    
    <script>
        // Add real-time status checking here
        setInterval(checkStatus, 30000); // Check every 30 seconds
        
        function checkStatus() {
            // Implement status checking logic
            console.log('Checking service status...');
        }
    </script>
</body>
</html>
EOF

  echo -e "${GREEN}✅ Monitoring dashboard created: monitoring-dashboard.html${NC}"
}

# Main execution
configure_environment
echo ""

if [ "$SERVICE" = "all" ]; then
  verify_health_endpoints
  echo ""
  create_monitoring_dashboard
fi

echo -e "${GREEN}🎉 Monitoring setup completed for ${ENVIRONMENT} environment!${NC}"
echo -e "${YELLOW}💡 Next steps:${NC}"
echo -e "  1. Configure the monitoring services as instructed above"
echo -e "  2. Add environment variables to your hosting providers"
echo -e "  3. Test all monitoring endpoints"
echo -e "  4. Set up alert channels (Slack, email)"
echo -e "  5. Create runbooks for incident response"
