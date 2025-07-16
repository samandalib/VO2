import { createClient } from "@supabase/supabase-js";

// These will come from your Supabase project settings
const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL || "https://your-project.supabase.co";
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY || "your-anon-key";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

// Database types (matching actual schema)
export interface UserProfile {
  id: string;
  email: string | null;
  name: string | null;
  picture: string | null;
  created_at: string;
  updated_at: string;
}

export interface WeeklyMetrics {
  id: string;
  userId: string; // camelCase to match schema
  date: string;
  restingHeartRate: number | null; // camelCase to match schema
  vo2max: number | null;
  notes: string | null;
  createdAt: string; // camelCase to match schema
  updatedAt: string; // camelCase to match schema
}

export interface SessionMetrics {
  id: string;
  userId: string; // camelCase to match schema
  date: string;
  maxHR: number | null; // camelCase to match schema
  avgHR: number | null; // camelCase to match schema
  sessionType: string | null; // camelCase to match schema
  notes: string | null;
  createdAt: string; // camelCase to match schema
  updatedAt: string; // camelCase to match schema
}

export interface Biomarker {
  id: string;
  userId: string; // camelCase to match schema
  date: string;
  hemoglobin: number | null;
  ferritin: number | null;
  crp: number | null;
  glucose: number | null;
  createdAt: string; // camelCase to match schema
  updatedAt: string; // camelCase to match schema
}

export interface Protocol {
  id: string;
  name: string;
  vo2maxGain: string; // camelCase to match schema
  timeToResults: string; // camelCase to match schema
  protocolDuration: string; // camelCase to match schema
  fitnessLevel: string; // camelCase to match schema
  sportModality: string; // camelCase to match schema
  researchPopulation: string; // camelCase to match schema
  researchers: string;
  institution: string;
  location: string;
  year: string;
  doi: string;
  description: string | null;
  howToPerform: string | null; // camelCase to match schema
  intensityControl: string | null; // camelCase to match schema
  createdAt: string; // camelCase to match schema
  updatedAt: string; // camelCase to match schema
}

export interface UserProtocol {
  id: string;
  userId: string; // camelCase to match schema
  protocolId: string; // camelCase to match schema
  startDate: string; // camelCase to match schema
  endDate: string | null; // camelCase to match schema
  isActive: boolean; // camelCase to match schema
  createdAt: string; // camelCase to match schema
  updatedAt: string; // camelCase to match schema
  protocol?: Protocol;
}
