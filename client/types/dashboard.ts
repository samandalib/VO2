// Dashboard-related types

export interface User {
  name: string;
  email: string;
  picture?: string;
}

export interface ProtocolData {
  name: string;
  vo2maxGain: string;
  timeToResults: string;
  protocolDuration: string;
}

export interface ProgressStats {
  baselineVO2Max?: number;
  currentVO2Max?: number;
  improvement?: number;
  improvementPercentage?: number;
  daysSinceStart?: number;
}

export interface UserProgress {
  measurements?: Array<{
    date: string;
    vo2max: number;
    notes?: string;
  }>;
}

export interface WeeklyMetrics {
  date: string;
  restingHeartRate?: number;
  vo2max?: number;
  notes?: string;
}

export interface SessionMetrics {
  date: string;
  maxHR?: number;
  avgHR?: number;
  notes?: string;
}

export interface BloodBiomarker {
  date: string;
  phase: "pre" | "mid" | "post";
  hemoglobin?: number;
  ferritin?: number;
  crp?: number;
  glucose?: number;
  hba1c?: number;
  notes?: string;
}
