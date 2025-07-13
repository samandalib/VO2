#!/bin/bash

# Comprehensive backup automation script
# Usage: ./scripts/backup-automation.sh [type] [environment]
# Types: database, application, config, full
# Environments: staging, production

set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

BACKUP_TYPE=${1:-database}
ENVIRONMENT=${2:-production}
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/tmp/vo2max-backups"

echo -e "${GREEN}💾 Starting ${BACKUP_TYPE} backup for ${ENVIRONMENT} environment${NC}"

# Create backup directory
mkdir -p $BACKUP_DIR

case $BACKUP_TYPE in
  "database")
    backup_database
    ;;
  "application")
    backup_application
    ;;
  "config")
    backup_configuration
    ;;
  "full")
    backup_full_system
    ;;
  *)
    echo -e "${RED}❌ Unknown backup type: $BACKUP_TYPE${NC}"
    echo "Available types: database, application, config, full"
    exit 1
    ;;
esac

# Cleanup temporary files
cleanup

echo -e "${GREEN}✅ Backup completed successfully!${NC}"

backup_database() {
  echo -e "${YELLOW}🗄️ Starting database backup...${NC}"
  
  # Load environment variables
  load_environment
  
  if [ -z "$DATABASE_URL" ]; then
    echo -e "${RED}❌ DATABASE_URL not found${NC}"
    exit 1
  fi
  
  local backup_name="vo2max_db_${ENVIRONMENT}_${TIMESTAMP}"
  local backup_file="${BACKUP_DIR}/${backup_name}.sql"
  
  echo -e "${BLUE}📊 Creating database dump...${NC}"
  pg_dump $DATABASE_URL > $backup_file
  
  echo -e "${BLUE}🗜️ Compressing backup...${NC}"
  gzip $backup_file
  backup_file="${backup_file}.gz"
  
  # Upload to cloud storage
  upload_to_cloud $backup_file "database/${ENVIRONMENT}/daily/"
  
  # Create checksum
  create_checksum $backup_file
  
  echo -e "${GREEN}✅ Database backup completed: ${backup_name}.sql.gz${NC}"
}

backup_application() {
  echo -e "${YELLOW}📱 Starting application backup...${NC}"
  
  local backup_name="vo2max_app_${ENVIRONMENT}_${TIMESTAMP}"
  local backup_file="${BACKUP_DIR}/${backup_name}.tar.gz"
  
  echo -e "${BLUE}📦 Creating application archive...${NC}"
  
  # Create application backup excluding unnecessary files
  tar -czf $backup_file \
    --exclude=node_modules \
    --exclude=.git \
    --exclude=dist \
    --exclude=coverage \
    --exclude=.env* \
    --exclude=*.log \
    . || echo "Warning: Some files may have been skipped"
  
  # Upload to cloud storage
  upload_to_cloud $backup_file "application/${ENVIRONMENT}/"
  
  # Create checksum
  create_checksum $backup_file
  
  echo -e "${GREEN}✅ Application backup completed: ${backup_name}.tar.gz${NC}"
}

backup_configuration() {
  echo -e "${YELLOW}⚙️ Starting configuration backup...${NC}"
  
  local backup_name="vo2max_config_${ENVIRONMENT}_${TIMESTAMP}"
  local backup_file="${BACKUP_DIR}/${backup_name}.tar.gz"
  
  echo -e "${BLUE}📝 Creating configuration archive...${NC}"
  
  # Create configuration backup
  tar -czf $backup_file \
    .env.example \
    .env.${ENVIRONMENT}* \
    docker-compose*.yml \
    vercel.json \
    railway.toml \
    render.yaml \
    prisma/schema.prisma \
    package.json \
    package-lock.json \
    .github/workflows/ \
    scripts/ \
    config/ || echo "Warning: Some config files may be missing"
  
  # Upload to cloud storage
  upload_to_cloud $backup_file "config/${ENVIRONMENT}/"
  
  # Create checksum
  create_checksum $backup_file
  
  echo -e "${GREEN}✅ Configuration backup completed: ${backup_name}.tar.gz${NC}"
}

