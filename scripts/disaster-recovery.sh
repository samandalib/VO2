#!/bin/bash

# Disaster Recovery Automation Script
# Usage: ./scripts/disaster-recovery.sh [scenario] [target-env] [recovery-point]
# Scenarios: database-corruption, site-outage, data-loss, full-restore
# Target-env: staging, production
# Recovery-point: latest, YYYY-MM-DD, backup-id

set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

SCENARIO=${1:-database-corruption}
TARGET_ENV=${2:-staging}
RECOVERY_POINT=${3:-latest}
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

echo -e "${RED}🚨 DISASTER RECOVERY INITIATED${NC}"
echo -e "${YELLOW}Scenario: ${SCENARIO}${NC}"
echo -e "${YELLOW}Target Environment: ${TARGET_ENV}${NC}"
echo -e "${YELLOW}Recovery Point: ${RECOVERY_POINT}${NC}"
echo -e "${YELLOW}Timestamp: ${TIMESTAMP}${NC}"

# Confirm before proceeding
if [ "$TARGET_ENV" = "production" ]; then
  echo -e "${RED}⚠️  WARNING: This will affect PRODUCTION environment!${NC}"
  read -p "Are you absolutely sure you want to proceed? (type 'PROCEED'): " confirm
  if [ "$confirm" != "PROCEED" ]; then
    echo -e "${RED}❌ Recovery cancelled${NC}"
    exit 1
  fi
fi

case $SCENARIO in
  "database-corruption")
    recover_database_corruption
    ;;
  "site-outage")
    recover_site_outage
    ;;
  "data-loss")
    recover_data_loss
    ;;
  "full-restore")
    recover_full_system
    ;;
  *)
    echo -e "${RED}❌ Unknown scenario: $SCENARIO${NC}"
    echo "Available scenarios: database-corruption, site-outage, data-loss, full-restore"
    exit 1
    ;;
esac

echo -e "${GREEN}✅ Disaster recovery completed!${NC}"

recover_database_corruption() {
  echo -e "${YELLOW}🗄️ Recovering from database corruption...${NC}"
  
  # Step 1: Assess damage
  echo -e "${BLUE}Step 1: Assessing database damage...${NC}"
  assess_database_damage
  
  # Step 2: Stop application writes
  echo -e "${BLUE}Step 2: Stopping application writes...${NC}"
  stop_application_writes
  
  # Step 3: Create emergency backup of current state
  echo -e "${BLUE}Step 3: Creating emergency backup...${NC}"
  create_emergency_backup
  
  # Step 4: Restore from backup
  echo -e "${BLUE}Step 4: Restoring from backup...${NC}"
  restore_database_from_backup
  
  # Step 5: Validate restoration
  echo -e "${BLUE}Step 5: Validating restoration...${NC}"
  validate_database_restoration
  
  # Step 6: Resume application
  echo -e "${BLUE}Step 6: Resuming application...${NC}"
  resume_application
  
  # Step 7: Post-recovery tasks
  echo -e "${BLUE}Step 7: Post-recovery tasks...${NC}"
  post_recovery_tasks
}

recover_site_outage() {
  echo -e "${YELLOW}🌐 Recovering from site outage...${NC}"
  
  # Step 1: Check hosting provider status
  echo -e "${BLUE}Step 1: Checking hosting provider status...${NC}"
  check_hosting_status
  
  # Step 2: Verify DNS resolution
  echo -e "${BLUE}Step 2: Verifying DNS resolution...${NC}"
  verify_dns
  
  # Step 3: Check SSL certificates
  echo -e "${BLUE}Step 3: Checking SSL certificates...${NC}"
  check_ssl_certificates
  
  # Step 4: Activate backup hosting if needed
  echo -e "${BLUE}Step 4: Checking backup hosting options...${NC}"
  activate_backup_hosting
  
  # Step 5: Monitor recovery
  echo -e "${BLUE}Step 5: Monitoring recovery...${NC}"
  monitor_recovery
}

