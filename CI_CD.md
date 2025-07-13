# CI/CD Pipeline Documentation

## 🚀 Overview

Complete CI/CD pipeline for the VO₂Max Training App with automated testing, security scanning, and multi-environment deployments.

## 📋 Pipeline Workflows

### 1. **CI Pipeline** (`.github/workflows/ci.yml`)

**Triggers**: Push/PR to `main` or `develop` branches

**Jobs**:

- 🔍 **Code Quality**: TypeScript checking, linting, security audit
- 🧪 **Testing**: Full test suite with PostgreSQL database
- 🏗️ **Build**: Application build verification
- 🐳 **Docker**: Container build and validation
- 📢 **Notify**: PR comments with results

**Duration**: ~8-12 minutes

### 2. **Staging Deployment** (`.github/workflows/deploy-staging.yml`)

**Triggers**: Push to `develop` branch

**Jobs**:

- ✅ **CI Checks**: Runs full CI pipeline first
- 🏗️ **Build & Push**: Creates staging Docker image
- 🚀 **Deploy**: Deploys to staging environment
- 🗄️ **Migrate**: Runs database migrations
- 🔍 **Health Check**: Verifies deployment health
- 🧪 **Integration Tests**: Runs integration tests
- 📢 **Notify**: Deployment status notification

**Duration**: ~15-20 minutes

### 3. **Production Deployment** (`.github/workflows/deploy-production.yml`)

**Triggers**: Push to `main` branch or manual dispatch

**Jobs**:

- 🔍 **Verify Staging**: Ensures staging is healthy
- 🏗️ **Build Production**: Creates production Docker image
- ⏸️ **Manual Approval**: Requires human approval
- 🚀 **Deploy**: Deploys to production environment
- 🗄️ **Migrate**: Runs production migrations
- 🔍 **Health Check**: Comprehensive health verification
- 🚬 **Smoke Tests**: Critical functionality tests
- 📦 **Release**: Creates GitHub release
- 🔄 **Rollback Info**: Provides rollback instructions

**Duration**: ~25-35 minutes (including approval time)

### 4. **Security & Quality** (`.github/workflows/security.yml`)

**Triggers**: Push/PR, weekly schedule, manual dispatch

**Jobs**:

- 📦 **Dependency Scan**: npm audit for vulnerabilities
- 🔍 **CodeQL**: GitHub's security analysis
- 🐳 **Docker Security**: Trivy container scanning
- 🔐 **Secrets Scan**: TruffleHog for exposed secrets
- 📊 **Code Quality**: ESLint and complexity analysis
- 🛡️ **SAST**: Semgrep static analysis
- 📄 **License Check**: License compliance verification
- 📋 **Summary**: Consolidated security report

**Duration**: ~10-15 minutes

## 🌍 Environment Strategy

### Development

- **Branch**: `feature/*` → `develop`
- **Database**: Local PostgreSQL
- **URL**: `http://localhost:3000`
- **Deployment**: Manual/Local

### Staging

- **Branch**: `develop`
- **Database**: Staging PostgreSQL
- **URL**: `https://staging.your-app.com`
- **Deployment**: Automatic on push to `develop`

### Production

- **Branch**: `main`
- **Database**: Production PostgreSQL
- **URL**: `https://your-app.com`
- **Deployment**: Manual approval required

## 🔐 Security Features

### Automated Security Scanning

- **Dependency vulnerabilities**: npm audit
- **Code vulnerabilities**: CodeQL, Semgrep
- **Container vulnerabilities**: Trivy
- **Secret exposure**: TruffleHog
- **License compliance**: license-checker

### Security Gates

- ❌ **Block deployment** on critical vulnerabilities
- ⚠️ **Warning** on high vulnerabilities
- 📊 **Reports** uploaded to GitHub Security tab

## 🔧 Required Setup

### 1. GitHub Environments

Create these environments in your repository:

```bash
# Environment names (exact case)
staging
production-approval
production
```

### 2. Repository Secrets

Add these secrets to each environment:

**Staging Environment**:

- `STAGING_DATABASE_URL`
- `STAGING_URL`

**Production Environment**:

- `PRODUCTION_DATABASE_URL`
- `PRODUCTION_URL`
- `PRODUCTION_HOST` (if using SSH)
- `PRODUCTION_USER` (if using SSH)
- `PRODUCTION_SSH_KEY` (if using SSH)

**Optional (All Environments)**:

- `SLACK_WEBHOOK`
- `SENTRY_DSN`
- `SEMGREP_APP_TOKEN`

### 3. Branch Protection Rules

Configure these branch protections:

**`main` branch**:

- ✅ Require PR reviews (2 reviewers)
- ✅ Require status checks (CI workflow)
- ✅ Require up-to-date branches
- ✅ Restrict pushes to admins only

