-- Set admin status for your account
-- Run this in Supabase SQL Editor

-- Update your user profile to have admin privileges
UPDATE public.user_profiles 
SET is_admin = TRUE 
WHERE email = 'hesam.andalib@gmail.com';

-- Verify the change
SELECT id, email, name, is_admin, created_at 
FROM public.user_profiles 
WHERE email = 'hesam.andalib@gmail.com';

-- If no rows returned, it means your user profile doesn't exist yet
-- In that case, you'll need to sign in first to create the profile 