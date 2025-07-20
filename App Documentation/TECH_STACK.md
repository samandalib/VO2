# Tech Stack Overview

This project uses a modern, full-stack architecture optimized for rapid development, scalability, and developer experience.

## Frontend
- **Framework:** React (with TypeScript)
- **UI Library:** Tailwind CSS, custom components
- **Routing:** React Router
- **State Management:** React Context, custom hooks
- **Charting:** (if used) Chart.js or similar
- **Build Tool:** Vite

## Backend
- **API:** Serverless functions (Vercel/Netlify) and custom Node.js/Express endpoints
- **Database:** Supabase (PostgreSQL with pgvector extension)
- **ORM/Client:** Supabase JS client
- **Authentication:** Supabase Auth (email, OAuth, magic link)
- **RAG Pipeline:** Node.js/TypeScript, OpenAI API integration

## Hosting & Deployment
- **Frontend Hosting:** Vercel (primary), Netlify (optional)
- **Backend/API Hosting:** Vercel serverless functions, Netlify functions
- **Database Hosting:** Supabase cloud
- **CI/CD:** GitHub Actions, Vercel/Netlify auto-deploy

## Major Libraries & Services
- **OpenAI API:** Embeddings, completions (RAG)
- **Supabase:** Auth, database, storage
- **Prisma:** (if used) ORM for migrations/seeding
- **Lucide-react:** Icon set
- **Other:**
  - React Query (if used)
  - Sonner (toasts)
  - Shadcn/ui (custom UI components)

---
For more details, see the other documentation files in this folder. 