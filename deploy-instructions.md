# Deploy VO2Max App to Vercel

## Step 1: Download Your Code

Since you're working in Builder.io environment, you'll need to:

1. **Export/download** your current project files
2. **Create a new local folder** for your project
3. **Copy these key files** to your local project:

### Required Files:

```
/client/               (entire client folder)
/shared/               (shared folder)
/.env.example
/vercel.json
/netlify.toml
```

## Step 2: Set Up Local Project

Create a `package.json` in your project root:

```json
{
  "name": "vo2max-training-app",
  "private": true,
  "version": "0.0.1",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "@supabase/supabase-js": "^2.50.5",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.26.2",
    "lucide-react": "^0.263.1"
  },
  "devDependencies": {
    "@types/react": "^18.2.15",
    "@types/react-dom": "^18.2.7",
    "@vitejs/plugin-react": "^4.0.3",
    "typescript": "^5.0.2",
    "vite": "^4.4.5",
    "tailwindcss": "^3.3.0",
    "autoprefixer": "^10.4.14",
    "postcss": "^8.4.24"
  }
}
```

## Step 3: Deploy to Vercel

1. **Install Vercel CLI**: `npm install -g vercel`
2. **Run in your project folder**: `vercel`
3. **Follow prompts** and select your account
4. **Set environment variables** in Vercel dashboard:
   - `VITE_SUPABASE_URL`: `https://zwmeqfitrztmmsrkhfdl.supabase.co`
   - `VITE_SUPABASE_ANON_KEY`: `[your key from .env file]`

## Step 4: Access Your Live App

Vercel will give you a URL like: `https://vo2max-training-app-xyz.vercel.app`

---

**Alternative: GitHub + Vercel Integration**

1. **Push code to GitHub repository**
2. **Connect GitHub repo to Vercel**
3. **Add environment variables**
4. **Auto-deploy on every push**
