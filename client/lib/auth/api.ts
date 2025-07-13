import {
  AuthTokenResponse,
  User,
  EmailSignInRequest,
  EmailSignUpRequest,
} from "./types";

const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

export class AuthAPI {
  private static getStoredToken(): string | null {
    return localStorage.getItem("auth_token");
  }

  private static setStoredToken(token: string): void {
    localStorage.setItem("auth_token", token);
  }

  private static removeStoredToken(): void {
    localStorage.removeItem("auth_token");
  }

  private static getAuthHeaders(): HeadersInit {
    const token = this.getStoredToken();
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  /**
   * Authenticate with Google ID token
   */
  static async authenticateWithGoogle(
    idToken: string,
  ): Promise<AuthTokenResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/google`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ idToken }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Authentication failed");
    }

    const data: AuthTokenResponse = await response.json();

    // Store the token
    this.setStoredToken(data.token);

    return data;
  }

  /**
   * Sign up with email and password
   */
  static async signUpWithEmail(signUpData: EmailSignUpRequest): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(signUpData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Sign up failed");
    }

    const data = await response.json();

    // If account requires verification, don't set token
    if (data.requiresVerification) {
      return data;
    }

    // Store the token (for cases where verification might be disabled)
    if (data.token) {
      this.setStoredToken(data.token);
    }

    return data;
  }

  /**
   * Sign in with email and password
   */
  static async signInWithEmail(
    signInData: EmailSignInRequest,
  ): Promise<AuthTokenResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(signInData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Sign in failed");
    }

    const data: AuthTokenResponse = await response.json();

    // Store the token
    this.setStoredToken(data.token);

    return data;
  }

  /**
   * Get current user profile
   */
  static async getCurrentUser(): Promise<User | null> {
    const token = this.getStoredToken();
    if (!token) return null;

    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        if (response.status === 401) {
          this.removeStoredToken();
          return null;
        }
        throw new Error("Failed to get user profile");
      }

      return await response.json();
    } catch (error) {
      console.error("Error getting current user:", error);
      this.removeStoredToken();
      return null;
    }
  }

  /**
   * Sign out user
   */
  static async signOut(): Promise<void> {
    const token = this.getStoredToken();

    if (token) {
      try {
        await fetch(`${API_BASE_URL}/auth/signout`, {
          method: "POST",
          headers: this.getAuthHeaders(),
        });
      } catch (error) {
        console.error("Error during sign out:", error);
      }
    }

    this.removeStoredToken();
  }

  /**
   * Check if user has valid token
   */
  static hasValidToken(): boolean {
    const token = this.getStoredToken();
    return !!token;
  }

  /**
   * Verify email with token
   */
  static async verifyEmail(token: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/auth/verify-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Email verification failed");
    }

    return await response.json();
  }

  /**
   * Resend verification email
   */
  static async resendVerification(email: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/auth/resend-verification`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to resend verification email");
    }

    return await response.json();
  }

  /**
   * Request password reset
   */
  static async forgotPassword(email: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to send password reset email");
    }

    return data;
  }

  /**
   * Reset password with token
   */
  static async resetPassword(token: string, password: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to reset password");
    }

    return data;
  }

  /**
   * Validate reset token
   */
  static async validateResetToken(token: string): Promise<any> {
    const response = await fetch(
      `${API_BASE_URL}/auth/validate-reset-token?token=${encodeURIComponent(token)}`,
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Invalid reset token");
    }

    return data;
  }
}
