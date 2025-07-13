# Backup and Disaster Recovery Strategy

## 🎯 Overview

Comprehensive backup and disaster recovery plan for the VO₂Max Training App, ensuring data protection and business continuity.

## 📊 Data Classification

### Critical Data (RTO: 1 hour, RPO: 15 minutes)

- **User accounts and profiles**
- **Training protocols and user assignments**
- **VO₂Max calculations and history**
- **Session metrics and tracking data**
- **Biomarker measurements**

### Important Data (RTO: 4 hours, RPO: 1 hour)

- **Application configuration**
- **Static assets and uploads**
- **Audit logs**
- **Analytics data**

### Non-Critical Data (RTO: 24 hours, RPO: 24 hours)

- **System logs**
- **Temporary files**
- **Cache data**

## 🗄️ Database Backup Strategy

### Automated Backups

#### Railway PostgreSQL (Recommended)

```bash
# Railway provides automatic backups
# - Point-in-time recovery (7 days)
# - Daily snapshots (30 days retention)
# - Automatic failover

# Manual backup script
#!/bin/bash
BACKUP_NAME="vo2max_backup_$(date +%Y%m%d_%H%M%S)"
pg_dump $DATABASE_URL > "/backups/${BACKUP_NAME}.sql"

# Upload to cloud storage
aws s3 cp "/backups/${BACKUP_NAME}.sql" "s3://vo2max-backups/database/"
```

#### Custom Backup Script

```bash
#!/bin/bash
# scripts/backup-database.sh

set -e

ENVIRONMENT=${1:-production}
BACKUP_DIR="/tmp/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_NAME="vo2max_${ENVIRONMENT}_${TIMESTAMP}"

echo "🗄️ Starting database backup for ${ENVIRONMENT}..."

# Create backup directory
mkdir -p $BACKUP_DIR

# Load environment variables
if [ -f ".env.${ENVIRONMENT}" ]; then
    export $(cat .env.${ENVIRONMENT} | grep -v '^#' | xargs)
fi

# Create database dump
echo "📦 Creating database dump..."
pg_dump $DATABASE_URL > "${BACKUP_DIR}/${BACKUP_NAME}.sql"

# Compress backup
echo "🗜️ Compressing backup..."
gzip "${BACKUP_DIR}/${BACKUP_NAME}.sql"

# Upload to cloud storage
echo "☁️ Uploading to cloud storage..."
if [ -n "$AWS_S3_BUCKET" ]; then
    aws s3 cp "${BACKUP_DIR}/${BACKUP_NAME}.sql.gz" \
        "s3://${AWS_S3_BUCKET}/database/${ENVIRONMENT}/"
fi

if [ -n "$GOOGLE_CLOUD_BUCKET" ]; then
    gsutil cp "${BACKUP_DIR}/${BACKUP_NAME}.sql.gz" \
        "gs://${GOOGLE_CLOUD_BUCKET}/database/${ENVIRONMENT}/"
fi

# Clean up local backup
rm "${BACKUP_DIR}/${BACKUP_NAME}.sql.gz"

echo "✅ Database backup completed: ${BACKUP_NAME}.sql.gz"
```

### Backup Scheduling

```yaml
# .github/workflows/backup.yml
name: Database Backup

on:
  schedule:
    # Daily at 2 AM UTC
    - cron: "0 2 * * *"
  workflow_dispatch:

jobs:
  backup-database:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run backup script
        env:
          DATABASE_URL: ${{ secrets.PRODUCTION_DATABASE_URL }}
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          AWS_S3_BUCKET: ${{ secrets.BACKUP_S3_BUCKET }}
        run: ./scripts/backup-database.sh production
```

## ☁️ Cloud Storage Strategy

### Multi-Cloud Backup Approach

```bash
# Primary: AWS S3
aws s3 sync ./backups/ s3://vo2max-backups-primary/

# Secondary: Google Cloud Storage
gsutil -m rsync -r ./backups/ gs://vo2max-backups-secondary/

# Tertiary: Azure Blob Storage
az storage blob upload-batch \
    --destination vo2max-backups \
    --source ./backups/
```

### Storage Structure

```
vo2max-backups/
├── database/
│   ├── production/
│   │   ├── daily/
│   │   ├── weekly/
│   │   └── monthly/
│   └── staging/
├── application/
│   ├── code/
│   ├── config/
│   └── assets/
└── logs/
    ├── application/
    └── security/
```

## 🔄 Application Backup Strategy

### Code Repository Backup

