export interface ProtocolData {
  id: string;
  name: string;
  vo2maxGain: string;
  timeToResults: string;
  fitnessLevel: string;
  protocolDuration: string;
  sportModality: string;
  researchPopulation: string;
  researchers: string;
  institution: string;
  location: string;
  year: string;
  doi: string;
  category: "interval" | "threshold" | "endurance";
  difficulty: "beginner" | "intermediate" | "advanced";
  timeCommitment: "low" | "medium" | "high";
  equipmentRequired: string[];
}

export interface ProtocolRanking {
  id: string;
  score: number;
  reasons: string[];
  confidence: number;
}

export interface FormData {
  // Demographics
  ageGroup?: string;
  sex?: string;
  height?: number;
  weight?: number;

  // Fitness
  currentVO2Max?: number;
  vo2maxKnown?: boolean;
  activityLevel?: string;
  restingHeartRate?: number;

  // Health
  healthConditions?: string[];
  medications?: string[];

  // Goals & Preferences
  primaryGoal?: string;
  timeAvailability?: string;
  equipmentAccess?: string[];
}

export interface ConfidenceLevel {
  level: "Low" | "Medium" | "High";
  percentage: number;
  message?: string;
}
