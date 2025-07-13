import React, {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useCallback,
} from "react";
import {
  AuthState,
  AuthContextType,
  User,
  GoogleAuthResponse,
} from "@/lib/auth/types";
import { AuthAPI } from "@/lib/auth/api";

// Auth Actions
type AuthAction =
  | { type: "SET_LOADING"; loading: boolean }
  | { type: "SET_USER"; user: User | null }
  | { type: "SET_ERROR"; error: string | null }
  | { type: "CLEAR_ERROR" }
  | { type: "SIGN_OUT" };

// Auth Reducer
function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.loading };

    case "SET_USER":
      return {
        ...state,
        user: action.user,
        isAuthenticated: !!action.user,
        isLoading: false,
        error: null,
      };

    case "SET_ERROR":
      return {
        ...state,
        error: action.error,
        isLoading: false,
      };

    case "CLEAR_ERROR":
      return { ...state, error: null };

    case "SIGN_OUT":
      return {
        user: null,
        isLoading: false,
        isAuthenticated: false,
        error: null,
      };

    default:
      return state;
  }
}

// Initial state
const initialState: AuthState = {
  user: null,
  isLoading: true,
  isAuthenticated: false,
  error: null,
};

// Auth Context
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

// Google Auth configuration
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const DISABLE_GOOGLE_OAUTH =
  import.meta.env.VITE_DISABLE_GOOGLE_OAUTH === "true";

