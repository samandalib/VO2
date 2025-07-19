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
import { Activity, BarChart3, Calendar, Save, Loader2 } from "lucide-react";
import {
  SessionMetricsService,
  SessionMetrics,
} from "@/lib/api/sessionMetrics";

interface SessionMetricsLoggingProps {
  userId: string;
}

export function SessionMetricsLogging({ userId }: SessionMetricsLoggingProps) {
  const [showAllEntries, setShowAllEntries] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [metrics, setMetrics] = useState<SessionMetrics>({
    date: new Date().toISOString().split("T")[0],
  });
  const [savedMetrics, setSavedMetrics] = useState<SessionMetrics[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load metrics from database on component mount
  useEffect(() => {
    const loadMetrics = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const metrics = await SessionMetricsService.getMetrics(userId);
        setSavedMetrics(metrics);
      } catch (error) {
        console.error("Failed to load session metrics:", error);
        setError("Failed to load metrics. Please try again.");

        // Fallback to localStorage as backup
        try {
          const stored = localStorage.getItem(`sessionMetrics_${userId}`);
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

  const handleInputChange = (field: keyof SessionMetrics, value: string) => {
    setMetrics((prev) => ({
      ...prev,
      [field]:
        field === "maxHR" || field === "avgHR"
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
      const newMetric = await SessionMetricsService.createMetric(
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
        `sessionMetrics_${userId}`,
        JSON.stringify(updatedMetrics),
      );
    } catch (error) {
      console.error("Failed to save session metric:", error);
      setError("Failed to save metric. Please try again.");

      // Fallback: save to localStorage only
      try {
        const newMetrics = [
          { ...metrics, id: Date.now().toString() },
          ...savedMetrics,
        ];
        setSavedMetrics(newMetrics);
        localStorage.setItem(
          `sessionMetrics_${userId}`,
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
      (metrics.maxHR && metrics.maxHR > 0) ||
      (metrics.avgHR && metrics.avgHR > 0) ||
      (metrics.sessionType && metrics.sessionType.trim().length > 0) ||
      (metrics.notes && metrics.notes.trim().length > 0)
    );
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-warning" />
            Session Metrics Logging
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
          <Activity className="w-5 h-5 text-warning" />
          Session Metrics Logging
        </CardTitle>
        <CardDescription>
          Log heart rate data after each training session
        </CardDescription>

        {/* Preview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {/* Max HR Preview Card */}
          <div className="bg-gradient-to-br from-destructive/10 to-warning/10 p-6 rounded-2xl border border-destructive/20 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-4 mb-3">
              <div className="p-2 rounded-full bg-destructive/20">
                <BarChart3 className="w-6 h-6 text-destructive" />
              </div>
              <div>
                <h4 className="text-base font-semibold text-foreground">
                  Maximum Heart Rate
                </h4>
                <p className="text-sm text-muted-foreground">
                  Peak session intensity
                </p>
              </div>
            </div>
            <div className="text-sm text-muted-foreground space-y-2 mt-4">
              <p className="flex items-center gap-2">
                <span className="w-1 h-1 bg-destructive rounded-full"></span>
                Record highest HR reached during session
              </p>
              <p className="flex items-center gap-2">
                <span className="w-1 h-1 bg-destructive rounded-full"></span>
                Shows training intensity peaks
              </p>
            </div>
          </div>

          {/* Avg HR Preview Card */}
          <div className="bg-gradient-to-br from-warning/10 to-yellow-500/10 dark:from-orange-500/20 dark:to-yellow-500/20 p-6 rounded-2xl border border-orange-500/20 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-4 mb-3">
              <div className="p-2 rounded-full bg-warning/20">
                <Activity className="w-6 h-6 text-warning" />
              </div>
              <div>
                <h4 className="text-base font-semibold text-foreground">
                  Average Heart Rate
                </h4>
                <p className="text-sm text-muted-foreground">
                  Overall session effort
                </p>
              </div>
            </div>
            <div className="text-sm text-muted-foreground space-y-2 mt-4">
              <p className="flex items-center gap-2">
                <span className="w-1 h-1 bg-warning rounded-full"></span>
                Overall average HR for entire session
              </p>
              <p className="flex items-center gap-2">
                <span className="w-1 h-1 bg-warning rounded-full"></span>
                Tracks sustained training intensity
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
              Log New Session Metrics
            </h4>

            {/* Date */}
            <div>
              <Label htmlFor="sessionDate">Session Date</Label>
              <Input
                id="sessionDate"
                type="date"
                value={metrics.date}
                onChange={(e) => handleInputChange("date", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Max HR */}
              <div>
                <Label htmlFor="maxHR">
                  Max Heart Rate (bpm)
                  <span className="text-xs text-muted-foreground ml-2">
                    Peak during session
                  </span>
                </Label>
                <Input
                  id="maxHR"
                  type="number"
                  placeholder="e.g., 185"
                  value={metrics.maxHR || ""}
                  onChange={(e) => handleInputChange("maxHR", e.target.value)}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Highest heart rate reached
                </p>
              </div>

              {/* Average HR */}
              <div>
                <Label htmlFor="avgHR">
                  Average Heart Rate (bpm)
                  <span className="text-xs text-muted-foreground ml-2">
                    Session average
                  </span>
                </Label>
                <Input
                  id="avgHR"
                  type="number"
                  placeholder="e.g., 150"
                  value={metrics.avgHR || ""}
                  onChange={(e) => handleInputChange("avgHR", e.target.value)}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Overall session intensity
                </p>
              </div>
            </div>

            {/* Session Type */}
            <div>
              <Label htmlFor="sessionType">Session Type</Label>
              <Input
                id="sessionType"
                placeholder="e.g., Tabata, Zone 2, Norwegian 4x4"
                value={metrics.sessionType || ""}
                onChange={(e) =>
                  handleInputChange("sessionType", e.target.value)
                }
              />
            </div>

            {/* Notes */}
            <div>
              <Label htmlFor="sessionNotes">Notes</Label>
              <Input
                id="sessionNotes"
                placeholder="How did the session feel? Any observations..."
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
                Recent Sessions
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
                          {entry.date && !isNaN(new Date(entry.date)) ? new Date(entry.date).toLocaleDateString() : "No Date"}
                        </span>
                        {entry.sessionType && (
                          <p className="text-xs text-muted-foreground">
                            {entry.sessionType}
                          </p>
                        )}
                        {entry.notes && (
                          <p className="text-xs text-muted-foreground truncate max-w-32">
                            {entry.notes}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-xs">
                      {entry.maxHR && (
                        <span className="flex items-center gap-1">
                          <BarChart3 className="w-3 h-3 text-destructive" />
                          Max: {entry.maxHR}
                        </span>
                      )}
                      {entry.avgHR && (
                        <span className="flex items-center gap-1">
                          <Activity className="w-3 h-3 text-warning" />
                          Avg: {entry.avgHR}
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
          <div className="flex flex-col justify-center items-end py-6">
            <Button
              onClick={() => setShowForm(true)}
              className="spotify-button shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Activity className="w-4 h-4 mr-2" />
              Log Session Metrics
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
