import React from "react";
import { Button } from "@/components/ui/button";
import { LogOut, User as UserIcon } from "lucide-react";
import { User } from "@/types/dashboard";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { ProfileModal } from "./ProfileModal";

interface DashboardHeaderProps {
  user: User;
  onSignOut: () => void;
}

export function DashboardHeader({ user, onSignOut }: DashboardHeaderProps) {
  const [profileOpen, setProfileOpen] = React.useState(false);

  function getDisplayName(user: User) {
    if (user?.name && user.name.trim() !== "") return user.name;
    if (user?.email) return user.email.split("@")[0];
    return "User";
  }

  return (
    <div className="spotify-header flex flex-col md:flex-row md:items-center justify-between mb-6 md:mb-8 p-4 md:p-6 rounded-2xl gap-4 md:gap-0">
      {/* Header left: title, subtitle, email */}
      <div className="flex-1 flex flex-col gap-1 justify-center">
        <p className="text-sm text-muted-foreground/80 mb-1 font-medium">
          VO₂Max Training Dashboard
        </p>
        <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-spotify-green to-emerald-400 bg-clip-text text-transparent">
          Welcome back, {getDisplayName(user)}!
        </h1>
        <span className="text-sm text-muted-foreground">{user.email}</span>
      </div>
      {/* Header right: controls */}
      <div className="flex items-center gap-2 md:gap-3 justify-end">
        <ThemeToggle />
        <Button
          variant="outline"
          size="sm"
          onClick={onSignOut}
          className="rounded-full border-spotify-green/30 text-spotify-green hover:bg-spotify-green/10 transition-all duration-200 p-2 h-10 w-10 flex items-center justify-center"
          title="Sign Out"
        >
          <LogOut className="w-5 h-5" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setProfileOpen(true)}
          className="rounded-full border-spotify-green/30 text-spotify-green hover:bg-spotify-green/10 transition-all duration-200 p-2 h-10 w-10 flex items-center justify-center"
          title="Edit Profile"
        >
          <UserIcon className="w-6 h-6" />
        </Button>
      </div>
      <ProfileModal user={user} open={profileOpen} onClose={() => setProfileOpen(false)} />
    </div>
  );
}
