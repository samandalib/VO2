# 🗄️ Database Setup Guide

## 🚀 Quick Supabase Setup (Recommended)

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up
2. Click "New Project"
3. Fill in:
   - **Project Name**: `vo2max-app`
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose closest to you
4. Click "Create new project" (takes 2-3 minutes)

### 2. Get Connection String

1. In your Supabase dashboard, go to **Settings → Database**
2. Scroll to **Connection string**
3. Copy the **URI** format
4. It looks like: `postgresql://postgres:[YOUR-PASSWORD]@[HOST]:5432/postgres?sslmode=require`

### 3. Update Your .env File

Replace the placeholder in `.env` with your actual connection string:

```env
DATABASE_URL="postgresql://postgres:your_actual_password@db.abcdefghijk.supabase.co:5432/postgres?sslmode=require"
```

### 4. Test Connection

```bash
npm run db:test
```

If successful, you'll see: ✅ Database connection successful!

### 5. Set Up Database Schema

```bash
# Create tables
npm run db:migrate

# Add protocol data
npm run db:seed

# View your data
npm run db:studio
```

## 🛠️ Commands Available

| Command               | Description                   |
| --------------------- | ----------------------------- |
| `npm run db:test`     | Test database connection      |
| `npm run db:migrate`  | Create/update database tables |
| `npm run db:seed`     | Add initial protocol data     |
| `npm run db:studio`   | Open database viewer          |
| `npm run db:reset`    | Reset database and reseed     |
| `npm run db:generate` | Regenerate Prisma client      |

## 🔧 Alternative: Railway Database

If you prefer Railway:

1. Go to [railway.app](https://railway.app)
2. Create new project → Add PostgreSQL
3. Copy the connection string from Variables tab
4. Update `.env` with the Railway connection string

## ❓ Troubleshooting

### Connection Issues

- Make sure your connection string is correct
- Check that your database password doesn't contain special characters that need escaping
- Verify your IP is allowed (Supabase allows all by default)

### Migration Issues

- If migration fails, try: `npx prisma db push` first
- Then run: `npm run db:migrate`

## 🎉 Ready!

Once your connection test passes, your database is ready for the VO2Max app!

Next step: Replace localStorage with database calls in your components.
