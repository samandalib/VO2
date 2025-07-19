import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, User, AlertCircle, Shield, Zap, Target, Loader2 } from "lucide-react";
import { useAuthV2 } from "@/contexts/SupabaseAuthContextV2";
import { useNavigate } from "react-router-dom";

interface SimpleAuthModalV2Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  title?: string;
  description?: string;
}

export function SimpleAuthModalV2({
  isOpen,
  onClose,
  onSuccess,
  title = "Sign in to continue",
  description = "Create your personalized training plan",
}: SimpleAuthModalV2Props) {
  const { signInWithMagicLink, signInWithDemo, signIn, signUp, loading, user } = useAuthV2();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const isAuthenticated = !!user;

  // Close modal and call success callback when user becomes authenticated
  useEffect(() => {
    if (isAuthenticated && isOpen) {
      onClose();
      onSuccess?.();
    }
  }, [isAuthenticated, isOpen, onClose, onSuccess]);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setEmail("");
      setPassword("");
      setIsSignUp(false);
      setError("");
      setSuccess(false);
      setIsLoading(false);
    }
  }, [isOpen]);

  const handlePasswordAuth = async () => {
    setError("");
    setIsLoading(true);
    
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email");
      setIsLoading(false);
      return;
    }
    
    // For sign in, password is required
    if (!isSignUp && (!password || password.length < 6)) {
      setError("Password is required for sign in");
      setIsLoading(false);
      return;
    }
    
    // For sign up, only magic link is allowed
    if (isSignUp) {
      setError("Please use magic link to create your account");
      setIsLoading(false);
      return;
    }
    
    try {
      const { error } = await signIn(email, password);
        
      if (error) {
        setError(error.message);
        setIsLoading(false);
        return;
      }
      
      // Success - user will be automatically signed in
      onSuccess?.();
      onClose();
      navigate("/dashboard");
    } catch (e) {
      setError("An unexpected error occurred");
      setIsLoading(false);
    }
  };

  const handleMagicLink = async () => {
    setError("");
    setIsLoading(true);
    
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email");
      setIsLoading(false);
      return;
    }
    
    try {
      const { error } = await signInWithMagicLink(email);
      if (error) {
        setError(error.message);
        setIsLoading(false);
        return;
      }
      setSuccess(true);
      setIsLoading(false);
    } catch (e) {
      setError("An unexpected error occurred");
      setIsLoading(false);
    }
  };

  const handleDemo = () => {
    console.log("🚀 Demo account clicked - navigating directly to dashboard");
    
    // Set demo user in localStorage for V2 auth context
    const mockUser = {
      id: "f589c496-0283-44e6-8db5-aad1778f8f32",
      email: "demo@vo2max.app",
      name: "Demo User (V2)",
      picture: "https://via.placeholder.com/40",
      provider: "demo" as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    localStorage.setItem("mock_auth_user", JSON.stringify(mockUser));
    
    // Close modal and navigate immediately
    onClose();
    navigate("/dashboard");
  };

  const handleClose = () => {
    if (!loading && !isLoading) {
      setError("");
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center flex items-center justify-center gap-2">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
              <Shield className="w-4 h-4 text-primary" />
            </div>
            {title} (V2)
          </DialogTitle>
          <DialogDescription className="text-center">{description}</DialogDescription>
        </DialogHeader>
        <Card>
          <CardHeader>
            <CardTitle className="text-center">
              {isSignUp ? "Create Account (V2)" : "Sign In (V2)"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {success ? (
              <div className="text-green-600 text-center mb-4">
                Check your email for a magic link to sign in.
              </div>
            ) : (
              <form
                onSubmit={e => {
                  e.preventDefault();
                  if (isSignUp) {
                    handleMagicLink();
                  } else {
                    handlePasswordAuth();
                  }
                }}
                className="space-y-4"
              >
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    disabled={isLoading}
                  />
                </div>
                
                {!isSignUp && (
                  <div>
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      autoComplete="current-password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      disabled={isLoading}
                    />
                    <div className="mt-2">
                      <button
                        type="button"
                        onClick={handleMagicLink}
                        className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline"
                        disabled={isLoading}
                      >
                        Forgot password? Sign in with magic link
                      </button>
                    </div>
                  </div>
                )}
                
                {error && (
                  <div className="flex items-center text-red-600 text-sm mt-2">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {error}
                  </div>
                )}
                
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Processing..." : (isSignUp ? "Send Magic Link (V2)" : "Sign In (V2)")}
                </Button>
                
                {isSignUp && (
                  <p className="text-xs text-center text-muted-foreground">
                    We'll send you a magic link to create your account
                  </p>
                )}
                
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setIsSignUp(!isSignUp)}
                    className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    disabled={isLoading}
                  >
                    {isSignUp ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
                  </button>
                </div>
              </form>
            )}
            

            
            {import.meta.env.DEV && !success && (
              <>
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Or</span>
                  </div>
                </div>
                
                <Button variant="outline" className="w-full" onClick={handleDemo}>
                  Continue with Demo Account (V2)
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}

 