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
import { Mail, User, AlertCircle } from "lucide-react";
import { useAuth } from "@/contexts/SupabaseAuthContext";
import { useNavigate } from "react-router-dom";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  onSuccess?: () => void;
}

export function AuthModal({
  isOpen,
  onClose,
  title = "Welcome to VO₂Max Training",
  description = "Sign in to track your progress and access personalized training protocols",
  onSuccess,
}: AuthModalProps) {
  const { signInWithMagicLink, signInWithDemo } = useAuth();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setEmail("");
      setError("");
      setSuccess(false);
      setIsLoading(false);
    }
  }, [isOpen]);

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

  const handleDemo = async () => {
    setError("");
    setIsLoading(true);
    try {
      await signInWithDemo();
      onSuccess?.();
      onClose();
      navigate("/dashboard");
    } catch (e) {
      setError("Failed to sign in as demo user");
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">{title}</DialogTitle>
          <DialogDescription className="text-center">{description}</DialogDescription>
        </DialogHeader>
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Sign in with Magic Link</CardTitle>
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
                  handleMagicLink();
                }}
                className="space-y-4"
              >
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
                {error && (
                  <div className="flex items-center text-red-600 text-sm mt-2">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {error}
                  </div>
                )}
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Sending..." : "Send Magic Link"}
                </Button>
              </form>
            )}
            {import.meta.env.DEV ? (
              <>
                <span className="text-xs text-gray-500 mb-2">or</span>
                <Button variant="outline" className="w-full" onClick={handleDemo} disabled={isLoading}>
                  Continue with Demo Account
                </Button>
              </>
            ) : null}
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
