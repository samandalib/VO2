# Authentication Architecture

## Production
- **Provider:** Supabase Auth
- **Methods:**
  - Email/password
  - Magic link (passwordless)
  - OAuth (Google, etc.) — **Currently NOT enabled**
- **Session Management:** Supabase client SDK, JWT tokens
- **Admin Access:** Determined by `is_admin` in `user_profiles`
- **Security:** No mock/demo users in production; all access is real

> **Note:**
> Google OAuth is **not currently enabled** in production. The codebase includes:
> - Environment variable checks for `VITE_GOOGLE_CLIENT_ID`.
> - Placeholder logic in auth context and modals to support Google OAuth if enabled in the future.
> - To enable: set up Google Cloud OAuth credentials, add your domain to allowed origins, and set the env variable in your deployment.

## Development
- **All production methods available**
- **Mock/Demo Users:**
  - Can sign in as a demo user (localStorage `mock_auth_user`)
  - Only enabled in dev mode (`import.meta.env.DEV`)
  - Never runs in production
- **Testing:**
  - Use mock users for UI/dev testing without real auth

## Key Files
- `client/contexts/SupabaseAuthContext.tsx`
- `client/contexts/AuthContext.tsx`
- `client/components/auth/SimpleAuthModal.tsx`
- `client/components/auth/DevAuthModal.tsx`

---
For Google OAuth setup, see `GOOGLE_OAUTH_SETUP.md`. 