recover_data_loss() {
  echo -e "${YELLOW}💾 Recovering from data loss...${NC}"
  
  # Step 1: Stop all writes immediately
  echo -e "${BLUE}Step 1: Emergency stop of all writes...${NC}"
  emergency_stop_writes
  
  # Step 2: Preserve current state
  echo -e "${BLUE}Step 2: Preserving current state...${NC}"
  preserve_current_state
  
  # Step 3: Assess data loss scope
  echo -e "${BLUE}Step 3: Assessing data loss scope...${NC}"
  assess_data_loss
  
  # Step 4: Restore from backups
  echo -e "${BLUE}Step 4: Restoring from backups...${NC}"
  restore_from_backups
  
  # Step 5: Replay transactions if possible
  echo -e "${BLUE}Step 5: Attempting transaction replay...${NC}"
  replay_transactions
  
  # Step 6: Validate data consistency
  echo -e "${BLUE}Step 6: Validating data consistency...${NC}"
  validate_data_consistency
  
  # Step 7: Resume operations
  echo -e "${BLUE}Step 7: Resuming operations...${NC}"
  resume_operations
}

recover_full_system() {
  echo -e "${YELLOW}🌟 Performing full system restore...${NC}"
  
  # Combine all recovery procedures
  recover_database_corruption
  recover_site_outage
  
  # Additional full system tasks
  echo -e "${BLUE}Restoring application configuration...${NC}"
  restore_application_config
  
  echo -e "${BLUE}Verifying all system components...${NC}"
  verify_all_systems
}

# Individual recovery functions

assess_database_damage() {
  echo -e "${YELLOW}🔍 Assessing database damage...${NC}"
  
  load_environment
  
  if [ -z "$DATABASE_URL" ]; then
    echo -e "${RED}❌ DATABASE_URL not found${NC}"
    exit 1
  fi
  
  # Try to connect to database
  if psql $DATABASE_URL -c "SELECT 1;" >/dev/null 2>&1; then
    echo -e "${GREEN}✅ Database connection successful${NC}"
    
    # Check table integrity
    psql $DATABASE_URL -c "
      SELECT schemaname, tablename, attname, n_distinct, correlation 
      FROM pg_stats 
      WHERE schemaname = 'public'
      LIMIT 10;
    " || echo -e "${YELLOW}⚠️ Some tables may be corrupted${NC}"
    
  else
    echo -e "${RED}❌ Cannot connect to database${NC}"
    echo -e "${YELLOW}Database appears to be severely corrupted or unavailable${NC}"
  fi
}

stop_application_writes() {
  echo -e "${YELLOW}✋ Stopping application writes...${NC}"
  
  if [ "$TARGET_ENV" = "production" ]; then
    # For production, we might need to:
    # 1. Put application in maintenance mode
    # 2. Stop write operations via feature flags
    # 3. Scale down write-capable instances
    
    echo -e "${YELLOW}⚠️ Production write stop not implemented - manual intervention required${NC}"
    read -p "Confirm that application writes have been stopped manually (y/N): " confirm
    
    if [ "$confirm" != "y" ]; then
      echo -e "${RED}❌ Cannot proceed without stopping writes${NC}"
      exit 1
    fi
  else
    echo -e "${GREEN}✅ Staging environment - writes can be stopped safely${NC}"
  fi
}

