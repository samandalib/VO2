# Google OAuth Setup Instructions

To enable Google authentication in your VO₂Max application, follow these steps:

## 1. Create a Google Cloud Project

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API or Google Identity API

## 2. Configure OAuth Consent Screen

1. Navigate to "APIs & Services" > "OAuth consent screen"
2. Choose "External" user type
3. Fill in the required information:
   - App name: "VO₂Max Training App"
   - User support email: Your email
   - Developer contact email: Your email
4. Add scopes: `email`, `profile`, `openid`
5. Add test users if needed

## 3. Create OAuth Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth client ID"
3. Choose "Web application"
4. Add authorized origins:
   - `http://localhost:3000` (for development)
   - Your production domain
5. Add authorized redirect URIs:
   - `http://localhost:3000` (for development)
   - Your production domain
6. Copy the Client ID

## 4. Update Environment Variables

Update your `.env` file with the Google Client ID:

```env
GOOGLE_CLIENT_ID=your-actual-google-client-id.apps.googleusercontent.com
VITE_GOOGLE_CLIENT_ID=your-actual-google-client-id.apps.googleusercontent.com
```

## 5. Production Considerations

For production deployment:

1. **Security**: The current implementation uses a simplified token verification. Use `@google-cloud/auth-library` for proper Google ID token verification.

2. **Database**: Replace the in-memory user storage with a proper database (PostgreSQL, MongoDB, etc.).

3. **JWT Secret**: Use a strong, random JWT secret and store it securely.

4. **HTTPS**: Ensure your production app uses HTTPS for secure authentication.

## Testing the Authentication Flow

1. Start your development server: `npm run dev`
2. Navigate to the VO₂Max form
3. Answer some questions to see protocol recommendations
4. Click "Plan with this protocol" on any protocol
5. The authentication modal should appear
6. Click "Continue with Google" to test the flow

Note: With the demo configuration, the Google sign-in will not work until you set up actual Google OAuth credentials.
