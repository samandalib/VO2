import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, TrendingUp, BarChart3, Calendar } from "lucide-react";
import { ProgressStats } from "@/types/dashboard";

interface ProgressStatsGridProps {
  progressStats: ProgressStats | null;
}

export function ProgressStatsGrid({ progressStats }: ProgressStatsGridProps) {
  return (
    <div className="grid grid-cols-2 md:flex md:flex-row gap-3 md:gap-6">
      {/* Baseline VO2Max */}
      <Card className="spotify-card border-none bg-card/80 backdrop-blur-xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Baseline VO₂Max</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {progressStats?.baselineVO2Max?.toFixed(1) || "--"}
          </div>
          <p className="text-xs text-muted-foreground">
            ml/kg/min starting point
          </p>
        </CardContent>
      </Card>

      {/* Current VO2Max */}
      <Card className="spotify-card border-none bg-card/80 backdrop-blur-xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Current VO₂Max</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {progressStats?.currentVO2Max?.toFixed(1) || "--"}
          </div>
          <p className="text-xs text-muted-foreground">
            {progressStats?.improvement ? (
              <span className="text-success">
                +{progressStats.improvement.toFixed(1)} improvement
              </span>
            ) : (
              "ml/kg/min current"
            )}
          </p>
        </CardContent>
      </Card>

      {/* Training Progress */}
      <Card className="spotify-card border-none bg-card/80 backdrop-blur-xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Progress</CardTitle>
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {progressStats?.improvementPercentage?.toFixed(1) || "0"}%
          </div>
          <p className="text-xs text-muted-foreground">
            improvement in {progressStats?.daysSinceStart || 0} days
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
