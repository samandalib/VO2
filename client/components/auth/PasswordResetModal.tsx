import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle, Lock as LockIcon, X as XIcon } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/lib/supabase";

// Password validation function
const validatePassword = (password: string): string | null => {
  if (password.length < 8) {
    return "Password must be at least 8 characters long";
  }
  if (!/[A-Z]/.test(password)) {
    return "Password must contain at least one uppercase letter";
  }
  if (!/[a-z]/.test(password)) {
    return "Password must contain at least one lowercase letter";
  }
  if (!/[0-9]/.test(password)) {
    return "Password must contain at least one number";
  }
  return null;
};

interface PasswordResetModalProps {
  user: any;
  open: boolean;
  onClose: () => void;
}

export function PasswordResetModal({ user, open, onClose }: PasswordResetModalProps) {
  const isDemo = import.meta.env.DEV && user?.provider === "demo";
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [resettingPassword, setResettingPassword] = useState(false);

  const handlePasswordReset = async () => {
    // Validate passwords
    const validationError = validatePassword(newPassword);
    if (validationError) {
      setPasswordError(validationError);
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }
    
    setResettingPassword(true);
    setPasswordError("");
    setPasswordSuccess("");
    
    // Add timeout to prevent indefinite loading
    const timeoutId = setTimeout(() => {
      setResettingPassword(false);
      setPasswordError("Request timed out. Please try again.");
    }, 15000); // 15 second timeout
    
    try {
      if (isDemo) {
        // For demo users, just simulate success
        setPasswordSuccess("Password updated successfully! (Demo mode)");
        setTimeout(() => {
          onClose();
        }, 2000);
        clearTimeout(timeoutId);
        return;
      }
      
      // Check if user is authenticated
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error("No active session. Please sign in again.");
      }
      
      console.log("🔐 User session found:", session.user.email);
      
      // Use Supabase's built-in auth.updateUser() for password changes
      console.log("🔄 Updating password via Supabase Auth...");
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      console.log("📡 Supabase auth response:", { data, error });
      
      if (error) {
        console.error("❌ Supabase auth error:", error);
        throw error;
      }
      
      // Check if the update was successful (even if data.user might be null)
      console.log("✅ Password update completed successfully");
      
      // Set success state
      setPasswordSuccess("Password updated successfully!");
      console.log("🎉 Success message set");
      
      // Clear form and close modal after delay
      setTimeout(() => {
        setNewPassword("");
        setConfirmPassword("");
        onClose();
      }, 2000);
      
      clearTimeout(timeoutId); // Clear timeout on success
      console.log("⏰ Timeout cleared");
    } catch (error) {
      console.error("❌ Password reset error:", error);
      
      // Provide more specific error messages
      if (error && typeof error === 'object' && 'message' in error) {
        const errorMessage = (error as any).message;
        if (errorMessage.includes('password')) {
          setPasswordError(`Password error: ${errorMessage}`);
        } else if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
          setPasswordError("Network error. Please check your connection and try again.");
        } else if (errorMessage.includes('unauthorized') || errorMessage.includes('401')) {
          setPasswordError("Session expired. Please sign in again.");
        } else {
          setPasswordError(`Update failed: ${errorMessage}`);
        }
      } else {
        setPasswordError("Failed to update password. Please try again.");
      }
    }
    
    setResettingPassword(false);
    clearTimeout(timeoutId); // Clear timeout on error
  };

  const handleClose = () => {
    if (!resettingPassword) {
      setNewPassword("");
      setConfirmPassword("");
      setPasswordError("");
      setPasswordSuccess("");
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <LockIcon className="w-5 h-5" />
            Set or Reset Password
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="newPassword">New Password</Label>
            <Input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              minLength={8}
              disabled={resettingPassword}
            />
            <p className="text-xs text-gray-500 mt-1">
              Must be at least 8 characters with uppercase, lowercase, and number
            </p>
          </div>
          
          <div>
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              minLength={8}
              disabled={resettingPassword}
            />
          </div>
          
          {passwordError && (
            <div className="flex items-center text-red-600 text-sm">
              <AlertCircle className="w-4 h-4 mr-1" />
              {passwordError}
            </div>
          )}
          
          {passwordSuccess && (
            <div className="flex items-center text-green-600 text-sm">
              <CheckCircle className="w-4 h-4 mr-1" />
              {passwordSuccess}
            </div>
          )}
          
          <div className="flex gap-2 pt-2">
            <Button
              type="button"
              onClick={handlePasswordReset}
              disabled={resettingPassword || !newPassword || !confirmPassword}
              className="flex-1"
            >
              {resettingPassword ? "Updating..." : "Update Password"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={resettingPassword}
            >
              <XIcon className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 