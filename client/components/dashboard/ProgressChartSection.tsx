import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TrendingUp, BarChart3 } from "lucide-react";
import { VO2MaxProgressChart } from "@/components/VO2MaxProgressChart";

interface UserProgress {
  measurements?: any[];
}

interface ProgressStats {
  baselineVO2Max?: number;
}

interface ProgressChartSectionProps {
  userProgress: UserProgress | null;
  progressStats: ProgressStats | null;
}

export function ProgressChartSection({
  userProgress,
  progressStats,
}: ProgressChartSectionProps) {
  return (
    <Card className="md:col-span-2 lg:col-span-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          VO₂Max Progress Over Time
        </CardTitle>
        <CardDescription>
          Track your cardiovascular fitness improvement since starting training
        </CardDescription>
      </CardHeader>
      <CardContent>
        {userProgress?.measurements ? (
          <VO2MaxProgressChart
            measurements={userProgress.measurements}
            baselineVO2Max={progressStats?.baselineVO2Max || 0}
          />
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">
              No Progress Data Available
            </h3>
            <p className="mb-4">
              Complete training sessions to see your progress visualization.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
