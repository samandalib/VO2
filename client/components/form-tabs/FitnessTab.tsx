import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFormField } from "@/contexts/FormContext";

const ACTIVITY_LEVELS = [
  {
    value: "sedentary",
    label: "Sedentary",
    description: "Little to no exercise",
  },
  {
    value: "lightly_active",
    label: "Lightly Active",
    description: "Light exercise 1-3 days/week",
  },
  {
    value: "moderately_active",
    label: "Moderately Active",
    description: "Moderate exercise 3-5 days/week",
  },
  {
    value: "very_active",
    label: "Very Active",
    description: "Hard exercise 6-7 days/week",
  },
  {
    value: "athlete",
    label: "Athlete",
    description: "Professional/competitive athlete",
  },
] as const;

export function FitnessTab() {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-semibold mb-4">Fitness Assessment</h3>
        <div className="space-y-6">
          <VO2MaxKnownField />
          <VO2MaxValueField />
          <ActivityLevelField />
          <RestingHeartRateField />
        </div>
      </div>
    </div>
  );
}

function VO2MaxKnownField() {
  const { value, onChange } = useFormField("vo2maxKnown");

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">
        Do you know your current VO₂max?
      </Label>
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => onChange(true)}
          className={`p-3 rounded-lg border text-left transition-all duration-200 ${
            value === true
              ? "border-primary bg-primary/10 text-primary"
              : "border-border hover:border-primary/50"
          }`}
        >
          <span className="font-medium">Yes</span>
        </button>
        <button
          type="button"
          onClick={() => onChange(false)}
          className={`p-3 rounded-lg border text-left transition-all duration-200 ${
            value === false
              ? "border-primary bg-primary/10 text-primary"
              : "border-border hover:border-primary/50"
          }`}
        >
          <span className="font-medium">No</span>
        </button>
      </div>
    </div>
  );
}

function VO2MaxValueField() {
  const { value, onChange, error } = useFormField("currentVO2Max");
  const vo2maxKnown = useFormField("vo2maxKnown").value;

  if (vo2maxKnown === false) {
    return null;
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="vo2max" className="text-sm font-medium">
        Current VO₂max (ml/kg/min){" "}
        <span className="text-red-500">(Required)</span>
      </Label>
      <Input
        id="vo2max"
        type="number"
        placeholder="e.g., 45"
        value={value || ""}
        onChange={(e) => onChange(Number(e.target.value) || undefined)}
        className="w-full"
        min={10}
        max={90}
      />
      <p className="text-xs text-muted-foreground">
        If unsure, estimate: Untrained ~35, Recreational ~45, Trained ~55, Elite
        ~65+
      </p>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}

function ActivityLevelField() {
  const { value, onChange, error } = useFormField("activityLevel");

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">
        Current Activity Level <span className="text-red-500">(Required)</span>
      </Label>
      <div className="space-y-2">
        {ACTIVITY_LEVELS.map((level) => (
          <button
            key={level.value}
            type="button"
            onClick={() => onChange(level.value)}
            className={`w-full p-3 rounded-lg border text-left transition-all duration-200 ${
              value === level.value
                ? "border-primary bg-primary/10 text-primary"
                : "border-border hover:border-primary/50"
            }`}
          >
            <div className="flex flex-col">
              <span className="font-medium">{level.label}</span>
              <span className="text-sm text-muted-foreground">
                {level.description}
              </span>
            </div>
          </button>
        ))}
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}

function RestingHeartRateField() {
  const { value, onChange } = useFormField("restingHeartRate");

  return (
    <div className="space-y-2">
      <Label htmlFor="rhr" className="text-sm font-medium">
        Resting Heart Rate (bpm)
      </Label>
      <Input
        id="rhr"
        type="number"
        placeholder="e.g., 65"
        value={value || ""}
        onChange={(e) => onChange(Number(e.target.value) || undefined)}
        className="w-full"
        min={40}
        max={120}
      />
      <p className="text-xs text-muted-foreground">
        Measure first thing in the morning before getting up
      </p>
    </div>
  );
}
