# Database Setup Instructions

## Option 1: Supabase (Recommended for Development)

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project
3. Go to Settings → Database
4. Copy the connection string (URI)
5. Update your `.env` file:

```env
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@[YOUR-HOST]:5432/postgres?sslmode=require"
```

6. Run the migration:

```bash
npx prisma migrate dev --name init
```

## Option 2: Local PostgreSQL with Docker

If you have Docker installed:

1. Start the database:

```bash
docker-compose up -d
```

2. Run the migration:

```bash
npx prisma migrate dev --name init
```

## Option 3: Railway (Alternative Cloud)

1. Go to [railway.app](https://railway.app)
2. Create a PostgreSQL database
3. Copy the connection string
4. Update `.env` with the connection string
5. Run migration

## After Database Setup

1. Generate Prisma client:

```bash
npx prisma generate
```

2. Seed the database with protocols:

```bash
npm run db:seed
```

3. Open Prisma Studio to view data:

```bash
npx prisma studio
```

Your database is now ready to use with the VO2Max app!