```bash
#!/bin/bash
# scripts/backup-repository.sh

BACKUP_DIR="/tmp/repo-backup"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Clone repository
git clone --mirror https://github.com/your-org/vo2max-app.git "${BACKUP_DIR}/repo-${TIMESTAMP}.git"

# Archive repository
tar -czf "repo-backup-${TIMESTAMP}.tar.gz" -C $BACKUP_DIR "repo-${TIMESTAMP}.git"

# Upload to storage
aws s3 cp "repo-backup-${TIMESTAMP}.tar.gz" s3://vo2max-backups/repository/

# Cleanup
rm -rf $BACKUP_DIR
```

### Configuration Backup

```bash
#!/bin/bash
# scripts/backup-config.sh

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
CONFIG_BACKUP="config-backup-${TIMESTAMP}.tar.gz"

# Backup configuration files
tar -czf $CONFIG_BACKUP \
    .env.* \
    docker-compose*.yml \
    vercel.json \
    railway.toml \
    render.yaml \
    prisma/schema.prisma

# Upload to storage
aws s3 cp $CONFIG_BACKUP s3://vo2max-backups/config/

# Cleanup
rm $CONFIG_BACKUP
```

## 🚨 Disaster Recovery Procedures

### Database Recovery

#### Point-in-Time Recovery (Railway)

```bash
# Railway CLI recovery
railway db:restore --time "2024-01-15 14:30:00"

# Or via dashboard:
# 1. Go to Railway dashboard
# 2. Select database service
# 3. Go to Settings > Backups
# 4. Select backup and restore
```

#### Manual Database Recovery

```bash
#!/bin/bash
# scripts/restore-database.sh

BACKUP_FILE=$1
TARGET_ENV=${2:-staging}

if [ -z "$BACKUP_FILE" ]; then
    echo "Usage: ./restore-database.sh <backup-file> [environment]"
    exit 1
fi

echo "🔄 Restoring database from ${BACKUP_FILE} to ${TARGET_ENV}..."

# Load environment variables
export $(cat .env.${TARGET_ENV} | grep -v '^#' | xargs)

# Download backup if it's a remote file
if [[ $BACKUP_FILE == s3://* ]]; then
    aws s3 cp $BACKUP_FILE ./temp-backup.sql.gz
    BACKUP_FILE="./temp-backup.sql.gz"
fi

# Decompress if needed
if [[ $BACKUP_FILE == *.gz ]]; then
    gunzip -c $BACKUP_FILE > ./temp-backup.sql
    BACKUP_FILE="./temp-backup.sql"
fi

# Drop existing database (be careful!)
read -p "⚠️ This will drop the existing database. Continue? (y/N): " confirm
if [[ $confirm == [yY] ]]; then
    psql $DATABASE_URL -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"

    # Restore database
    psql $DATABASE_URL < $BACKUP_FILE

    echo "✅ Database restoration completed"
else
    echo "❌ Restoration cancelled"
fi

# Cleanup
rm -f ./temp-backup.sql ./temp-backup.sql.gz
```

### Application Recovery

#### Complete Application Restore

```bash
#!/bin/bash
# scripts/disaster-recovery.sh

RECOVERY_POINT=${1:-latest}
TARGET_ENV=${2:-staging}

echo "🚨 Starting disaster recovery to ${RECOVERY_POINT}..."

# 1. Restore database
echo "📋 Step 1: Database recovery"
./scripts/restore-database.sh "s3://vo2max-backups/database/production/daily/${RECOVERY_POINT}.sql.gz" $TARGET_ENV

# 2. Deploy application
echo "📋 Step 2: Application deployment"
if [ "$TARGET_ENV" = "production" ]; then
    gh workflow run deploy-production.yml
else
    gh workflow run deploy-staging.yml
fi

# 3. Verify services
echo "📋 Step 3: Service verification"
sleep 60 # Wait for deployment

./scripts/health-check.sh $TARGET_ENV

echo "✅ Disaster recovery completed"
```

## 🧪 Testing and Validation

### Backup Testing Schedule

```bash
#!/bin/bash
# scripts/test-backups.sh

BACKUP_FILE="s3://vo2max-backups/database/production/daily/latest.sql.gz"
TEST_DB_URL="postgresql://test_user:test_pass@localhost:5432/vo2max_test"

echo "🧪 Testing backup integrity..."

# Download backup
aws s3 cp $BACKUP_FILE ./test-backup.sql.gz

# Create test database
createdb vo2max_test

# Restore to test database
gunzip -c ./test-backup.sql | psql $TEST_DB_URL

# Run integrity checks
psql $TEST_DB_URL -c "SELECT COUNT(*) FROM users;"
psql $TEST_DB_URL -c "SELECT COUNT(*) FROM session_metrics;"

# Cleanup
dropdb vo2max_test
rm ./test-backup.sql.gz

echo "✅ Backup test completed"
```