create_emergency_backup() {
  echo -e "${YELLOW}💾 Creating emergency backup of current state...${NC}"
  
  local emergency_backup="emergency_backup_${TIMESTAMP}"
  local backup_dir="/tmp/${emergency_backup}"
  
  mkdir -p $backup_dir
  
  # Try to backup whatever is still accessible
  if psql $DATABASE_URL -c "SELECT 1;" >/dev/null 2>&1; then
    echo -e "${BLUE}📊 Database still accessible - creating dump...${NC}"
    pg_dump $DATABASE_URL > "${backup_dir}/emergency_db.sql" || echo -e "${YELLOW}⚠️ Partial backup only${NC}"
    gzip "${backup_dir}/emergency_db.sql"
    
    # Upload emergency backup
    upload_emergency_backup "${backup_dir}/emergency_db.sql.gz"
  else
    echo -e "${YELLOW}⚠️ Database not accessible - cannot create emergency backup${NC}"
  fi
  
  # Cleanup
  rm -rf $backup_dir
}

restore_database_from_backup() {
  echo -e "${YELLOW}🔄 Restoring database from backup...${NC}"
  
  local backup_file=$(find_backup_file)
  
  if [ -z "$backup_file" ]; then
    echo -e "${RED}❌ No suitable backup found${NC}"
    exit 1
  fi
  
  echo -e "${BLUE}📥 Downloading backup: $backup_file${NC}"
  download_backup $backup_file
  
  local local_backup="/tmp/restore_backup.sql"
  
  # Decompress if needed
  if [[ $backup_file == *.gz ]]; then
    gunzip -c "/tmp/$(basename $backup_file)" > $local_backup
  else
    cp "/tmp/$(basename $backup_file)" $local_backup
  fi
  
  echo -e "${BLUE}🗑️ Dropping existing database schema...${NC}"
  psql $DATABASE_URL -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;" || {
    echo -e "${RED}❌ Failed to drop schema${NC}"
    exit 1
  }
  
  echo -e "${BLUE}📥 Restoring database...${NC}"
  psql $DATABASE_URL < $local_backup || {
    echo -e "${RED}❌ Database restoration failed${NC}"
    exit 1
  }
  
  # Cleanup
  rm -f $local_backup "/tmp/$(basename $backup_file)"
  
  echo -e "${GREEN}✅ Database restoration completed${NC}"
}

validate_database_restoration() {
  echo -e "${YELLOW}✅ Validating database restoration...${NC}"
  
  # Check basic connectivity
  if ! psql $DATABASE_URL -c "SELECT 1;" >/dev/null 2>&1; then
    echo -e "${RED}❌ Database connection failed after restoration${NC}"
    exit 1
  fi
  
  # Check table counts
  echo -e "${BLUE}📊 Checking table counts...${NC}"
  psql $DATABASE_URL -c "
    SELECT 
      schemaname,
      tablename,
      n_tup_ins as inserts,
      n_tup_upd as updates,
      n_tup_del as deletes,
      n_live_tup as live_tuples
    FROM pg_stat_user_tables 
    ORDER BY live_tuples DESC;
  "
  
  # Run application-specific validation
  echo -e "${BLUE}🧪 Running application validation...${NC}"
  npm run db:test || echo -e "${YELLOW}⚠️ Application validation failed - may need manual verification${NC}"
  
  echo -e "${GREEN}✅ Database validation completed${NC}"
}

resume_application() {
  echo -e "${YELLOW}🚀 Resuming application...${NC}"
  
  if [ "$TARGET_ENV" = "production" ]; then
    echo -e "${YELLOW}⚠️ Production resume not automated - manual intervention required${NC}"
    echo -e "${BLUE}Manual steps required:${NC}"
    echo -e "  1. Remove maintenance mode"
    echo -e "  2. Enable write operations"
    echo -e "  3. Scale up application instances"
    echo -e "  4. Monitor application health"
    
    read -p "Confirm that application has been resumed manually (y/N): " confirm
    if [ "$confirm" = "y" ]; then
      echo -e "${GREEN}✅ Application resumed${NC}"
    fi
  else
    echo -e "${GREEN}✅ Staging environment resumed${NC}"
  fi
}

post_recovery_tasks() {
  echo -e "${YELLOW}📋 Performing post-recovery tasks...${NC}"
  
  # Create incident report
  create_incident_report
  
  # Send notifications
  send_recovery_notification
  
  # Schedule follow-up tasks
  schedule_followup_tasks
}

