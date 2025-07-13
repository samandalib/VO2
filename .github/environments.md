# GitHub Environments Setup

This document explains how to configure GitHub Environments for the CI/CD pipeline.

## Required Environments

You need to create these environments in your GitHub repository:

### 1. `staging`

**Purpose**: Automatic deployments from `develop` branch
**Protection Rules**: None (automatic deployment)
**Required Secrets**:

- `STAGING_DATABASE_URL`: PostgreSQL connection string for staging
- `STAGING_URL`: Public URL of staging application

### 2. `production-approval`

**Purpose**: Manual approval gate before production deployment
**Protection Rules**:

- ✅ Required reviewers (add team leads/maintainers)
- ✅ Wait timer: 0 minutes
- ✅ Restrict to `main` branch only

### 3. `production`

**Purpose**: Production deployments after approval
**Protection Rules**:

- ✅ Required reviewers (add team leads/maintainers)
- ✅ Restrict to `main` branch only
  **Required Secrets**:
- `PRODUCTION_DATABASE_URL`: PostgreSQL connection string for production
- `PRODUCTION_URL`: Public URL of production application
- `PRODUCTION_HOST`: Server hostname (if using SSH deployment)
- `PRODUCTION_USER`: SSH username (if using SSH deployment)
- `PRODUCTION_SSH_KEY`: SSH private key (if using SSH deployment)

## How to Create Environments

1. Go to your GitHub repository
2. Click **Settings** → **Environments**
3. Click **New environment**
4. Enter environment name (e.g., `staging`)
5. Configure protection rules as described above
6. Add required secrets for each environment

## Optional Secrets (All Environments)

These secrets enhance the pipeline but are not required:

- `SLACK_WEBHOOK`: For Slack notifications
- `DISCORD_WEBHOOK`: For Discord notifications
- `SENTRY_DSN`: For error tracking
- `SEMGREP_APP_TOKEN`: For enhanced SAST scanning
- `RAILWAY_TOKEN`: If using Railway for deployment
- `RAILWAY_PROJECT_ID`: Railway project identifier

## Repository Secrets (Global)

Add these to **Settings** → **Secrets and variables** → **Actions**:

- `GITHUB_TOKEN`: Automatically provided (no action needed)

## Environment Variables (Public)

These can be set as environment variables (not secrets):

- `NODE_VERSION`: Node.js version to use (default: "18")
- `REGISTRY`: Container registry (default: "ghcr.io")

## Deployment Method Configuration

### Option 1: SSH Deployment

Add these secrets to production environment:

- `PRODUCTION_HOST`
- `PRODUCTION_USER`
- `PRODUCTION_SSH_KEY`

### Option 2: Cloud Provider (Railway/Render)

Add these secrets:

- `RAILWAY_TOKEN` + `RAILWAY_PROJECT_ID`
- OR equivalent for your cloud provider

### Option 3: Kubernetes

Modify deployment workflows to use kubectl with:

- `KUBE_CONFIG_DATA`
- `KUBE_NAMESPACE`

## Notification Setup

### Slack Notifications

1. Create a Slack app with webhook permissions
2. Add `SLACK_WEBHOOK` secret to environments
3. Uncomment Slack notification steps in workflows

### Discord Notifications

1. Create a Discord webhook in your server
2. Add `DISCORD_WEBHOOK` secret to environments
3. Uncomment Discord notification steps in workflows

## Testing the Setup

1. **Create environments** in GitHub repository settings
2. **Push to develop branch** to trigger staging deployment
3. **Create a pull request** to test CI checks
4. **Merge to main** to test production approval flow

## Troubleshooting

### Common Issues

**Environment not found**: Ensure environment names match exactly:

- `staging` (lowercase)
- `production-approval` (lowercase with dash)
- `production` (lowercase)

**Approval not working**: Check that:

- Environment has required reviewers configured
- User has appropriate permissions
- Branch protection rules are correctly set

**Secrets not available**: Verify:

- Secret names match exactly (case-sensitive)
- Secrets are added to correct environment
- Environment protection rules allow access

### Debug Steps

1. Check workflow logs for specific error messages
2. Verify environment configuration in repo settings
3. Test secrets by echoing non-sensitive parts
4. Ensure users have correct repository permissions

## Next Steps

After environment setup:

1. Test the complete pipeline with a small change
2. Configure monitoring and alerting
3. Set up backup and disaster recovery procedures
4. Document deployment procedures for your team
