-- Debug Admin User Issue
-- Run these queries in Supabase SQL Editor to check your admin setup

-- Step 1: Check if user exists in auth.users
SELECT
  id,
  email,
  created_at
FROM auth.users
WHERE email = 'bandarathiwanka8@gmail.com';

-- Step 2: Check if profile exists and what the role is
SELECT
  user_id,
  role,
  full_name,
  created_at
FROM profiles
WHERE user_id = (
  SELECT id FROM auth.users WHERE email = 'bandarathiwanka8@gmail.com'
);

-- Step 3: If profile exists but role is not 'admin', fix it
UPDATE profiles
SET role = 'admin'
WHERE user_id = (
  SELECT id FROM auth.users WHERE email = 'bandarathiwanka8@gmail.com'
);

-- Step 4: If profile doesn't exist at all, create it
INSERT INTO profiles (user_id, role, full_name)
SELECT
  id,
  'admin',
  'Admin User'
FROM auth.users
WHERE email = 'bandarathiwanka8@gmail.com'
  AND NOT EXISTS (
    SELECT 1 FROM profiles
    WHERE user_id = (SELECT id FROM auth.users WHERE email = 'bandarathiwanka8@gmail.com')
  );

-- Step 5: Verify the fix - should show role = 'admin'
SELECT
  u.email,
  p.role,
  p.full_name
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.user_id
WHERE u.email = 'bandarathiwanka8@gmail.com';
