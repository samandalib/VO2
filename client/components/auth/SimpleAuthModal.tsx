import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, Shield, Zap, Target } from "lucide-react";
import { useAuth } from "@/contexts/SupabaseAuthContext";

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
  const { signInWithGoogle, loading, user } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const isAuthenticated = !!user;

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
      setError(null);
      setIsSigningIn(false);
    }
  }, [isOpen]);

  const handleGoogleSignIn = async () => {
    console.log("Google sign-in button clicked");
    setIsSigningIn(true);
    setError(null);

    try {
      const { error } = await signInWithGoogle();
      if (error) {
        setError(error.message || "Sign in failed");
        setIsSigningIn(false);
      }
      // Note: On success, the page will redirect to Google OAuth
      // so we don't need to handle success here or reset loading state
    } catch (error) {
      console.error("Sign in failed:", error);
      setError(error instanceof Error ? error.message : "Sign in failed");
      setIsSigningIn(false);
    }
  };

  const handleClose = () => {
    if (!loading && !isSigningIn) {
      setError(null);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center flex items-center justify-center gap-2">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
              <Shield className="w-4 h-4 text-primary" />
            </div>
            {title}
          </DialogTitle>
          <DialogDescription className="text-center">
            {description}
          </DialogDescription>
        </DialogHeader>

        {/* Benefits Section */}
        <div className="bg-muted/50 rounded-lg p-4 space-y-3">
          <h4 className="font-medium text-sm text-foreground">Why sign in?</h4>
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary" />
              <span>Personalized training plans</span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-primary" />
              <span>Track your progress</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" />
              <span>Secure data sync</span>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 text-destructive text-sm">
            {error}
            {error.includes("Google Client ID") && (
              <div className="mt-2 text-xs">
                <p>The Google authentication is not properly configured.</p>
                <p>Please check the setup instructions or contact support.</p>
              </div>
            )}
            {error.includes("origin is not allowed") && (
              <div className="mt-2 text-xs">
                <p>
                  <strong>Origin Error:</strong> The current URL (
                  {window.location.origin}) is not authorized.
                </p>
                <p>
                  Please add <strong>{window.location.origin}</strong> to your
                  Google OAuth Client ID in Google Cloud Console.
                </p>
              </div>
            )}
          </div>
        )}

        <div className="space-y-3">
          {/* Google Sign In - Primary option */}
          <Button
            onClick={handleGoogleSignIn}
            disabled={loading || isSigningIn}
            variant="outline"
            className="w-full"
          >
            {isSigningIn ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Connecting to Google...
              </>
            ) : (
              <>
                <GoogleIcon className="mr-2 h-4 w-4" />
                Continue with Google
              </>
            )}
          </Button>

          {/* Demo Account Button for Development */}
          {import.meta.env.DEV && (
            <Button
              onClick={() => {
                console.log("Mock sign-in clicked");
                const mockUser = {
                  id: "mock-user-123",
                  email: "demo@vo2max.app",
                  name: "Demo User",
                  picture: "https://via.placeholder.com/40",
                  provider: "google" as const,
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                };

                localStorage.setItem(
                  "mock_auth_user",
                  JSON.stringify(mockUser),
                );
                console.log("✅ Demo account saved to localStorage");
                onSuccess?.();
                onClose();
                window.location.href = "/dashboard";
              }}
              className="w-full"
            >
              🚀 Continue with Demo Account
            </Button>
          )}
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-xs text-muted-foreground mb-2">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
          {import.meta.env.DEV && (
            <p className="text-xs text-muted-foreground bg-muted/50 p-2 rounded text-center">
              <strong>For Testing:</strong> Use "Demo Account" if Google
              authentication shows origin errors.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Google Icon Component
function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
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
