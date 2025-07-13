import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFormField } from "@/contexts/FormContext";

const AGE_GROUPS = ["Under 30", "30–49", "50–64", "Over 65"] as const;

const SEX_OPTIONS = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
] as const;

export function DemographicsTab() {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-semibold mb-4">Demographics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AgeGroupField />
          <SexField />
          <HeightField />
          <WeightField />
        </div>
      </div>
    </div>
  );
}

function AgeGroupField() {
  const { value, onChange, error } = useFormField("ageGroup");

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">
        Age Group <span className="text-red-500">(Required)</span>
      </Label>
      <div className="grid grid-cols-2 gap-3">
        {AGE_GROUPS.map((group) => (
          <button
            key={group}
            type="button"
            onClick={() => onChange(group)}
            className={`p-3 rounded-lg border text-left transition-all duration-200 ${
              value === group
                ? "border-primary bg-primary/10 text-primary"
                : "border-border hover:border-primary/50"
            }`}
          >
            <span className="font-medium">{group}</span>
          </button>
        ))}
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}

function SexField() {
  const { value, onChange } = useFormField("sex");

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">Sex</Label>
      <div className="grid grid-cols-2 gap-3">
        {SEX_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`p-3 rounded-lg border text-left transition-all duration-200 ${
              value === option.value
                ? "border-primary bg-primary/10 text-primary"
                : "border-border hover:border-primary/50"
            }`}
          >
            <span className="font-medium">{option.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function HeightField() {
  const { value, onChange } = useFormField("height");

  return (
    <div className="space-y-2">
      <Label htmlFor="height" className="text-sm font-medium">
        Height (cm)
      </Label>
      <Input
        id="height"
        type="number"
        placeholder="e.g., 175"
        value={value || ""}
        onChange={(e) => onChange(Number(e.target.value) || undefined)}
        className="w-full"
      />
    </div>
  );
}

function WeightField() {
  const { value, onChange } = useFormField("weight");

  return (
    <div className="space-y-2">
      <Label htmlFor="weight" className="text-sm font-medium">
        Weight (kg)
      </Label>
      <Input
        id="weight"
        type="number"
        placeholder="e.g., 70"
        value={value || ""}
        onChange={(e) => onChange(Number(e.target.value) || undefined)}
        className="w-full"
      />
    </div>
  );
}
