-- Add is_admin column to user_profiles table
-- Run this in Supabase SQL Editor

-- Add the is_admin column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'user_profiles' 
        AND column_name = 'is_admin'
    ) THEN
        ALTER TABLE public.user_profiles ADD COLUMN is_admin BOOLEAN DEFAULT FALSE;
        RAISE NOTICE 'Added is_admin column to user_profiles table';
    ELSE
        RAISE NOTICE 'is_admin column already exists in user_profiles table';
    END IF;
END $$;

-- Set your email as admin (replace with your actual email)
UPDATE public.user_profiles 
SET is_admin = TRUE 
WHERE email = 'hesam.andalib@gmail.com';

-- Verify the change
SELECT id, email, name, is_admin FROM public.user_profiles WHERE email = 'hesam.andalib@gmail.com'; 