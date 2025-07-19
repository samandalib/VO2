-- Migration: Add password column to user_profiles table
-- Run this in Supabase SQL Editor

-- Add password column to user_profiles table
ALTER TABLE public.user_profiles 
ADD COLUMN password_hash TEXT;

-- Add a comment to document the column
COMMENT ON COLUMN public.user_profiles.password_hash IS 'Hashed password for local authentication (V2)';

-- Create an index on password_hash for performance (optional)
CREATE INDEX IF NOT EXISTS idx_user_profiles_password_hash ON public.user_profiles(password_hash);

-- Update the updated_at trigger to include password_hash changes
-- (This assumes you have a trigger for updated_at - if not, you can ignore this)
-- If you need to create the trigger, uncomment the following:

/*
-- Create or replace the function to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create the trigger if it doesn't exist
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON public.user_profiles;
CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
*/

-- Verify the column was added
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'user_profiles' 
AND table_schema = 'public'
ORDER BY ordinal_position; 