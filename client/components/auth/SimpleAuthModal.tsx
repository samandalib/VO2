import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Shield, Zap, Target, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface SimpleAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  title?: string;
  description?: string;
}

export function SimpleAuthModal({
  isOpen,
  onClose,
  onSuccess,
  title = "Sign in to continue",
  description = "Create your personalized training plan",
}: SimpleAuthModalProps) {
  const { signInWithGoogle, isLoading, error, clearError, isAuthenticated } =
    useAuth();
  const [isSigningIn, setIsSigningIn] = useState(false);

  // Close modal and call success callback when user becomes authenticated
  useEffect(() => {
    if (isAuthenticated && isOpen) {
      onClose();
      onSuccess?.();
    }
  }, [isAuthenticated, isOpen, onClose, onSuccess]);

  // Clear error when modal opens
  useEffect(() => {
    if (isOpen) {
      clearError();
    }
  }, [isOpen, clearError]);

  const handleGoogleSignIn = async () => {
    console.log("Google sign-in button clicked");
    setIsSigningIn(true);

    try {
      await signInWithGoogle();
      console.log("Google sign-in successful");
    } catch (error) {
      console.error("Sign in failed:", error);
      // If FedCM fails, try rendering button as fallback
      if (error instanceof Error && error.message.includes("FedCM")) {
        console.log("FedCM failed, trying button fallback");
        const buttonElement = document.getElementById("google-signin-button");
        if (buttonElement && window.google) {
          buttonElement.style.display = "block";
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
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleClose = () => {
    if (!isLoading && !isSigningIn) {
      clearError();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        zIndex: 50000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
      }}
      onClick={handleClose}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "12px",
          padding: "32px",
          maxWidth: "400px",
          width: "100%",
          maxHeight: "90vh",
          overflow: "auto",
          position: "relative",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            background: "none",
            border: "none",
            fontSize: "20px",
            cursor: "pointer",
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <X size={16} />
        </button>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              backgroundColor: "#dbeafe",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
            }}
          >
            <Shield
              style={{ width: "24px", height: "24px", color: "#1d4ed8" }}
            />
          </div>
          <h2
            style={{
              fontSize: "20px",
              fontWeight: "600",
              marginBottom: "8px",
              color: "#111827",
            }}
          >
            {title}
          </h2>
          <p
            style={{
              color: "#6b7280",
              fontSize: "14px",
              lineHeight: "1.5",
            }}
          >
            {description}
          </p>
        </div>

        {/* Benefits */}
        <div
          style={{
            backgroundColor: "#f9fafb",
            borderRadius: "8px",
            padding: "16px",
            marginBottom: "24px",
          }}
        >
          <h4
            style={{
              fontWeight: "500",
              fontSize: "14px",
              marginBottom: "12px",
              color: "#111827",
            }}
          >
            Why sign in?
          </h4>
          <div style={{ fontSize: "14px", color: "#6b7280" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "8px",
              }}
            >
              <Zap
                style={{ width: "16px", height: "16px", color: "#1d4ed8" }}
              />
              <span>Personalized training plans</span>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "8px",
              }}
            >
              <Target
                style={{ width: "16px", height: "16px", color: "#1d4ed8" }}
              />
              <span>Track your progress</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Shield
                style={{ width: "16px", height: "16px", color: "#1d4ed8" }}
              />
              <span>Secure data sync</span>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div
            style={{
              backgroundColor: "#fef2f2",
              border: "1px solid #fecaca",
              borderRadius: "8px",
              padding: "12px",
              marginBottom: "16px",
              color: "#dc2626",
              fontSize: "14px",
            }}
          >
            {error}
            {error.includes("Google Client ID") && (
              <div style={{ marginTop: "8px", fontSize: "12px" }}>
                <p>The Google authentication is not properly configured.</p>
                <p>Please check the setup instructions or contact support.</p>
              </div>
            )}
            {error.includes("origin is not allowed") && (
              <div style={{ marginTop: "8px", fontSize: "12px" }}>
                <p>
                  <strong>Origin Error:</strong> The current URL (
                  {window.location.origin}) is not authorized.
                </p>
                <p>
                  Please add <strong>{window.location.origin}</strong> to your
                  Google OAuth Client ID in Google Cloud Console.
                </p>
                <p>
                  Go to: APIs & Services → Credentials → Edit your Client ID →
                  Add to Authorized JavaScript origins
                </p>
              </div>
            )}
          </div>
        )}

        {/* Prioritize Mock Sign In if Google OAuth has issues */}
        {error && error.includes("not configured") ? (
          <>
            {/* Mock Sign In - Primary option when Google OAuth unavailable */}
            <Button
              onClick={() => {
                console.log("Mock sign-in clicked");
                const mockUser = {
                  id: "mock-user-123",
                  email: "test@example.com",
                  name: "Test User",
                  picture: "https://via.placeholder.com/40",
                  provider: "google" as const,
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                };

                localStorage.setItem(
                  "mock_auth_user",
                  JSON.stringify(mockUser),
                );
                onSuccess?.();
                onClose();
              }}
              style={{
                width: "100%",
                height: "48px",
                backgroundColor: "#10b981",
                border: "none",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "12px",
                fontSize: "14px",
                fontWeight: "500",
                color: "white",
                cursor: "pointer",
                marginBottom: "12px",
              }}
            >
              🚀 Continue with Demo Account
            </Button>

            {/* Google Sign In - Secondary option */}
            <Button
              onClick={handleGoogleSignIn}
              disabled={isLoading || isSigningIn}
              style={{
                width: "100%",
                height: "48px",
                backgroundColor: "white",
                border: "1px solid #d1d5db",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "12px",
                fontSize: "14px",
                fontWeight: "500",
                color: "#6b7280",
                cursor: isLoading || isSigningIn ? "not-allowed" : "pointer",
                opacity: 0.7,
              }}
            >
              <GoogleIcon style={{ width: "20px", height: "20px" }} />
              Continue with Google (Requires Setup)
            </Button>
          </>
        ) : (
          <>
            {/* Google Sign In - Primary option when available */}
            <Button
              onClick={handleGoogleSignIn}
              disabled={isLoading || isSigningIn}
              style={{
                width: "100%",
                height: "48px",
                backgroundColor: "white",
                border: "1px solid #d1d5db",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "12px",
                fontSize: "14px",
                fontWeight: "500",
                color: "#374151",
                cursor: isLoading || isSigningIn ? "not-allowed" : "pointer",
                opacity: isLoading || isSigningIn ? 0.6 : 1,
                marginBottom: "12px",
              }}
            >
              {isSigningIn ? (
                <Loader2
                  style={{
                    width: "16px",
                    height: "16px",
                    animation: "spin 1s linear infinite",
                  }}
                />
              ) : (
                <GoogleIcon style={{ width: "20px", height: "20px" }} />
              )}
              {isSigningIn ? "Signing in..." : "Continue with Google"}
            </Button>

            {/* Mock Sign In - Alternative option */}
            <Button
              onClick={() => {
                console.log("Mock sign-in clicked");
                const mockUser = {
                  id: "mock-user-123",
                  email: "test@example.com",
                  name: "Test User",
                  picture: "https://via.placeholder.com/40",
                  provider: "google" as const,
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                };

                localStorage.setItem(
                  "mock_auth_user",
                  JSON.stringify(mockUser),
                );
                onSuccess?.();
                onClose();
              }}
              style={{
                width: "100%",
                height: "48px",
                backgroundColor: "#f59e0b",
                border: "none",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "12px",
                fontSize: "14px",
                fontWeight: "500",
                color: "white",
                cursor: "pointer",
              }}
            >
              🚀 Or Use Demo Account
            </Button>
          </>
        )}

        <div style={{ marginTop: "16px", textAlign: "center" }}>
          <p
            style={{
              fontSize: "12px",
              color: "#9ca3af",
              lineHeight: "1.4",
              marginBottom: "8px",
            }}
          >
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
          <p
            style={{
              fontSize: "11px",
              color: "#6b7280",
              backgroundColor: "#f9fafb",
              padding: "8px",
              borderRadius: "4px",
              lineHeight: "1.3",
            }}
          >
            <strong>For Testing:</strong> Use "Mock Sign In" button if Google
            authentication shows origin errors. To fix Google auth permanently,
            add{" "}
            <code
              style={{
                backgroundColor: "#e5e7eb",
                padding: "2px 4px",
                borderRadius: "2px",
              }}
            >
              http://localhost:8080
            </code>{" "}
            to your Google OAuth Client ID's authorized origins.
          </p>
        </div>

        {/* Fallback button container for Google Sign-In */}
        <div
          id="google-signin-button"
          style={{
            display: "none",
            marginTop: "16px",
            textAlign: "center",
          }}
        ></div>
      </div>
    </div>
  );
}

// Google Icon Component
function GoogleIcon({ style }: { style?: React.CSSProperties }) {
  return (
    <svg style={style} viewBox="0 0 24 24">
      <path
        fill="#4285f4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34a853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#fbbc05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#ea4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
      <path fill="none" d="M1 1h22v22H1z" />
    </svg>
  );
}
