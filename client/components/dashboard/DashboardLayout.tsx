import React from "react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 dark:from-spotify-gray-900 dark:via-spotify-gray-800 dark:to-spotify-gray-700">
      <div className="container mx-auto px-4 md:px-6 py-4 md:py-8">
        <div className="max-w-6xl mx-auto">{children}</div>
      </div>
    </div>
  );
}
