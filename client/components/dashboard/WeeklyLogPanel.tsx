import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Heart, Activity, Calendar, Plus, Save } from "lucide-react";

interface WeeklyMetrics {
  date: string;
  restingHeartRate?: number;
  vo2max?: number;
  notes?: string;
}

interface WeeklyLogPanelProps {
  userId: string;
}

export function WeeklyLogPanel({ userId }: WeeklyLogPanelProps) {
  const [isLogging, setIsLogging] = useState(false);
  const [metrics, setMetrics] = useState<WeeklyMetrics>({
    date: new Date().toISOString().split("T")[0],
  });

  // Load existing metrics from localStorage
  const [savedMetrics, setSavedMetrics] = useState<WeeklyMetrics[]>(() => {
    try {
      const stored = localStorage.getItem(`weeklyLog_${userId}`);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const handleInputChange = (field: keyof WeeklyMetrics, value: string) => {
    setMetrics((prev) => ({
      ...prev,
      [field]:
        field === "restingHeartRate" || field === "vo2max"
          ? value
            ? parseFloat(value)
            : undefined
          : value,
    }));
  };

  const handleSaveMetrics = () => {
    const newMetrics = [
      ...savedMetrics,
      { ...metrics, id: Date.now().toString() },
    ];
    setSavedMetrics(newMetrics);
    localStorage.setItem(`weeklyLog_${userId}`, JSON.stringify(newMetrics));

    // Reset form
    setMetrics({ date: new Date().toISOString().split("T")[0] });
    setIsLogging(false);
  };

  const getRecentMetrics = () => {
    return savedMetrics
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-500" />
          Weekly Log
        </CardTitle>
        <CardDescription>
          Log weekly physiological measurements for long-term tracking
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {!isLogging ? (
          <div className="space-y-4">
            <Button
              onClick={() => setIsLogging(true)}
              className="w-full flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Log Weekly Metrics
            </Button>

            {/* Recent Metrics Display */}
            {savedMetrics.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-muted-foreground">
                  Recent Entries
                </h4>
                <div className="space-y-2">
                  {getRecentMetrics().map((entry, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-muted/50 rounded-lg text-sm"
                    >
                      <div className="flex items-center gap-3">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">
                          {new Date(entry.date).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-xs">
                        {entry.restingHeartRate && (
                          <span className="flex items-center gap-1">
                            <Heart className="w-3 h-3" />
                            RHR: {entry.restingHeartRate}
                          </span>
                        )}
                        {entry.vo2max && (
                          <span className="flex items-center gap-1">
                            <Activity className="w-3 h-3" />
                            VO₂: {entry.vo2max}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Date */}
              <div className="md:col-span-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={metrics.date}
                  onChange={(e) => handleInputChange("date", e.target.value)}
                />
              </div>

              {/* VO2Max */}
              <div>
                <Label htmlFor="vo2max">
                  VO₂max (ml/kg/min)
                  <span className="text-xs text-muted-foreground ml-2">
                    Weekly assessment
                  </span>
                </Label>
                <Input
                  id="vo2max"
                  type="number"
                  step="0.1"
                  placeholder="e.g., 45.5"
                  value={metrics.vo2max || ""}
                  onChange={(e) => handleInputChange("vo2max", e.target.value)}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Tracks aerobic capacity improvements
                </p>
              </div>

              {/* Resting Heart Rate */}
              <div>
                <Label htmlFor="rhr">
                  Resting Heart Rate (bpm)
                  <span className="text-xs text-muted-foreground ml-2">
                    Monday morning
                  </span>
                </Label>
                <Input
                  id="rhr"
                  type="number"
                  placeholder="e.g., 60"
                  value={metrics.restingHeartRate || ""}
                  onChange={(e) =>
                    handleInputChange("restingHeartRate", e.target.value)
                  }
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Baseline cardiovascular fitness
                </p>
              </div>
            </div>

            {/* Notes */}
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Input
                id="notes"
                placeholder="Any observations about weekly measurements"
                value={metrics.notes || ""}
                onChange={(e) => handleInputChange("notes", e.target.value)}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button
                onClick={handleSaveMetrics}
                className="flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save Weekly Log
              </Button>
              <Button variant="outline" onClick={() => setIsLogging(false)}>
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Info Box */}
        <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
          <h4 className="text-sm font-medium text-primary mb-2">
            📊 Weekly Tracking Guidelines
          </h4>
          <ul className="text-xs text-blue-800 space-y-1">
            <li>
              • <strong>RHR:</strong> Measure Monday morning before getting out
              of bed
            </li>
            <li>
              • <strong>VO₂max:</strong> Log weekly assessments or mid/post
              protocol tests
            </li>
            <li>• Log consistently each week for trend analysis</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
