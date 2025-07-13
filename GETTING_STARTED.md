# 🚀 Getting Your VO2Max App Live - Step by Step Guide

## What We're Going to Do

We're going to take your app that currently only runs on your computer and put it on the internet so anyone can use it. Think of it like moving from a private workshop to opening a public store.

## Step 1: Create Your GitHub Repository (5 minutes)

**What this does:** Stores your code online so hosting services can access it.

### Action Steps:

1. Go to [github.com](https://github.com) and sign in (or create an account)
2. Click the green "New" button (or the "+" in the top right)
3. Name your repository: `vo2max-training-app`
4. Make it **Public** (so hosting services can access it for free)
5. Do NOT check "Add a README file" (we already have files)
6. Click "Create repository"

### After creating, you'll see a page with commands. STOP here and tell me when you've done this.

---

## Step 2: Upload Your Code to GitHub (5 minutes)

**What this does:** Puts all your app files online.

### Action Steps:

1. In your terminal/command prompt, navigate to your app folder
2. Run these commands one by one:

```bash
git init
git add .
git commit -m "Initial commit - VO2Max training app"
git remote add origin https://github.com/YOUR-USERNAME/vo2max-training-app.git
git push -u origin main
```

Replace `YOUR-USERNAME` with your actual GitHub username.

### STOP here when done and tell me if you see your files on GitHub.

---

## Step 3: Set Up Free Cloud Hosting (10 minutes)

**What this does:** Gets you free hosting accounts where your app will live.

### 3A: Create Vercel Account (for your website)

1. Go to [vercel.com](https://vercel.com)
2. Click "Sign Up"
3. Choose "Continue with GitHub"
4. Allow Vercel to access your repositories

### 3B: Create Railway Account (for your database and backend)

1. Go to [railway.app](https://railway.app)
2. Click "Login"
3. Choose "Login with GitHub"
4. Allow Railway to access your repositories

### STOP here when you have both accounts created and tell me.

---

## Step 4: Deploy Your Backend to Railway (15 minutes)

**What this does:** Puts your server and database online.

### Action Steps:

1. In Railway, click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose your `vo2max-training-app` repository
4. Railway will start building your app automatically

### Add Database:

1. In your Railway project, click "New Service"
2. Click "Database"
3. Select "PostgreSQL"
4. Railway will create a database for you

### STOP here and tell me when Railway shows your app is "deployed" (you'll see a green status).

---

## Step 5: Deploy Your Frontend to Vercel (10 minutes)

**What this does:** Puts your website online.

### Action Steps:

1. In Vercel, click "New Project"
2. Import your `vo2max-training-app` repository
3. Vercel will automatically detect it's a Vite app
4. Click "Deploy" (don't change any settings for now)
5. Wait for deployment to complete

### STOP here when Vercel shows your app is "deployed" and gives you a URL.

---

## Step 6: Connect Frontend to Backend (10 minutes)

**What this does:** Makes your website talk to your database.

### Get Your Railway URL:

1. In Railway, go to your app service
2. Click "Settings"
3. Copy the "Public Domain" URL (looks like: `https://yourapp.railway.app`)

### Update Vercel Environment:

1. In Vercel, go to your project
2. Click "Settings" → "Environment Variables"
3. Add these variables:
   - Key: `VITE_API_URL` Value: `https://yourapp.railway.app` (your Railway URL)
   - Key: `VITE_APP_ENV` Value: `production`

### STOP here and tell me when you've added these environment variables.

---

## What Happens Next

After you complete these steps, I'll help you:

- Test that everything works
- Set up a custom domain (optional)
- Add monitoring so you know if anything breaks
- Set up automated backups

## Need Help?

If you get stuck anywhere:

1. Tell me exactly which step you're on
2. Copy and paste any error messages you see
3. Tell me what happened when you tried the step

Remember: This is normal! Everyone gets stuck on their first deployment. We'll figure it out together.

## Quick Reference

- **GitHub**: Stores your code
- **Railway**: Hosts your backend/database
- **Vercel**: Hosts your website
- **Environment Variables**: Settings that tell your app how to work in production

Ready to start with Step 1? 🚀
