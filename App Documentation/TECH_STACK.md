# Technology Stack

## Frontend

### Core Framework
- **React 18** - Main UI framework with hooks and functional components
- **TypeScript** - Type-safe JavaScript for better development experience
- **Vite** - Fast build tool and development server

### UI Framework
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality React components built on Radix UI
- **Lucide React** - Beautiful icon library
- **Framer Motion** - Animation library for smooth transitions

### State Management
- **React Context API** - For global state (auth, theme, forms)
- **React Hooks** - Local state management
- **Custom Hooks** - Reusable logic (useAuth, useAdminStatus, etc.)

## Backend & Database

### Database
- **Supabase** - PostgreSQL database with real-time features
- **Row Level Security (RLS)** - Data access control
- **Real-time subscriptions** - Live data updates

### Authentication
- **Supabase Auth** - Complete authentication solution
- **Multiple methods**: Email/password, magic link, Google OAuth
- **Session management** - Automatic token handling
- **Admin access control** - Role-based permissions

### API Layer
- **Supabase Client** - Direct database access from frontend
- **Serverless Functions** - API routes for complex operations
- **REST API** - Standard HTTP endpoints

## AI & RAG System

### OpenAI Integration
- **OpenAI API** - GPT models for chat completions
- **Embeddings API** - Text vectorization for RAG
- **Function calling** - Structured AI responses

### RAG Pipeline
- **Document processing** - PDF chunking and embedding
- **Vector search** - Semantic similarity matching
- **Context injection** - Dynamic prompt engineering
- **Admin dashboard** - Configuration and monitoring

## Development Tools

### Build & Development
- **Vite** - Fast development server and build tool
- **TypeScript** - Static type checking
- **ESLint** - Code linting and formatting
- **Prettier** - Code formatting

### Version Control
- **Git** - Source code management
- **GitHub** - Repository hosting and collaboration

### Deployment
- **Vercel** - Frontend hosting and deployment
- **Supabase** - Backend hosting and database
- **Environment variables** - Secure configuration management

## Key Features

### Real-time Capabilities
- **Live data updates** - Real-time dashboard updates
- **WebSocket connections** - Instant notifications
- **Offline support** - Graceful degradation

### Performance
- **Code splitting** - Lazy loading of components
- **Image optimization** - Automatic image compression
- **Caching strategies** - Efficient data fetching

### Security
- **Row Level Security** - Database-level access control
- **JWT tokens** - Secure authentication
- **Environment variables** - Secure configuration
- **Input validation** - Data sanitization

## Recent Improvements

### Session Management
- **Robust error handling** - Prevents session crashes
- **Admin status checking** - Improved reliability
- **Duplicate modal fixes** - Resolved DOM conflicts

### Database Schema
- **Complete schema documentation** - Up-to-date table structures
- **Migration scripts** - Safe database updates
- **Foreign key constraints** - Data integrity

### RAG System
- **Configurable prompts** - Admin-editable templates
- **Chunking settings** - Adjustable parameters
- **Real-time monitoring** - Pipeline status tracking 