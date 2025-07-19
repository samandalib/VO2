-- Migration: Remove password_hash column from user_profiles table
-- Run this in Supabase SQL Editor
-- This removes the custom password column since we're using Supabase's built-in auth

-- Remove the password_hash column from user_profiles table
ALTER TABLE public.user_profiles 
DROP COLUMN IF EXISTS password_hash;

-- Remove the index if it exists
DROP INDEX IF EXISTS idx_user_profiles_password_hash;

-- Verify the column was removed
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'user_profiles' 
AND table_schema = 'public'
ORDER BY ordinal_position; 