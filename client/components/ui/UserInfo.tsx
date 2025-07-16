import React from "react";
import { Button } from "@/components/ui/button";
import { LogOut, LogIn, User as UserIcon } from "lucide-react";
import { useAuth } from "@/contexts/SupabaseAuthContext";

interface UserInfoProps {
  className?: string;
  showSignInButton?: boolean;
  onSignIn?: () => void;
  variant?: "header" | "compact";
}

export function UserInfo({
  className = "",
  showSignInButton = false,
  onSignIn,
  variant = "compact",
}: UserInfoProps) {
  const { user, signOut } = useAuth();

  if (!user && !showSignInButton) {
    return null;
  }

  const baseClasses = "flex items-center gap-3";
  const combinedClasses = `${baseClasses} ${className}`;

  return (
    <div className={combinedClasses}>
      {user ? (
        <>
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
        </>
      ) : (
        showSignInButton &&
        onSignIn && (
          <Button
            onClick={onSignIn}
            variant="outline"
            className="bg-background/80 backdrop-blur-sm hover:bg-background/90 transition-all duration-300"
          >
            <LogIn className="w-4 h-4 mr-2" />
            Sign In
          </Button>
        )
      )}
    </div>
  );
}