### Monthly DR Drill

```yaml
# .github/workflows/dr-drill.yml
name: Disaster Recovery Drill

on:
  schedule:
    # First Monday of each month
    - cron: "0 9 1-7 * 1"
  workflow_dispatch:

jobs:
  dr-drill:
    runs-on: ubuntu-latest
    steps:
      - name: Run DR simulation
        run: |
          echo "🚨 Running disaster recovery drill"
          ./scripts/test-backups.sh
          ./scripts/restore-database.sh latest staging
          ./scripts/health-check.sh staging
```

## 📊 Monitoring and Alerting

### Backup Monitoring

```bash
#!/bin/bash
# scripts/monitor-backups.sh

BACKUP_BUCKET="s3://vo2max-backups"
ALERT_WEBHOOK="$SLACK_WEBHOOK_URL"

# Check if daily backup exists
TODAY=$(date +%Y%m%d)
BACKUP_EXISTS=$(aws s3 ls "${BACKUP_BUCKET}/database/production/daily/" | grep $TODAY | wc -l)

if [ $BACKUP_EXISTS -eq 0 ]; then
    # Send alert
    curl -X POST -H 'Content-type: application/json' \
        --data '{"text":"🚨 Daily backup missing for '${TODAY}'"}' \
        $ALERT_WEBHOOK
fi
```

### RTO/RPO Monitoring

```bash
#!/bin/bash
# Monitor Recovery Time/Point Objectives

# Check backup freshness
LATEST_BACKUP=$(aws s3 ls s3://vo2max-backups/database/production/daily/ | tail -1 | awk '{print $1" "$2}')
BACKUP_AGE=$(( ($(date +%s) - $(date -d "$LATEST_BACKUP" +%s)) / 3600 ))

if [ $BACKUP_AGE -gt 24 ]; then
    echo "⚠️ Backup is ${BACKUP_AGE} hours old (exceeds RPO)"
    # Send alert
fi
```

## 📋 Recovery Procedures Documentation

### Emergency Contacts

```
Primary: DevOps Lead - +1-xxx-xxx-xxxx
Secondary: Technical Lead - +1-xxx-xxx-xxxx
Database Admin: DBA - +1-xxx-xxx-xxxx
```

### Recovery Runbooks

#### 1. Database Corruption

```
1. Assess damage scope
2. Stop application writes
3. Identify latest clean backup
4. Restore from backup to staging
5. Validate data integrity
6. Switch traffic to staging
7. Investigate root cause
8. Restore production when safe
```

#### 2. Complete Site Outage

```
1. Check hosting provider status
2. Verify DNS resolution
3. Check SSL certificates
4. Deploy to backup hosting
5. Update DNS if needed
6. Monitor recovery
```

#### 3. Data Loss Event

```
1. Stop all writes immediately
2. Preserve current state
3. Assess data loss scope
4. Restore from backups
5. Replay transactions if possible
6. Validate data consistency
7. Resume operations
```

## 💰 Cost Optimization

### Storage Lifecycle

```bash
# AWS S3 lifecycle policy
{
  "Rules": [
    {
      "Status": "Enabled",
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
      ]
    }
  ]
}
```

### Retention Policies

- **Daily backups**: 30 days
- **Weekly backups**: 12 weeks
- **Monthly backups**: 12 months
- **Yearly backups**: 7 years

## 🔒 Security Considerations

### Backup Encryption

```bash
# Encrypt backup before upload
gpg --symmetric --cipher-algo AES256 backup.sql
aws s3 cp backup.sql.gpg s3://encrypted-backups/
```

### Access Control

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": { "AWS": "arn:aws:iam::account:user/backup-user" },
      "Action": ["s3:PutObject", "s3:GetObject"],
      "Resource": "arn:aws:s3:::vo2max-backups/*"
    }
  ]
}
```

## 📈 Continuous Improvement

### Metrics to Track

- **Backup success rate**: >99.9%
- **Recovery time actual vs RTO**: <10% variance
- **Backup size growth**: Monitor trends
- **Recovery testing frequency**: Monthly

### Regular Reviews

- **Quarterly**: Review and update procedures
- **Annually**: Full DR plan review
- **After incidents**: Update based on lessons learned

Ready for production disaster recovery! 🚀
