import React from "react";
import { Activity, Heart, Droplets, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LoggingOption {
  id: "weekly" | "session" | "biomarkers";
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

interface LoggingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectOption: (optionId: "weekly" | "session" | "biomarkers") => void;
}

const loggingOptions: LoggingOption[] = [
  {
    id: "weekly",
    title: "Weekly Metrics",
    description: "Log resting HR and VO₂max data",
    icon: Activity,
    color: "text-orange-500 bg-orange-50 dark:bg-orange-950/30",
  },
  {
    id: "session",
    title: "Session Metrics",
    description: "Record training session data",
    icon: Heart,
    color: "text-red-500 bg-red-50 dark:bg-red-950/30",
  },
  {
    id: "biomarkers",
    title: "Blood Biomarkers",
    description: "Track blood test results",
    icon: Droplets,
    color: "text-blue-500 bg-blue-50 dark:bg-blue-950/30",
  },
];

export function LoggingModal({
  isOpen,
  onClose,
  onSelectOption,
}: LoggingModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="absolute bottom-0 left-0 right-0 bg-card/95 backdrop-blur-xl border-t border-border rounded-t-2xl animate-in slide-in-from-bottom-full duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-semibold">Log Data</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="p-2 h-auto"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Options */}
        <div className="p-4 space-y-3">
          {loggingOptions.map((option) => {
            const Icon = option.icon;
            return (
              <button
                key={option.id}
                onClick={() => {
                  onSelectOption(option.id);
                  onClose();
                }}
                className="w-full flex items-center gap-4 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
              >
                <div className={`p-3 rounded-xl ${option.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-medium text-foreground">
                    {option.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {option.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Safe area for bottom navigation */}
        <div className="h-4" />
      </div>
    </div>
  );
}