check_hosting_status() {
  echo -e "${YELLOW}🌐 Checking hosting provider status...${NC}"
  
  # Check Vercel status
  if curl -s "https://www.vercel-status.com/api/v2/status.json" | grep -q "operational"; then
    echo -e "${GREEN}✅ Vercel status: Operational${NC}"
  else
    echo -e "${YELLOW}⚠️ Vercel may have issues${NC}"
  fi
  
  # Check Railway status
  echo -e "${BLUE}🚂 Railway status: Check manually at railway.app/status${NC}"
  
  # Check external dependencies
  echo -e "${BLUE}🔍 Checking external dependencies...${NC}"
  check_external_dependencies
}

verify_dns() {
  echo -e "${YELLOW}🌐 Verifying DNS resolution...${NC}"
  
  local domains
  if [ "$TARGET_ENV" = "production" ]; then
    domains=("your-app.com" "api.your-app.com" "www.your-app.com")
  else
    domains=("staging.your-app.com" "api-staging.your-app.com")
  fi
  
  for domain in "${domains[@]}"; do
    if nslookup $domain >/dev/null 2>&1; then
      echo -e "${GREEN}✅ DNS resolution successful: $domain${NC}"
    else
      echo -e "${RED}❌ DNS resolution failed: $domain${NC}"
    fi
  done
}

check_ssl_certificates() {
  echo -e "${YELLOW}🔒 Checking SSL certificates...${NC}"
  
  local domains
  if [ "$TARGET_ENV" = "production" ]; then
    domains=("your-app.com" "api.your-app.com")
  else
    domains=("staging.your-app.com" "api-staging.your-app.com")
  fi
  
  for domain in "${domains[@]}"; do
    local expiry=$(echo | openssl s_client -connect $domain:443 -servername $domain 2>/dev/null | openssl x509 -noout -dates 2>/dev/null | grep notAfter | cut -d= -f2)
    
    if [ -n "$expiry" ]; then
      echo -e "${GREEN}✅ SSL certificate valid for $domain until $expiry${NC}"
    else
      echo -e "${RED}❌ SSL certificate issue for $domain${NC}"
    fi
  done
}

activate_backup_hosting() {
  echo -e "${YELLOW}🔄 Checking backup hosting options...${NC}"
  
  echo -e "${BLUE}💡 Backup hosting options:${NC}"
  echo -e "  1. Switch to Render.com (if configured)"
  echo -e "  2. Deploy to secondary Vercel account"
  echo -e "  3. Activate static site backup"
  echo -e "  4. Use CDN failover"
  
  echo -e "${YELLOW}⚠️ Backup hosting activation requires manual configuration${NC}"
}

# Utility functions

load_environment() {
  local env_file=".env.${TARGET_ENV}"
  
  if [ -f "$env_file" ]; then
    export $(cat $env_file | grep -v '^#' | xargs)
  elif [ -f ".env" ]; then
    export $(cat .env | grep -v '^#' | xargs)
  fi
}

find_backup_file() {
  echo -e "${BLUE}🔍 Finding suitable backup file...${NC}"
  
  local backup_path
  if [ "$RECOVERY_POINT" = "latest" ]; then
    # Find latest backup
    if [ -n "$AWS_S3_BUCKET" ]; then
      backup_path=$(aws s3 ls "s3://${AWS_S3_BUCKET}/database/${TARGET_ENV}/daily/" | sort | tail -1 | awk '{print $4}')
      echo "s3://${AWS_S3_BUCKET}/database/${TARGET_ENV}/daily/${backup_path}"
    fi
  else
    # Find specific backup by date or ID
    echo "Custom backup selection not yet implemented"
  fi
}

