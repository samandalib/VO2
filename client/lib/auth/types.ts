export interface User {
  id: string;
  email: string;
  name: string;
  picture?: string;
  provider: "google" | "email";
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

export interface AuthContextType extends AuthState {
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (
    email: string,
    password: string,
    name: string,
  ) => Promise<any>;
  signOut: () => Promise<void>;
  clearError: () => void;
  verifyEmail: (token: string) => Promise<any>;
  resendVerification: (email: string) => Promise<any>;
  forgotPassword: (email: string) => Promise<any>;
  resetPassword: (token: string, password: string) => Promise<any>;
  validateResetToken: (token: string) => Promise<any>;
}

export interface GoogleAuthResponse {
  credential: string;
  clientId: string;
}

export interface AuthTokenResponse {
  user: User;
  token: string;
  expiresAt: string;
}

export interface EmailSignInRequest {
  email: string;
  password: string;
}

export interface EmailSignUpRequest {
  email: string;
  password: string;
  name: string;
}
