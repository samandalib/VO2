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

// Database types (based on our schema)
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
  user_id: string;
  date: string;
  resting_heart_rate: number | null;
  vo2max: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface SessionMetrics {
  id: string;
  user_id: string;
  date: string;
  max_hr: number | null;
  avg_hr: number | null;
  session_type: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Biomarker {
  id: string;
  user_id: string;
  date: string;
  hemoglobin: number | null;
  ferritin: number | null;
  crp: number | null;
  glucose: number | null;
  created_at: string;
  updated_at: string;
}

export interface Protocol {
  id: string;
  name: string;
  vo2max_gain: string;
  time_to_results: string;
  protocol_duration: string;
  fitness_level: string;
  sport_modality: string;
  research_population: string;
  researchers: string;
  institution: string;
  location: string;
  year: string;
  doi: string;
  description: string | null;
  how_to_perform: string | null;
  intensity_control: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserProtocol {
  id: string;
  user_id: string;
  protocol_id: string;
  start_date: string;
  end_date: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  protocol?: Protocol;
}
