# Authentication System

## Overview
The VO2Max Training App uses Supabase for authentication with multiple sign-in methods and admin access control.

## Authentication Methods

### 1. Email/Password Authentication
- Standard email and password sign-in
- Password validation and security
- Error handling for invalid credentials

### 2. Magic Link Authentication
- Passwordless sign-in via email
- Secure token-based authentication
- Automatic session management

### 3. Google OAuth
- One-click Google sign-in
- Automatic profile creation
- Secure token handling

### 4. Demo Mode (Development)
- Local development authentication
- Mock user for testing
- Stored in localStorage

## Session Management

### Session Persistence
- Automatic session restoration on page load
- Timeout handling with 5-second fallback
- Graceful error handling for network issues

### Session Termination Fixes
- **Issue**: Sessions were terminating due to admin status check failures
- **Solution**: Improved error handling in `useAdminStatus` hook
- **Result**: Sessions now persist properly without crashes

### Admin Status Checking
- **Hook**: `useAdminStatus(userId)` - Returns `{ isAdmin, loading }`
- **Database**: Checks `user_profiles.is_admin` column
- **Error Handling**: Graceful fallback to `false` on errors
- **Performance**: Prevents session crashes from failed queries

## Admin Access Control

### Admin Privileges
- **Determined by**: `is_admin` column in `user_profiles` table
- **Default**: `false` for all users
- **Setting Admin**: Use SQL script `scripts/set-admin-status.sql`

### Admin Features
- RAG Admin Dashboard access
- System configuration management
- User management capabilities

## Key Components

### Authentication Context
- **File**: `client/contexts/SupabaseAuthContext.tsx`
- **Hook**: `useAuth()` - Provides user state and auth methods
- **Features**: Session management, user state, auth methods

### Admin Status Hook
- **File**: `client/hooks/useAdminStatus.ts`
- **Purpose**: Check user admin privileges
- **Error Handling**: Robust error handling prevents session crashes

### Auth Modals
- **SimpleAuthModal**: Main authentication interface
- **Features**: Email/password, magic link, Google OAuth, demo mode
- **Fixed**: Removed duplicate modal rendering that caused DOM conflicts

## Database Schema

### User Profiles Table
```sql
CREATE TABLE public.user_profiles (
  id uuid NOT NULL,
  email text,
  name text,
  picture text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  is_admin boolean DEFAULT false,
  CONSTRAINT user_profiles_pkey PRIMARY KEY (id)
);
```

## Recent Fixes

### Session Termination Issues
1. **Duplicate Auth Modals**: Removed conflicting `AuthModal` from `Index.tsx`
2. **Admin Status Errors**: Improved error handling in `useAdminStatus` hook
3. **Database Schema**: Added missing `is_admin` column to schema
4. **Error Recovery**: Admin status failures no longer crash sessions

### Migration Scripts
- `scripts/add-admin-column.sql`: Safe column addition
- `scripts/set-admin-status.sql`: Grant admin privileges

## Security Considerations

- Row Level Security (RLS) enabled on all tables
- User data isolation through foreign key constraints
- Secure token handling and validation
- Admin privileges require explicit database update 