// Auth Provider
interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Initialize authentication state
  useEffect(() => {
    const initializeAuth = async () => {
      dispatch({ type: "SET_LOADING", loading: true });

      try {
        // Check for mock user first (for testing)
        const mockUser = localStorage.getItem("mock_auth_user");
        if (mockUser) {
          console.log("Found mock user, using for testing");
          dispatch({ type: "SET_USER", user: JSON.parse(mockUser) });
          return;
        }

        // Try real authentication
        const user = await AuthAPI.getCurrentUser();
        dispatch({ type: "SET_USER", user });
      } catch (error) {
        console.error("Auth initialization error:", error);
        dispatch({ type: "SET_USER", user: null });
      }
    };

    initializeAuth();
  }, []);

  // Load Google Identity Services script
  useEffect(() => {
    if (DISABLE_GOOGLE_OAUTH) {
      console.log("Google OAuth disabled by environment variable");
      dispatch({
        type: "SET_ERROR",
        error: "Google authentication disabled. Use Demo Account for testing.",
      });
      return;
    }

    if (!GOOGLE_CLIENT_ID || GOOGLE_CLIENT_ID === "demo-google-client-id") {
      console.warn("Google Client ID not configured properly");
      dispatch({
        type: "SET_ERROR",
        error: "Google authentication not configured",
      });
      return;
    }

    // Check if current origin is likely to cause OAuth errors
    const currentOrigin = window.location.origin;
    const isLocalhost = currentOrigin.includes("localhost");

    if (isLocalhost && currentOrigin !== "http://localhost:3000") {
      console.warn(
        `Current origin ${currentOrigin} may not be authorized for Google OAuth.`,
      );
      dispatch({
        type: "SET_ERROR",
        error: `Google OAuth not configured for ${currentOrigin}. Add this origin to Google Cloud Console or use Mock Sign In.`,
      });
      return;
    }

    // Check if script is already loaded
    if (window.google) {
      console.log("Google Identity Services already loaded");
      return;
    }

    // Check if script is already in the document
    const existingScript = document.querySelector(
      'script[src="https://accounts.google.com/gsi/client"]',
    );
    if (existingScript) {
      console.log("Google Identity Services script already exists");
      return;
    }

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;

    script.onload = () => {
      console.log("Google Identity Services loaded successfully");
    };

    script.onerror = () => {
      console.error("Failed to load Google Identity Services");
      dispatch({
        type: "SET_ERROR",
        error: "Failed to load Google authentication",
      });
    };

    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  const signInWithGoogle = useCallback((): Promise<void> => {
    return new Promise((resolve, reject) => {
      console.log("signInWithGoogle called");

      // Check if current origin is authorized before attempting Google OAuth
      const currentOrigin = window.location.origin;
      const isLocalhost = currentOrigin.includes("localhost");

      if (isLocalhost && currentOrigin !== "http://localhost:3000") {
        const error = new Error(
          `Google OAuth not configured for ${currentOrigin}. Please add this origin to your Google Cloud Console or use the Demo Account option.`,
        );
        dispatch({ type: "SET_ERROR", error: error.message });
        reject(error);
        return;
      }

      if (!GOOGLE_CLIENT_ID || GOOGLE_CLIENT_ID === "demo-google-client-id") {
        const error = new Error(
          "Google Client ID not configured properly. Please check your .env file.",
        );
        dispatch({ type: "SET_ERROR", error: error.message });
        reject(error);
        return;
      }

      if (!window.google) {
        const error = new Error(
          "Google Identity Services not loaded. Please check your internet connection.",
        );
        dispatch({ type: "SET_ERROR", error: error.message });
        reject(error);
        return;
      }

      dispatch({ type: "SET_LOADING", loading: true });
      dispatch({ type: "CLEAR_ERROR" });

      try {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: async (response: GoogleAuthResponse) => {
            try {
              const authResponse = await AuthAPI.authenticateWithGoogle(
                response.credential,
              );
              dispatch({ type: "SET_USER", user: authResponse.user });
              resolve();
            } catch (error) {
              const message =
                error instanceof Error
                  ? error.message
                  : "Authentication failed";
              dispatch({ type: "SET_ERROR", error: message });
              reject(error);
            }
          },
          auto_select: false,
          cancel_on_tap_outside: true,
          use_fedcm_for_prompt: false, // Disable FedCM to avoid permission issues
        });

        window.google.accounts.id.prompt((notification: any) => {
          if (notification.isNotDisplayed()) {
            // Fallback to popup if prompt is not displayed
            const buttonElement = document.getElementById(
              "google-signin-button",
            );
            if (buttonElement) {
              window.google.accounts.id.renderButton(buttonElement, {
                theme: "outline",
                size: "large",
                type: "standard",
                text: "signin_with",
                shape: "rectangular",
                logo_alignment: "left",
              });
            }
          }
        });
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to initialize Google Sign-In";
        dispatch({ type: "SET_ERROR", error: message });
        reject(error);
      }
    });
  }, []);

  const signInWithEmail = useCallback(
    async (email: string, password: string): Promise<void> => {
      dispatch({ type: "SET_LOADING", loading: true });
      dispatch({ type: "CLEAR_ERROR" });

      try {
        const authResponse = await AuthAPI.signInWithEmail({ email, password });
        dispatch({ type: "SET_USER", user: authResponse.user });
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Sign in failed";
        dispatch({ type: "SET_ERROR", error: message });
        throw error;
      }
    },
    [],
  );

  const signUpWithEmail = useCallback(
    async (email: string, password: string, name: string): Promise<any> => {
      dispatch({ type: "SET_LOADING", loading: true });
      dispatch({ type: "CLEAR_ERROR" });

      try {
        const response = await AuthAPI.signUpWithEmail({
          email,
          password,
          name,
        });

        // If requires verification, don't set user yet
        if (response.requiresVerification) {
          dispatch({ type: "SET_LOADING", loading: false });
          return response;
        }

        // If immediate login (though unlikely with verification enabled)
        if (response.user) {
          dispatch({ type: "SET_USER", user: response.user });
        }

        return response;
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Sign up failed";
        dispatch({ type: "SET_ERROR", error: message });
        throw error;
      }
    },
    [],
  );

  const signOut = useCallback(async () => {
    dispatch({ type: "SET_LOADING", loading: true });

    try {
      // Remove mock user if exists
      localStorage.removeItem("mock_auth_user");

      await AuthAPI.signOut();

      // Sign out from Google
      if (window.google) {
        window.google.accounts.id.disableAutoSelect();
      }

      dispatch({ type: "SIGN_OUT" });
    } catch (error) {
      console.error("Sign out error:", error);
      dispatch({ type: "SIGN_OUT" }); // Still sign out locally even if API fails
    }
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: "CLEAR_ERROR" });
  }, []);

  const verifyEmail = useCallback(async (token: string): Promise<any> => {
    dispatch({ type: "SET_LOADING", loading: true });
    dispatch({ type: "CLEAR_ERROR" });

    try {
      const response = await AuthAPI.verifyEmail(token);
      dispatch({ type: "SET_LOADING", loading: false });
      return response;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Email verification failed";
      dispatch({ type: "SET_ERROR", error: message });
      throw error;
    }
  }, []);

  const resendVerification = useCallback(
    async (email: string): Promise<any> => {
      dispatch({ type: "SET_LOADING", loading: true });
      dispatch({ type: "CLEAR_ERROR" });

      try {
        const response = await AuthAPI.resendVerification(email);
        dispatch({ type: "SET_LOADING", loading: false });
        return response;
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to resend verification email";
        dispatch({ type: "SET_ERROR", error: message });
        throw error;
      }
    },
    [],
  );

  const forgotPassword = useCallback(async (email: string): Promise<any> => {
    dispatch({ type: "SET_LOADING", loading: true });
    dispatch({ type: "CLEAR_ERROR" });

    try {
      const response = await AuthAPI.forgotPassword(email);
      dispatch({ type: "SET_LOADING", loading: false });
      return response;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to send password reset email";
      dispatch({ type: "SET_ERROR", error: message });
      throw error;
    }
  }, []);

  const resetPassword = useCallback(
    async (token: string, password: string): Promise<any> => {
      dispatch({ type: "SET_LOADING", loading: true });
      dispatch({ type: "CLEAR_ERROR" });

      try {
        const response = await AuthAPI.resetPassword(token, password);
        dispatch({ type: "SET_LOADING", loading: false });
        return response;
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to reset password";
        dispatch({ type: "SET_ERROR", error: message });
        throw error;
      }
    },
    [],
  );

  const validateResetToken = useCallback(
    async (token: string): Promise<any> => {
      dispatch({ type: "SET_LOADING", loading: true });
      dispatch({ type: "CLEAR_ERROR" });

      try {
        const response = await AuthAPI.validateResetToken(token);
        dispatch({ type: "SET_LOADING", loading: false });
        return response;
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Invalid reset token";
        dispatch({ type: "SET_ERROR", error: message });
        throw error;
      }
    },
    [],
  );

  const contextValue: AuthContextType = {
    ...state,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    signOut,
    clearError,
    verifyEmail,
    resendVerification,
    forgotPassword,
    resetPassword,
    validateResetToken,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Hook for authentication guard
export function useAuthGuard() {
  const { isAuthenticated, isLoading } = useAuth();

  return {
    isAuthenticated,
    isLoading,
    requireAuth: !isLoading && !isAuthenticated,
  };
}

// Declare Google Identity Services types
declare global {
  interface Window {
    google: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          prompt: (callback: (notification: any) => void) => void;
          renderButton: (element: HTMLElement, config: any) => void;
          disableAutoSelect: () => void;
        };
      };
    };
  }
}
