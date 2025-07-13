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

export function BottomNavigation({
  activeTab,
  onTabChange,
  onLogTap,
  onChatTap,
}: BottomNavigationProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <div className="bg-card/95 backdrop-blur-xl border-t border-border">
        <div className="flex items-center justify-around px-2 py-2">
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
                className={`flex flex-col items-center justify-center p-2 rounded-lg min-w-0 flex-1 transition-all duration-200 ${
                  tab.id === "log"
                    ? "text-white bg-primary hover:bg-primary/90 shadow-lg scale-105"
                    : tab.id === "chat"
                      ? "text-muted-foreground hover:text-primary hover:bg-primary/10"
                      : isActive
                        ? "text-primary bg-primary/10"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                <Icon
                  className={`w-5 h-5 mb-1 ${
                    tab.id === "log"
                      ? "text-white"
                      : tab.id === "chat"
                        ? ""
                        : isActive
                          ? "text-primary"
                          : ""
                  }`}
                />
                <span
                  className={`text-xs font-medium truncate ${
                    tab.id === "log" ? "text-white" : ""
                  }`}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
