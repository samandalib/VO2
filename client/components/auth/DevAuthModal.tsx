import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";

interface DevAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DevAuthModal({ isOpen, onClose }: DevAuthModalProps) {
  const navigate = useNavigate();

  const handleDemoLogin = () => {
    const mockUser = {
      id: "mock-user-123",
      email: "demo@vo2max.app",
      name: "Demo User",
      picture: "https://randomuser.me/api/portraits/men/1.jpg",
      provider: "demo",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem("mock_auth_user", JSON.stringify(mockUser));
    onClose();
    navigate("/dashboard");
  };

  if (!import.meta.env.DEV) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Dev Demo Login</DialogTitle>
          <DialogDescription className="text-center">
            Instantly log in as a demo user for development/testing. This does not use real authentication or Supabase.
          </DialogDescription>
        </DialogHeader>
        <Button className="w-full" onClick={handleDemoLogin}>
          🚀 Continue with Demo Account
        </Button>
      </DialogContent>
    </Dialog>
  );
} 