**`develop` branch**:

- ✅ Require PR reviews (1 reviewer)
- ✅ Require status checks (CI workflow)

## 🚦 Workflow Triggers

### Automatic Triggers

```yaml
develop branch push    → Staging deployment
main branch push       → Production approval request
Pull requests         → CI checks
Weekly schedule       → Security scans
```

### Manual Triggers

```bash
# Manual staging deployment
gh workflow run deploy-staging.yml

# Manual production deployment
gh workflow run deploy-production.yml

# Force deployment (skip checks)
gh workflow run deploy-production.yml -f skip_staging_check=true

# Deploy specific version
gh workflow run deploy-production.yml -f version=v1.2.3
```

## 📊 Pipeline Status

### Success Indicators

- ✅ All CI checks pass
- ✅ Security scans complete
- ✅ Deployments healthy
- ✅ Integration tests pass

### Failure Handling

- 🔄 **Auto-retry**: Transient failures retry automatically
- 📧 **Notifications**: Team notified of failures
- 🔄 **Rollback**: Easy rollback instructions provided
- 🐛 **Debug**: Detailed logs available

## 🔄 Git Workflow

### Feature Development

```bash
# 1. Create feature branch
git checkout -b feature/awesome-feature

# 2. Develop and commit
git add .
git commit -m "feat: add awesome feature"

# 3. Push and create PR
git push origin feature/awesome-feature
# Create PR to develop branch

# 4. CI runs automatically
# 5. Code review and merge to develop
# 6. Staging deployment happens automatically
```

### Production Release

```bash
# 1. Create release PR
git checkout -b release/v1.2.3
# Update version numbers, changelog, etc.

# 2. PR to main branch
# Create PR from develop to main

# 3. Final review and merge
# 4. Production approval request triggered
# 5. Manual approval by team lead
# 6. Production deployment
# 7. GitHub release created
```

## 📈 Monitoring & Alerts

### Health Checks

- **Basic**: `/health` endpoint
- **Database**: `/api/health/db` endpoint
- **API**: `/api/health` endpoint

### Notifications

- 📱 **Slack**: Deployment status and failures
- 📧 **Email**: Critical security vulnerabilities
- 🐛 **Sentry**: Runtime errors and performance

### Metrics Tracked

- ⏱️ **Deployment time**: Target <30 minutes
- ✅ **Success rate**: Target >95%
- 🔄 **Rollback frequency**: Target <5%
- 🛡️ **Security issues**: Target 0 critical

## 🚨 Troubleshooting

### Common Issues

**CI Failures**:

```bash
# Type errors
npm run typecheck

# Test failures
npm test

# Build failures
npm run build
```

**Deployment Failures**:

```bash
# Check environment secrets
# Verify database connectivity
# Review deployment logs
```

**Security Failures**:

```bash
# Fix dependency vulnerabilities
npm audit fix

# Review code quality issues
npm run format.fix
```

### Emergency Procedures

**Production Rollback**:

```bash
# Quick rollback to previous version
gh workflow run deploy-production.yml -f version=PREVIOUS_VERSION

# Or manual rollback
docker-compose -f docker-compose.prod.yml down
# Deploy previous image
```

**Hotfix Deployment**:

```bash
# Create hotfix branch from main
git checkout -b hotfix/critical-fix main

# Make minimal fix and test
# Fast-track through approval process
# Deploy directly to production
```

## 📚 Best Practices

### Development

- 🔍 **Run CI locally**: `npm test && npm run build`
- 🧪 **Test thoroughly**: Include unit, integration, and e2e tests
- 🔐 **Security first**: Never commit secrets or sensitive data
- 📝 **Document changes**: Clear commit messages and PR descriptions

### Deployment

- 🚀 **Small releases**: Deploy frequently with minimal changes
- 🔍 **Monitor closely**: Watch metrics after deployments
- 🔄 **Have rollback ready**: Always know how to revert
- 📢 **Communicate**: Notify team of deployment schedules

### Security

- 🛡️ **Regular scans**: Weekly security scans
- 🔐 **Secrets rotation**: Rotate secrets regularly
- 📊 **Review reports**: Check security scan results
- 🚨 **Act quickly**: Fix critical vulnerabilities immediately

## 🎯 Next Steps

1. ✅ **Complete setup**: Configure all environments and secrets
2. 🧪 **Test pipeline**: Deploy a small change end-to-end
3. 📊 **Monitor**: Set up monitoring and alerting
4. 📚 **Document**: Create team-specific deployment guides
5. 🔄 **Iterate**: Improve pipeline based on team feedback

Ready for **Phase 3: Infrastructure & Hosting Setup**!
