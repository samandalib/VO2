import React, { useState, useEffect } from "react";
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
import { Heart, Activity, Calendar, Save, Loader2 } from "lucide-react";
import { WeeklyMetricsService, WeeklyMetrics } from "@/lib/api/weeklyMetrics";

interface WeeklyTrackingPanelProps {
  userId: string;
}

export function WeeklyTrackingPanel({ userId }: WeeklyTrackingPanelProps) {
  const [showAllEntries, setShowAllEntries] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [metrics, setMetrics] = useState<WeeklyMetrics>({
    date: new Date().toISOString().split("T")[0],
  });
  const [savedMetrics, setSavedMetrics] = useState<WeeklyMetrics[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load metrics from database on component mount
  useEffect(() => {
    const loadMetrics = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const metrics = await WeeklyMetricsService.getMetrics(userId);
        setSavedMetrics(metrics);
      } catch (error) {
        console.error("Failed to load weekly metrics:", error);
        setError("Failed to load metrics. Please try again.");

        // Fallback to localStorage as backup
        try {
          const stored = localStorage.getItem(`weeklyMetrics_${userId}`);
          const existing = stored ? JSON.parse(stored) : [];
          if (existing.length > 0) {
            setSavedMetrics(existing);
            setError("Using offline data. Database connection failed.");
          }
        } catch {
          // If even localStorage fails, use empty array
          setSavedMetrics([]);
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      loadMetrics();
    }
  }, [userId]);

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

  const handleSaveMetrics = async () => {
    try {
      setIsSaving(true);
      setError(null);

      // Save to database
      const newMetric = await WeeklyMetricsService.createMetric(
        userId,
        metrics,
      );

      // Update local state with the new metric (already sorted by API)
      setSavedMetrics((prev) => [newMetric, ...prev]);

      // Reset form and hide it
      setMetrics({ date: new Date().toISOString().split("T")[0] });
      setShowForm(false);

      // Also save to localStorage as backup
      const updatedMetrics = [newMetric, ...savedMetrics];
      localStorage.setItem(
        `weeklyMetrics_${userId}`,
        JSON.stringify(updatedMetrics),
      );
    } catch (error) {
      console.error("Failed to save weekly metric:", error);
      setError("Failed to save metric. Please try again.");

      // Fallback: save to localStorage only
      try {
        const newMetrics = [
          { ...metrics, id: Date.now().toString() },
          ...savedMetrics,
        ];
        setSavedMetrics(newMetrics);
        localStorage.setItem(
          `weeklyMetrics_${userId}`,
          JSON.stringify(newMetrics),
        );
        setMetrics({ date: new Date().toISOString().split("T")[0] });
        setShowForm(false);
        setError("Saved offline. Will sync when connection is restored.");
      } catch {
        setError("Failed to save metric. Please check your connection.");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelForm = () => {
    // Reset form and hide it
    setMetrics({ date: new Date().toISOString().split("T")[0] });
    setShowForm(false);
    setError(null);
  };

  const getRecentMetrics = (limit?: number) => {
    // Data is already sorted by date DESC from the API
    return limit ? savedMetrics.slice(0, limit) : [...savedMetrics];
  };

  // Check if any input fields have values (excluding date since it always has a default)
  const hasInputData = () => {
    return (
      (metrics.restingHeartRate && metrics.restingHeartRate > 0) ||
      (metrics.vo2max && metrics.vo2max > 0) ||
      (metrics.notes && metrics.notes.trim().length > 0)
    );
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-500" />
            Weekly Metrics Logging
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <div className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Loading metrics...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="spotify-card border-none bg-card/80 backdrop-blur-xl h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="w-5 h-5 text-red-500" />
          Weekly Metrics Logging
        </CardTitle>
        <CardDescription>
          Log your weekly VO₂max and resting heart rate measurements
        </CardDescription>

        {/* Preview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {/* RHR Preview Card */}
          <div className="bg-gradient-to-br from-spotify-green/10 to-emerald-400/10 dark:from-spotify-green/20 dark:to-emerald-400/20 p-6 rounded-2xl border border-spotify-green/20 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-4 mb-3">
              <div className="p-2 rounded-full bg-spotify-green/20">
                <Heart className="w-6 h-6 text-spotify-green" />
              </div>
              <div>
                <h4 className="text-base font-semibold text-foreground">
                  Resting Heart Rate
                </h4>
                <p className="text-sm text-muted-foreground">
                  Monday morning baseline
                </p>
              </div>
            </div>
            <div className="text-sm text-muted-foreground space-y-2 mt-4">
              <p className="flex items-center gap-2">
                <span className="w-1 h-1 bg-spotify-green rounded-full"></span>
                Measure before getting out of bed
              </p>
              <p className="flex items-center gap-2">
                <span className="w-1 h-1 bg-spotify-green rounded-full"></span>
                Shows cardiovascular fitness trends
              </p>
            </div>
          </div>

          {/* VO2max Preview Card */}
          <div className="bg-gradient-to-br from-emerald-400/10 to-spotify-green/10 dark:from-emerald-400/20 dark:to-spotify-green/20 p-6 rounded-2xl border border-emerald-400/20 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-4 mb-3">
              <div className="p-2 rounded-full bg-emerald-400/20">
                <Activity className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h4 className="text-base font-semibold text-foreground">
                  VO₂max Assessment
                </h4>
                <p className="text-sm text-muted-foreground">
                  Weekly capacity test
                </p>
              </div>
            </div>
            <div className="text-sm text-muted-foreground space-y-2 mt-4">
              <p className="flex items-center gap-2">
                <span className="w-1 h-1 bg-emerald-400 rounded-full"></span>
                Log weekly assessments or protocol tests
              </p>
              <p className="flex items-center gap-2">
                <span className="w-1 h-1 bg-emerald-400 rounded-full"></span>
                Tracks aerobic capacity improvements
              </p>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Form */}
        {showForm && (
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-muted-foreground mb-4">
              Log New Weekly Metrics
            </h4>

            {/* Date */}
            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={metrics.date}
                onChange={(e) => handleInputChange("date", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Resting Heart Rate */}
              <div>
                <Label htmlFor="rhr">
                  Resting Heart Rate (bpm)
                  <span className="text-xs text-muted-foreground ml-2">
                    Weekly (Monday morning)
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
                variant="outline"
                onClick={handleCancelForm}
                disabled={isSaving}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveMetrics}
                className="flex-1 ml-px"
                disabled={isSaving || !hasInputData()}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  "Save"
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Recent Metrics Display */}
        {savedMetrics.length > 0 && (
          <div className="space-y-3 border-t pt-6">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-muted-foreground">
                Recent Entries
              </h4>
              {savedMetrics.length > 2 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAllEntries(!showAllEntries)}
                  className="text-xs"
                >
                  {showAllEntries
                    ? "Show Less"
                    : `Show All (${savedMetrics.length})`}
                </Button>
              )}
            </div>
            <div className="space-y-2">
              {getRecentMetrics(showAllEntries ? undefined : 2).map(
                (entry, index) => (
                  <div
                    key={entry.id || index}
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg text-sm"
                  >
                    <div className="flex items-center gap-3">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <span className="font-medium">
                          {new Date(
                            entry.date + "T00:00:00",
                          ).toLocaleDateString()}
                        </span>
                        {entry.notes && (
                          <p className="text-xs text-muted-foreground truncate max-w-32">
                            {entry.notes}
                          </p>
                        )}
                      </div>
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
                ),
              )}
            </div>
          </div>
        )}

        {/* Log Button */}
        {!showForm && (
          <div className="flex flex-col justify-start items-end pt-6 pr-6">
            <Button
              onClick={() => setShowForm(true)}
              className="spotify-button shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Save className="w-4 h-4 mr-2" />
              Log Weekly Metrics
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
