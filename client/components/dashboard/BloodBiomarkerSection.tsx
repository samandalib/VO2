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
import { Droplets, Calendar, Info, Loader2, Save } from "lucide-react";
import { BiomarkersService, BiomarkerEntry } from "@/lib/api/biomarkers";

interface BloodBiomarkerSectionProps {
  userId: string;
}

const biomarkerInfo = {
  hemoglobin: {
    name: "Hemoglobin (g/dL)",
    description: "Transports oxygen from your lungs to working muscles.",
    importance:
      "Higher hemoglobin = greater oxygen delivery capacity ��� directly supports VO₂max.",
    impact: "Low hemoglobin can severely limit aerobic training effects.",
    citation:
      '"The relationship between hemoglobin and VO₂max," suggesting that hemoglobin concentration explains ~50% of the variance in VO₂max in untrained subjects (Kazemi et al., 2016).',
  },
  ferritin: {
    name: "Ferritin (ng/mL)",
    description:
      "Iron storage protein; required to maintain hemoglobin levels.",
    importance:
      "Ferritin depletion often precedes low hemoglobin, impairing oxygen transport efficiency.",
    impact:
      "Low ferritin = hidden performance limiter, even when hemoglobin is in range.",
    citation:
      "Kazemi et al. emphasize that iron availability, as measured by ferritin, is key for maintaining hemoglobin and VO₂max adaptations.",
  },
  crp: {
    name: "C-Reactive Protein (CRP) (mg/L)",
    description: "A marker of systemic inflammation.",
    importance:
      "Chronic inflammation hinders recovery and reduces mitochondrial adaptation — both crucial for VO₂max improvement.",
    impact: "Elevated CRP = possible overtraining, reduced VO₂max gains.",
    citation:
      '"The Relationship between Inflammatory Factors, Hemoglobin, and VO₂ Max," showed a significant inverse correlation between CRP and VO₂max in young adults (M. Sadeghi et al., 2020).',
  },
  glucose: {
    name: "Fasting Glucose or HbA1c",
    description:
      "Measures blood sugar control (glucose = immediate; HbA1c = 3-month average).",
    importance:
      "Poor glucose control impairs metabolic flexibility, recovery, and aerobic capacity.",
    impact:
      "Elevated values may blunt endurance training benefits and increase fatigue.",
    citation:
      '"Linking diet, physical activity, cardiorespiratory fitness and obesity to serum metabolite networks," found inverse associations between HbA1c and cardiorespiratory fitness (Rangel-Huerta et al., 2019).',
  },
};

