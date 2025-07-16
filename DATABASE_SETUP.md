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

## 📚 **Key Insights from the Documentation:**

### **1. Vercel-Specific Configuration:**
According to the docs, for Vercel deployments, you should use:
- **Site URL:** Your official site URL
- **Additional redirect URLs:** `https://*-<team-or-account-slug>.vercel.app/**`

### **2. Wildcard Support:**
Supabase supports wildcards, which is perfect for Vercel's dynamic preview URLs.

### **3. Environment Variables:**
The docs recommend using `NEXT_PUBLIC_VERCEL_URL` for dynamic redirects.

## 🛠️ **Updated Configuration Based on Docs:**

### **For Your Vercel Setup:**

**Supabase Site URL:**
```
https://vo-2-gamma.vercel.app
```

**Supabase Redirect URLs:**
```
<code_block_to_apply_changes_from>
```

### **Google OAuth Configuration:**

**Authorized JavaScript origins:**
```
http://localhost:5173
https://vo-2-gamma.vercel.app
```

**Authorized redirect URIs:**
```
https://zwmeqfitrztmmsrkhfdl.supabase.co/auth/v1/callback
http://localhost:5173
https://vo-2-gamma.vercel.app
```

## 🎯 **Why This Approach is Better:**

1. **Wildcards handle Vercel's dynamic URLs** - No more "requested path is invalid" errors
2. **Supports both production and preview deployments** automatically
3. **Follows Supabase's official recommendations** for Vercel deployments

## 🔧 **Let's Also Add Environment Variable Support:**

Let me update your auth context to use the recommended pattern:
