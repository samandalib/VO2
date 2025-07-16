import React from "react";
import { Button } from "@/components/ui/button";
import { LogOut, User as UserIcon } from "lucide-react";
import { User } from "@/types/dashboard";
import { ThemeToggle } from "@/components/ui/theme-toggle";

interface DashboardHeaderProps {
  user: User;
  onSignOut: () => void;
}

export function DashboardHeader({ user, onSignOut }: DashboardHeaderProps) {
  return (
    <div className="spotify-header flex flex-col md:flex-row md:items-center justify-between mb-6 md:mb-8 p-4 md:p-6 rounded-2xl bg-gradient-to-r from-spotify-green/10 to-spotify-green/5 dark:from-spotify-green/20 dark:to-spotify-green/10 backdrop-blur-sm border border-spotify-green/20 gap-4 md:gap-0">
      <div className="flex items-center gap-3 md:gap-4 justify-end">
        <div className="flex items-center gap-2">
          {user.picture && (
            <img
              src={user.picture}
              alt={user.name}
              className="w-8 h-8 rounded-full"
            />
          )}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={onSignOut}
          className="rounded-full border-spotify-green/30 text-spotify-green hover:bg-spotify-green/10 transition-all duration-200"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>

        {/* Theme Toggle */}
        <ThemeToggle />
      </div>

      <p className="text-sm text-muted-foreground/80 mb-1 font-medium">
        VO₂Max Training Dashboard
      </p>
      <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-spotify-green to-emerald-400 bg-clip-text text-transparent">
        Welcome back, {user.name}!
      </h1>
      <div className="flex flex-col gap-1">
        <span className="text-sm text-muted-foreground">{user.email}</span>
        <div className="flex items-center gap-2 text-xs text-muted-foreground/70">
          <UserIcon className="w-3 h-3" />
          <span className="font-mono">Email: {user.email}</span>
        </div>
      </div>
    </div>
  );
}