export function BloodBiomarkerSection({ userId }: BloodBiomarkerSectionProps) {
  const [showAllEntries, setShowAllEntries] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [biomarkerData, setBiomarkerData] = useState<BiomarkerEntry>({
    date: new Date().toISOString().split("T")[0],
  });
  const [savedEntries, setSavedEntries] = useState<BiomarkerEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load biomarkers from database on component mount
  useEffect(() => {
    const loadBiomarkers = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const biomarkers = await BiomarkersService.getBiomarkers(userId);
        setSavedEntries(biomarkers);
      } catch (error) {
        console.error("Failed to load biomarkers:", error);
        setError("Failed to load biomarkers. Please try again.");

        // Fallback to localStorage as backup
        try {
          const stored = localStorage.getItem(`biomarkers_${userId}`);
          const existing = stored ? JSON.parse(stored) : [];
          if (existing.length > 0) {
            setSavedEntries(existing);
            setError("Using offline data. Database connection failed.");
          }
        } catch {
          setSavedEntries([]);
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      loadBiomarkers();
    }
  }, [userId]);

  const handleInputChange = (field: keyof BiomarkerEntry, value: string) => {
    setBiomarkerData((prev) => ({
      ...prev,
      [field]: field === "date" ? value : value ? parseFloat(value) : undefined,
    }));
  };

  const handleSaveBiomarkers = async () => {
    try {
      setIsSaving(true);
      setError(null);

      // Save to database
      const newEntry = await BiomarkersService.createBiomarker(
        userId,
        biomarkerData,
      );

      // Update local state
      setSavedEntries((prev) => [newEntry, ...prev]);

      // Reset form and hide it
      setBiomarkerData({ date: new Date().toISOString().split("T")[0] });
      setShowForm(false);

      // Backup to localStorage
      const updatedEntries = [newEntry, ...savedEntries];
      localStorage.setItem(
        `biomarkers_${userId}`,
        JSON.stringify(updatedEntries),
      );
    } catch (error) {
      console.error("Failed to save biomarker:", error);
      setError("Failed to save biomarker. Please try again.");

      // Fallback to localStorage
      try {
        const newEntries = [
          { ...biomarkerData, id: Date.now().toString() },
          ...savedEntries,
        ];
        setSavedEntries(newEntries);
        localStorage.setItem(
          `biomarkers_${userId}`,
          JSON.stringify(newEntries),
        );
        setBiomarkerData({ date: new Date().toISOString().split("T")[0] });
        setShowForm(false);
        setError("Saved offline. Will sync when connection is restored.");
      } catch {
        setError("Failed to save biomarker. Please check your connection.");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelForm = () => {
    // Reset form and hide it
    setBiomarkerData({ date: new Date().toISOString().split("T")[0] });
    setShowForm(false);
    setError(null);
  };

  const getRecentEntries = (limit?: number) => {
    return limit ? savedEntries.slice(0, limit) : [...savedEntries];
  };

  const hasInputData = () => {
    return (
      (biomarkerData.hemoglobin && biomarkerData.hemoglobin > 0) ||
      (biomarkerData.ferritin && biomarkerData.ferritin > 0) ||
      (biomarkerData.crp && biomarkerData.crp > 0) ||
      (biomarkerData.glucose && biomarkerData.glucose > 0)
    );
  };

  const BiomarkerTooltip = ({
    biomarkerKey,
  }: {
    biomarkerKey: keyof typeof biomarkerInfo;
  }) => {
    const [isVisible, setIsVisible] = useState(false);
    const info = biomarkerInfo[biomarkerKey];

    return (
      <div className="relative inline-block">
        <Info
          className="w-4 h-4 text-blue-600 cursor-help ml-2"
          onMouseEnter={() => setIsVisible(true)}
          onMouseLeave={() => setIsVisible(false)}
          onClick={() => setIsVisible(!isVisible)}
        />
        {isVisible && (
          <div className="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-2 p-4 bg-white border border-gray-200 rounded-lg shadow-lg max-w-md">
            <div className="text-sm">
              <h4 className="font-semibold text-gray-900 mb-2">{info.name}</h4>
              <p className="text-gray-700 mb-2">{info.description}</p>
              <p className="text-gray-700 mb-2">
                <strong>Why it matters:</strong> {info.importance}
              </p>
              <p className="text-gray-600 text-xs italic">{info.citation}</p>
            </div>
          </div>
        )}
      </div>
    );
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Droplets className="w-5 h-5 text-red-500" />
            Blood Biomarker Tracking
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <div className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Loading biomarkers...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="spotify-card border-none bg-card/80 backdrop-blur-xl h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Droplets className="w-5 h-5 text-red-500" />
          Blood Biomarker Tracking
        </CardTitle>
        <CardDescription>
          Monitor key biomarkers that directly impact VO₂max and training
          adaptations
        </CardDescription>

        {/* Info Box */}
        <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 dark:from-purple-500/20 dark:to-pink-500/20 p-6 rounded-2xl border border-purple-500/20 shadow-lg mt-8">
          <h4 className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
            <span className="text-2xl">🩸</span>
            Biomarker Guidelines
          </h4>
          <ul className="text-sm text-muted-foreground space-y-3">
            <li className="flex items-center gap-3">
              <span className="w-1 h-1 bg-purple-500 rounded-full"></span>
              Get blood work done quarterly or semi-annually
            </li>
            <li className="flex items-center gap-3">
              <span className="w-1 h-1 bg-purple-500 rounded-full"></span>
              Test in fasted state (8+ hours) for accurate results
            </li>
            <li className="flex items-center gap-3">
              <span className="w-1 h-1 bg-purple-500 rounded-full"></span>
              Track trends over time rather than single values
            </li>
          </ul>
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
              Log New Biomarker Results
            </h4>

            {/* Date */}
            <div>
              <Label htmlFor="biomarkerDate">Test Date</Label>
              <Input
                id="biomarkerDate"
                type="date"
                value={biomarkerData.date}
                onChange={(e) => handleInputChange("date", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Hemoglobin */}
              <div>
                <Label
                  htmlFor="hemoglobin"
                  className="flex items-center justify-start"
                >
                  Hemoglobin (g/dL)
                  <BiomarkerTooltip biomarkerKey="hemoglobin" />
                </Label>
                <Input
                  id="hemoglobin"
                  type="number"
                  step="0.1"
                  placeholder="e.g., 14.5"
                  value={biomarkerData.hemoglobin || ""}
                  onChange={(e) =>
                    handleInputChange("hemoglobin", e.target.value)
                  }
                />
              </div>

              {/* Ferritin */}
              <div>
                <Label
                  htmlFor="ferritin"
                  className="flex items-center justify-start"
                >
                  Ferritin (ng/mL)
                  <BiomarkerTooltip biomarkerKey="ferritin" />
                </Label>
                <Input
                  id="ferritin"
                  type="number"
                  step="0.1"
                  placeholder="e.g., 50.0"
                  value={biomarkerData.ferritin || ""}
                  onChange={(e) =>
                    handleInputChange("ferritin", e.target.value)
                  }
                />
              </div>

              {/* CRP */}
              <div>
                <Label
                  htmlFor="crp"
                  className="flex items-center justify-start"
                >
                  CRP (mg/L)
                  <BiomarkerTooltip biomarkerKey="crp" />
                </Label>
                <Input
                  id="crp"
                  type="number"
                  step="0.1"
                  placeholder="e.g., 1.2"
                  value={biomarkerData.crp || ""}
                  onChange={(e) => handleInputChange("crp", e.target.value)}
                />
              </div>

              {/* Glucose */}
              <div>
                <Label
                  htmlFor="glucose"
                  className="flex items-center justify-start"
                >
                  Fasting Glucose (mg/dL)
                  <BiomarkerTooltip biomarkerKey="glucose" />
                </Label>
                <Input
                  id="glucose"
                  type="number"
                  step="0.1"
                  placeholder="e.g., 90.0"
                  value={biomarkerData.glucose || ""}
                  onChange={(e) => handleInputChange("glucose", e.target.value)}
                />
              </div>
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
                onClick={handleSaveBiomarkers}
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

        {/* Recent Entries Display */}
        {savedEntries.length > 0 && (
          <div className="space-y-3 border-t pt-6">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-muted-foreground">
                Recent Entries
              </h4>
              {savedEntries.length > 2 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAllEntries(!showAllEntries)}
                  className="text-xs"
                >
                  {showAllEntries
                    ? "Show Less"
                    : `Show All (${savedEntries.length})`}
                </Button>
              )}
            </div>
            <div className="space-y-2">
              {getRecentEntries(showAllEntries ? undefined : 2).map(
                (entry, index) => (
                  <div
                    key={entry.id || index}
                    className="p-3 bg-muted/50 rounded-lg text-sm"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">
                        {(() => {
                          const d = new Date(entry.date);
                          return !isNaN(d.getTime()) ? d.toLocaleDateString() : "Invalid date";
                        })()}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 text-xs">
                      {entry.hemoglobin && (
                        <span>Hemoglobin: {entry.hemoglobin} g/dL</span>
                      )}
                      {entry.ferritin && (
                        <span>Ferritin: {entry.ferritin} ng/mL</span>
                      )}
                      {entry.crp && <span>CRP: {entry.crp} mg/L</span>}
                      {entry.glucose && <span>Glucose: {entry.glucose}</span>}
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
              <Droplets className="w-4 h-4 mr-2" />
              Log Biomarkers
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