backup_full_system() {
  echo -e "${YELLOW}🌟 Starting full system backup...${NC}"
  
  # Run all backup types
  backup_database
  backup_application
  backup_configuration
  
  # Create manifest file
  create_backup_manifest
  
  echo -e "${GREEN}✅ Full system backup completed${NC}"
}

load_environment() {
  local env_file=".env.${ENVIRONMENT}"
  
  if [ -f "$env_file" ]; then
    echo -e "${BLUE}📂 Loading environment from ${env_file}${NC}"
    export $(cat $env_file | grep -v '^#' | xargs)
  elif [ -f ".env" ]; then
    echo -e "${BLUE}📂 Loading environment from .env${NC}"
    export $(cat .env | grep -v '^#' | xargs)
  else
    echo -e "${YELLOW}⚠️ No environment file found, using system environment${NC}"
  fi
}

upload_to_cloud() {
  local file_path=$1
  local cloud_path=$2
  local file_name=$(basename $file_path)
  
  echo -e "${BLUE}☁️ Uploading to cloud storage...${NC}"
  
  # AWS S3 upload
  if [ -n "$AWS_S3_BUCKET" ] && command -v aws &> /dev/null; then
    echo -e "${BLUE}  📤 Uploading to AWS S3...${NC}"
    aws s3 cp $file_path "s3://${AWS_S3_BUCKET}/${cloud_path}${file_name}"
    
    # Set lifecycle policy if not exists
    set_s3_lifecycle_policy
  fi
  
  # Google Cloud Storage upload
  if [ -n "$GOOGLE_CLOUD_BUCKET" ] && command -v gsutil &> /dev/null; then
    echo -e "${BLUE}  📤 Uploading to Google Cloud Storage...${NC}"
    gsutil cp $file_path "gs://${GOOGLE_CLOUD_BUCKET}/${cloud_path}${file_name}"
  fi
  
  # Azure Blob Storage upload
  if [ -n "$AZURE_STORAGE_ACCOUNT" ] && command -v az &> /dev/null; then
    echo -e "${BLUE}  📤 Uploading to Azure Blob Storage...${NC}"
    az storage blob upload \
      --account-name $AZURE_STORAGE_ACCOUNT \
      --container-name vo2max-backups \
      --name "${cloud_path}${file_name}" \
      --file $file_path
  fi
  
  # Verify upload
  verify_upload $file_path $cloud_path$file_name
}

set_s3_lifecycle_policy() {
  if [ "$AWS_S3_LIFECYCLE_SET" != "true" ]; then
    echo -e "${BLUE}  ⚙️ Setting S3 lifecycle policy...${NC}"
    
    cat > /tmp/lifecycle.json << 'EOF'
{
    "Rules": [
        {
            "ID": "vo2max-backup-lifecycle",
            "Status": "Enabled",
            "Filter": {
                "Prefix": ""
            },
            "Transitions": [
                {
                    "Days": 30,
                    "StorageClass": "STANDARD_IA"
                },
                {
                    "Days": 90,
                    "StorageClass": "GLACIER"
                },
                {
                    "Days": 365,
                    "StorageClass": "DEEP_ARCHIVE"
                }
            ],
            "Expiration": {
                "Days": 2555
            }
        }
    ]
}
EOF
    
    aws s3api put-bucket-lifecycle-configuration \
      --bucket $AWS_S3_BUCKET \
      --lifecycle-configuration file:///tmp/lifecycle.json || echo "Lifecycle policy may already exist"
    
    rm /tmp/lifecycle.json
    export AWS_S3_LIFECYCLE_SET=true
  fi
}

verify_upload() {
  local local_file=$1
  local remote_path=$2
  
  echo -e "${BLUE}  🔍 Verifying upload...${NC}"
  
  local local_size=$(stat -f%z "$local_file" 2>/dev/null || stat -c%s "$local_file")
  
  # Verify AWS S3 upload
  if [ -n "$AWS_S3_BUCKET" ]; then
    local remote_size=$(aws s3api head-object --bucket $AWS_S3_BUCKET --key $remote_path --query ContentLength --output text 2>/dev/null || echo "0")
    
    if [ "$local_size" = "$remote_size" ]; then
      echo -e "${GREEN}    ✅ AWS S3 upload verified${NC}"
    else
      echo -e "${RED}    ❌ AWS S3 upload verification failed${NC}"
    fi
  fi
}

