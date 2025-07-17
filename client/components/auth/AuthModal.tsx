import React, { useState } from "react";
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
import { Mail, Loader2, AlertCircle } from "lucide-react";
import { useAuth } from "@/contexts/SupabaseAuthContext";

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
  const { loading: isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSendMagicLink = async () => {
    setError("");
    setSending(true);
    try {
      // Use Supabase magic link
      const { supabase } = await import("@/lib/supabase");
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) {
        setError(error.message);
        setSending(false);
        return;
      }
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setSending(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">{title}</DialogTitle>
          <DialogDescription className="text-center">
            {description}
          </DialogDescription>
        </DialogHeader>
        {success ? (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="text-green-600 text-lg font-semibold mb-4">Check your email!</div>
            <div className="mb-6 text-center">A magic login link has been sent to <span className="font-mono">{email}</span>.<br />Click the link in your inbox to sign in.</div>
            <Button onClick={onClose}>Close</Button>
          </div>
        ) : (
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSendMagicLink();
            }}
            className="space-y-6"
          >
            {error && (
              <div className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="pl-10"
                  required
                  disabled={isLoading || sending}
                />
              </div>
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || sending || !email}
            >
              {sending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending Magic Link...
                </>
              ) : (
                "Send Magic Link"
              )}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
