-- VO2Max Training App - Supabase Database Schema
-- Copy and paste this into Supabase SQL Editor

-- Enable Row Level Security
ALTER DEFAULT PRIVILEGES REVOKE EXECUTE ON FUNCTIONS FROM PUBLIC;

-- Users table (extends Supabase auth.users)
CREATE TABLE public.user_profiles (
  id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  email TEXT,
  name TEXT,
  picture TEXT,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Weekly Metrics
CREATE TABLE public.weekly_metrics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  date DATE NOT NULL,
  resting_heart_rate INTEGER,
  vo2max DECIMAL(5,2),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Session Metrics
CREATE TABLE public.session_metrics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  date DATE NOT NULL,
  max_hr INTEGER,
  avg_hr INTEGER,
  session_type TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Biomarkers
CREATE TABLE public.biomarkers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  date DATE NOT NULL,
  hemoglobin DECIMAL(4,2),
  ferritin DECIMAL(6,2),
  crp DECIMAL(4,2),
  glucose DECIMAL(5,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Training Protocols
CREATE TABLE public.protocols (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  vo2max_gain TEXT NOT NULL,
  time_to_results TEXT NOT NULL,
  protocol_duration TEXT NOT NULL,
  fitness_level TEXT NOT NULL,
  sport_modality TEXT NOT NULL,
  research_population TEXT NOT NULL,
  researchers TEXT NOT NULL,
  institution TEXT NOT NULL,
  location TEXT NOT NULL,
  year TEXT NOT NULL,
  doi TEXT NOT NULL,
  description TEXT,
  how_to_perform TEXT,
  intensity_control TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Protocol Assignments
CREATE TABLE public.user_protocols (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  protocol_id UUID REFERENCES public.protocols NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert some sample protocols
INSERT INTO public.protocols (
  name, vo2max_gain, time_to_results, protocol_duration, 
  fitness_level, sport_modality, research_population,
  researchers, institution, location, year, doi,
  description, how_to_perform, intensity_control
) VALUES 
(
  '4x4 Interval Training',
  '10-15%',
  '8 weeks',
  '8-12 weeks',
  'Intermediate to Advanced',
  'Running/Cycling',
  'Recreational athletes',
  'Helgerud et al.',
  'Norwegian University of Science and Technology',
  'Norway',
  '2007',
  '10.1249/mss.0b013e3180304570',
  'High-intensity interval training protocol proven to significantly improve VO2max',
  '4 intervals of 4 minutes at 90-95% HRmax with 3-minute active recovery',
  'Use heart rate monitor to maintain 90-95% maximum heart rate'
),
(
  'Polarized Training',
  '8-12%',
  '12 weeks',
  '12-16 weeks',
  'All levels',
  'Endurance sports',
  'Endurance athletes',
  'Seiler et al.',
  'University of Agder',
  'Norway',
  '2010',
  '10.1519/JSC.0b013e3181d2d6b3',
  '80% low intensity, 20% high intensity training distribution',
  '80% of training at easy pace, 20% at threshold/VO2max intensity',
  'Use lactate testing or RPE scale to control intensity zones'
);

-- Row Level Security Policies
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weekly_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.biomarkers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_protocols ENABLE ROW LEVEL SECURITY;

-- Users can only see their own data
CREATE POLICY "Users can view own profile" ON public.user_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.user_profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.user_profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view own weekly metrics" ON public.weekly_metrics FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own weekly metrics" ON public.weekly_metrics FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own weekly metrics" ON public.weekly_metrics FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own weekly metrics" ON public.weekly_metrics FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own session metrics" ON public.session_metrics FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own session metrics" ON public.session_metrics FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own session metrics" ON public.session_metrics FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own session metrics" ON public.session_metrics FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own biomarkers" ON public.biomarkers FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own biomarkers" ON public.biomarkers FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own biomarkers" ON public.biomarkers FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own biomarkers" ON public.biomarkers FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own protocols" ON public.user_protocols FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own protocols" ON public.user_protocols FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own protocols" ON public.user_protocols FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own protocols" ON public.user_protocols FOR DELETE USING (auth.uid() = user_id);

-- Everyone can read protocols (public data)
CREATE POLICY "Anyone can view protocols" ON public.protocols FOR SELECT USING (true);

-- Enable realtime (optional but useful for live updates)
ALTER PUBLICATION supabase_realtime ADD TABLE public.weekly_metrics;
ALTER PUBLICATION supabase_realtime ADD TABLE public.session_metrics;
ALTER PUBLICATION supabase_realtime ADD TABLE public.biomarkers;
