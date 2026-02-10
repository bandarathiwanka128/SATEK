-- Admin User Setup Script for SATEK Platform
-- This script ensures the admin user exists with proper permissions
-- Execute this in Supabase SQL Editor

-- Step 1: Update existing user profile to admin role
UPDATE profiles
SET role = 'admin'
WHERE user_id = (
  SELECT id FROM auth.users
  WHERE email = 'bandarathiwanka8@gmail.com'
);

-- Step 2: If profile doesn't exist, create it
INSERT INTO profiles (user_id, role, full_name)
SELECT id, 'admin', 'Admin User'
FROM auth.users
WHERE email = 'bandarathiwanka8@gmail.com'
  AND NOT EXISTS (
    SELECT 1 FROM profiles WHERE user_id = (
      SELECT id FROM auth.users WHERE email = 'bandarathiwanka8@gmail.com'
    )
  );

-- Step 3: Verify the admin user setup
SELECT
  u.email,
  p.role,
  p.full_name,
  p.created_at
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.user_id
WHERE u.email = 'bandarathiwanka8@gmail.com';

-- Expected result: Should show email with role = 'admin'
