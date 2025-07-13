# Deployment Foundation Setup

## 🎯 Overview

This foundation provides a production-ready deployment pipeline with:

- Multi-environment configuration (dev/staging/production)
- Docker containerization
- Database setup automation
- Environment variable validation

## 🚀 Quick Start

### 1. Choose Your Environment

```bash
# Copy your desired environment
cp .env.development .env  # For development
cp .env.staging .env      # For staging
cp .env.production .env   # For production

# Or use the switcher script
./scripts/switch-env.sh development
```

### 2. Update Environment Variables

Edit your `.env` file with real values:

```bash
# Required
DATABASE_URL=postgresql://user:password@host:5432/database
JWT_SECRET=your-very-secure-jwt-secret-key

# Optional but recommended
GOOGLE_CLIENT_ID=your-google-oauth-client-id
SENTRY_DSN=your-sentry-dsn-for-error-tracking
```

### 3. Start with Docker

```bash
# Development
docker-compose -f docker-compose.dev.yml up -d

# Staging
docker-compose -f docker-compose.staging.yml up -d

# Production
docker-compose -f docker-compose.prod.yml up -d
```

### 4. Run Database Migrations

```bash
# Make scripts executable first (if needed)
chmod +x scripts/*.sh

# Run migrations for your environment
./scripts/migrate-db.sh development
./scripts/migrate-db.sh staging
./scripts/migrate-db.sh production
```

## 📁 File Structure

```
├── .env.development     # Development environment variables
├── .env.staging        # Staging environment variables
├── .env.production     # Production environment variables
├── Dockerfile          # Application container
├── .dockerignore       # Docker ignore rules
├── docker-compose.dev.yml      # Development services
├── docker-compose.staging.yml  # Staging services
├── docker-compose.prod.yml     # Production services
├── scripts/
│   ├── migrate-db.sh   # Database migration script
│   └── switch-env.sh   # Environment switcher
├── server/config/
│   └── env.ts          # Environment validation
└── prisma/
    └── init.sql        # Database initialization
```

## 🔧 Environment Variables

### Required Variables

- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secret for JWT tokens (32+ characters)

### Optional Variables

- `GOOGLE_CLIENT_ID`: For Google OAuth
- `OPENAI_API_KEY`: If using AI features
- `SENTRY_DSN`: Error tracking
- `RATE_LIMIT_*`: Security settings

### Client Variables (Vite)

- `VITE_API_URL`: API endpoint for frontend
- `VITE_GOOGLE_CLIENT_ID`: Google OAuth for frontend
- `VITE_APP_ENV`: Environment indicator

## 🐳 Docker Commands

```bash
# Build and start services
docker-compose -f docker-compose.dev.yml up --build

# View logs
docker-compose -f docker-compose.dev.yml logs -f

# Stop services
docker-compose -f docker-compose.dev.yml down

# Reset everything (careful!)
docker-compose -f docker-compose.dev.yml down -v
```

## 🗄️ Database Management

```bash
# Run migrations
./scripts/migrate-db.sh [environment]

# Reset database (development only)
npm run db:reset

# Open Prisma Studio
npm run db:studio

# Test database connection
npm run db:test
```

## 🔒 Security Notes

### Development

- Uses simple secrets for ease of development
- Database exposed on localhost:5432
- Detailed error logging enabled

### Staging

- Separate database and credentials
- Basic security headers
- Error tracking recommended

### Production

- Secrets management via Docker secrets
- Database not exposed publicly
- Rate limiting enabled
- Full error tracking required
- Resource limits configured

## ⚡ Performance

### Bundle Optimization

- Code splitting configured in `vite.config.ts`
- Main bundle ~570KB (down from 1MB+)
- 10 optimized chunks for better caching

### Database

- Connection pooling via Prisma
- Health checks configured
- Backup automation in production

## 🚨 Troubleshooting

### Port Conflicts

- Development: 5432 (postgres), 3000 (app)
- Staging: 5433 (postgres), 3001 (app)
- Production: 5434 (postgres), 80/443 (nginx)

### Environment Issues

```bash
# Validate environment variables
npm run typecheck

# Check database connection
npm run db:test

# View container logs
docker-compose logs [service-name]
```

### Common Fixes

- Ensure Docker is running
- Check environment file exists and has correct values
- Verify database is accessible
- Make sure ports aren't already in use

## 📊 Next Steps

This foundation is ready for:

1. **CI/CD Pipeline** (GitHub Actions)
2. **Cloud Deployment** (Vercel + Railway)
3. **Monitoring** (Sentry, Uptime)
4. **SSL/Domain** Setup

Ready to proceed with Phase 2: CI/CD Pipeline setup!