download_backup() {
  local backup_url=$1
  local local_file="/tmp/$(basename $backup_url)"
  
  if [[ $backup_url == s3://* ]]; then
    aws s3 cp $backup_url $local_file
  elif [[ $backup_url == gs://* ]]; then
    gsutil cp $backup_url $local_file
  else
    curl -o $local_file $backup_url
  fi
}

upload_emergency_backup() {
  local file_path=$1
  
  if [ -n "$AWS_S3_BUCKET" ]; then
    aws s3 cp $file_path "s3://${AWS_S3_BUCKET}/emergency/$(basename $file_path)"
  fi
}

create_incident_report() {
  local report_file="incident_report_${TIMESTAMP}.md"
  
  cat > $report_file << EOF
# Incident Report - ${TIMESTAMP}

## Overview
- **Incident Type**: ${SCENARIO}
- **Environment**: ${TARGET_ENV}
- **Recovery Point**: ${RECOVERY_POINT}
- **Start Time**: ${TIMESTAMP}
- **End Time**: $(date +%Y%m%d_%H%M%S)

## Impact
- [ ] User impact assessment
- [ ] Data loss assessment
- [ ] Financial impact

## Root Cause
- [ ] To be determined

## Recovery Actions Taken
- [x] Disaster recovery script executed
- [ ] Manual interventions performed
- [ ] Systems validated

## Follow-up Actions
- [ ] Root cause analysis
- [ ] Process improvements
- [ ] Documentation updates
- [ ] Team debrief scheduled

## Lessons Learned
- To be completed after analysis

EOF

  echo -e "${GREEN}✅ Incident report created: $report_file${NC}"
}

send_recovery_notification() {
  if [ -n "$SLACK_WEBHOOK_URL" ]; then
    curl -X POST -H 'Content-type: application/json' \
      --data "{
        \"text\": \"🚨 *Disaster Recovery Completed*\",
        \"attachments\": [{
          \"color\": \"good\",
          \"fields\": [
            {\"title\": \"Scenario\", \"value\": \"$SCENARIO\", \"short\": true},
            {\"title\": \"Environment\", \"value\": \"$TARGET_ENV\", \"short\": true},
            {\"title\": \"Recovery Point\", \"value\": \"$RECOVERY_POINT\", \"short\": true},
            {\"title\": \"Timestamp\", \"value\": \"$TIMESTAMP\", \"short\": true}
          ]
        }]
      }" \
      $SLACK_WEBHOOK_URL
  fi
}

schedule_followup_tasks() {
  echo -e "${YELLOW}📅 Scheduling follow-up tasks...${NC}"
  echo -e "${BLUE}Follow-up tasks to complete:${NC}"
  echo -e "  1. Root cause analysis (within 24 hours)"
  echo -e "  2. Process review (within 1 week)"
  echo -e "  3. Documentation updates (within 1 week)"
  echo -e "  4. Team debrief (within 3 days)"
  echo -e "  5. Backup strategy review (within 1 week)"
}

check_external_dependencies() {
  local dependencies=("google.com" "github.com")
  
  for dep in "${dependencies[@]}"; do
    if curl -s --max-time 5 "https://$dep" >/dev/null; then
      echo -e "${GREEN}✅ $dep is accessible${NC}"
    else
      echo -e "${YELLOW}⚠️ $dep may be inaccessible${NC}"
    fi
  done
}

# Error handling
trap 'handle_error $? $LINENO' ERR

handle_error() {
  local exit_code=$1
  local line_number=$2
  
  echo -e "${RED}❌ Disaster recovery failed at line ${line_number} with exit code ${exit_code}${NC}"
  
  # Send error notification
  if [ -n "$SLACK_WEBHOOK_URL" ]; then
    curl -X POST -H 'Content-type: application/json' \
      --data "{\"text\":\"🚨 Disaster recovery FAILED at line ${line_number}\"}" \
      $SLACK_WEBHOOK_URL
  fi
  
  exit $exit_code
}
