import React from "react";
import { Home, Calendar, Plus, MessageCircle } from "lucide-react";

export type TabId =
  | "overview"
  | "protocol"
  | "log"
  | "chat"
  | "weekly"
  | "session"
  | "biomarkers";

interface Tab {
  id: TabId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface BottomNavigationProps {
  activeTab: TabId;
  onTabChange: (tabId: TabId) => void;
  onLogTap: () => void;
  onChatTap: () => void;
}

const tabs: Tab[] = [
  {
    id: "overview",
    label: "Overview",
    icon: Home,
  },
  {
    id: "protocol",
    label: "Protocol",
    icon: Calendar,
  },
  {
    id: "log",
    label: "Log",
    icon: Plus,
  },
  {
    id: "chat",
    label: "Chat",
    icon: MessageCircle,
  },
];

export function BottomNavigation({ activeTab, onTabChange, onLogTap, onChatTap }: BottomNavigationProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-lg flex justify-around items-center h-16 md:hidden">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => {
              if (tab.id === "log") {
                onLogTap();
              } else if (tab.id === "chat") {
                onChatTap();
              } else {
                onTabChange(tab.id);
              }
            }}
            className={`flex flex-col items-center justify-center flex-1 py-2 ${isActive ? "text-spotify-green" : "text-gray-400"}`}
          >
            <Icon className="w-6 h-6 mb-1" />
            <span className="text-xs">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
