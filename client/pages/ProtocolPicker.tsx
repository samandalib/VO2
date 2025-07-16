import React from "react";
import { useNavigate } from "react-router-dom";
import { VO2MaxForm } from "@/components/VO2MaxForm";
import { VO2MaxData } from "@shared/api";
import { useAuth } from "@/contexts/SupabaseAuthContext";
import { Button } from "@/components/ui/button";
import { LogOut, LogIn, User as UserIcon } from "lucide-react";

export function ProtocolPicker() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleFormSubmit = (data: VO2MaxData) => {
    // Check if a protocol was selected (indicated by selectedProtocol in data)
    if (data.selectedProtocol) {
      // VO2MaxForm has already navigated to dashboard with protocol, no need to navigate again
      return;
    }
    // If no protocol selected, navigate to dashboard without protocol
    navigate("/dashboard");
  };

  const handleBackToHome = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* User Info Header */}
      {user && (
        <div className="absolute top-6 left-6 z-10 flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground bg-background/80 backdrop-blur-sm px-3 py-2 rounded-md border">
            <UserIcon className="w-4 h-4" />
            <span className="font-mono">{user.email}</span>
          </div>
          <Button
            onClick={signOut}
            variant="outline"
            size="sm"
            className="bg-background/80 backdrop-blur-sm hover:bg-background/90 transition-all duration-300"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      )}

      <VO2MaxForm
        onSubmit={handleFormSubmit}
        onBack={handleBackToHome}
        isLoading={false}
      />
    </div>
  );
}