create_checksum() {
  local file_path=$1
  local checksum_file="${file_path}.sha256"
  
  echo -e "${BLUE}🔐 Creating checksum...${NC}"
  
  # Create SHA256 checksum
  if command -v sha256sum &> /dev/null; then
    sha256sum $file_path > $checksum_file
  elif command -v shasum &> /dev/null; then
    shasum -a 256 $file_path > $checksum_file
  else
    echo -e "${YELLOW}⚠️ No checksum utility found${NC}"
    return
  fi
  
  # Upload checksum file
  upload_to_cloud $checksum_file "checksums/"
}

create_backup_manifest() {
  local manifest_file="${BACKUP_DIR}/backup_manifest_${TIMESTAMP}.json"
  
  echo -e "${BLUE}📋 Creating backup manifest...${NC}"
  
  cat > $manifest_file << EOF
{
  "backup_id": "vo2max_full_${ENVIRONMENT}_${TIMESTAMP}",
  "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "environment": "${ENVIRONMENT}",
  "backup_type": "full",
  "components": {
    "database": "vo2max_db_${ENVIRONMENT}_${TIMESTAMP}.sql.gz",
    "application": "vo2max_app_${ENVIRONMENT}_${TIMESTAMP}.tar.gz",
    "configuration": "vo2max_config_${ENVIRONMENT}_${TIMESTAMP}.tar.gz"
  },
  "metadata": {
    "git_commit": "$(git rev-parse HEAD 2>/dev/null || echo 'unknown')",
    "git_branch": "$(git branch --show-current 2>/dev/null || echo 'unknown')",
    "backup_size": "$(du -sh $BACKUP_DIR | cut -f1)",
    "node_version": "$(node --version 2>/dev/null || echo 'unknown')",
    "npm_version": "$(npm --version 2>/dev/null || echo 'unknown')"
  },
  "retention": {
    "daily": "30 days",
    "weekly": "12 weeks",
    "monthly": "12 months",
    "yearly": "7 years"
  },
  "recovery_instructions": "See /config/backup-strategy.md for recovery procedures"
}
EOF
  
  # Upload manifest
  upload_to_cloud $manifest_file "manifests/"
  
  echo -e "${GREEN}✅ Backup manifest created${NC}"
}

send_notification() {
  local status=$1
  local message=$2
  
  if [ -n "$SLACK_WEBHOOK_URL" ]; then
    local emoji="✅"
    local color="good"
    
    if [ "$status" = "error" ]; then
      emoji="❌"
      color="danger"
    fi
    
    curl -X POST -H 'Content-type: application/json' \
      --data "{
        \"attachments\": [{
          \"color\": \"$color\",
          \"title\": \"$emoji Backup ${status^}\",
          \"text\": \"$message\",
          \"fields\": [
            {\"title\": \"Environment\", \"value\": \"$ENVIRONMENT\", \"short\": true},
            {\"title\": \"Type\", \"value\": \"$BACKUP_TYPE\", \"short\": true},
            {\"title\": \"Timestamp\", \"value\": \"$TIMESTAMP\", \"short\": true}
          ]
        }]
      }" \
      $SLACK_WEBHOOK_URL
  fi
}

cleanup() {
  echo -e "${BLUE}🧹 Cleaning up temporary files...${NC}"
  
  # Remove temporary backup files
  if [ -d "$BACKUP_DIR" ]; then
    rm -rf $BACKUP_DIR
  fi
  
  echo -e "${GREEN}✅ Cleanup completed${NC}"
}

# Error handling
trap 'handle_error $? $LINENO' ERR

handle_error() {
  local exit_code=$1
  local line_number=$2
  
  echo -e "${RED}❌ Backup failed at line ${line_number} with exit code ${exit_code}${NC}"
  
  # Send error notification
  send_notification "error" "Backup failed at line ${line_number} with exit code ${exit_code}"
  
  # Cleanup on error
  cleanup
  
  exit $exit_code
}

# Success notification
trap 'send_notification "success" "Backup completed successfully"' EXIT
