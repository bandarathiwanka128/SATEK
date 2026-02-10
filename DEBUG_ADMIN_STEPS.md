# Debug Admin Panel Issue - Step by Step

## Step 1: Verify Database (DO THIS FIRST)

Open Supabase Dashboard → SQL Editor and run this:

```sql
-- Complete verification query
SELECT
  'User exists' as check_type,
  u.id,
  u.email,
  u.created_at
FROM auth.users u
WHERE u.email = 'bandarathiwanka8@gmail.com'

UNION ALL

SELECT
  'Profile exists' as check_type,
  p.user_id as id,
  p.role as email,
  p.created_at
FROM profiles p
WHERE p.user_id = (SELECT id FROM auth.users WHERE email = 'bandarathiwanka8@gmail.com')

UNION ALL

SELECT
  'Join check' as check_type,
  u.id,
  p.role as email,
  u.created_at
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.user_id
WHERE u.email = 'bandarathiwanka8@gmail.com';
```

**What you should see:**
- First row: User exists (shows user ID and email)
- Second row: Profile exists (shows user_id and role = 'admin')
- Third row: Join works (shows both user and role = 'admin')

**If role is NOT 'admin', run this:**

```sql
-- Force update to admin
UPDATE profiles
SET role = 'admin'
WHERE user_id IN (
  SELECT id FROM auth.users WHERE email = 'bandarathiwanka8@gmail.com'
);

-- If no rows updated, profile doesn't exist, create it:
INSERT INTO profiles (user_id, role, full_name)
SELECT id, 'admin', 'Admin User'
FROM auth.users
WHERE email = 'bandarathiwanka8@gmail.com'
ON CONFLICT (user_id) DO UPDATE SET role = 'admin';
```

## Step 2: Check RLS Policies

Run this to see if RLS is blocking you:

```sql
-- Check RLS status
SELECT
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables
WHERE tablename = 'profiles';

-- Try to query as the authenticated user
SELECT * FROM profiles
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'bandarathiwanka8@gmail.com');
```

**If the second query returns nothing**, RLS is blocking. Temporarily disable it:

```sql
-- TEMPORARY: Disable RLS for testing
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
```

## Step 3: Test in Browser

1. **Stop your dev server** (Ctrl+C in terminal)
2. **Start it again:**
   ```bash
   npm run dev
   ```

3. **Open browser in incognito/private mode** (this ensures no cache)

4. **Open Developer Console** (F12 or Right-click → Inspect)

5. **Go to your app**: http://localhost:3001

6. **Log in** with:
   - Email: `bandarathiwanka8@gmail.com`
   - Password: `1aA#22##`

7. **Watch the console output**

## Step 4: Look for These Debug Messages

In the browser console, you should see messages like:

```
🔍 [useAuth] User from auth: bandarathiwanka8@gmail.com
🔍 [useAuth] Profile data: {user_id: "...", role: "admin", ...}
🔍 [useAuth] Profile error: null
🔍 [useAuth] Profile role: admin
🔍 [useAuth] isAdmin check: {profile: {...}, role: "admin", isAdmin: true}
```

## Step 5: Report What You See

**Scenario A: Profile data is null**
```
🔍 [useAuth] Profile data: null
🔍 [useAuth] Profile error: {...}
```
→ This means the profile query is failing. Check RLS policies.

**Scenario B: Profile role is "user" not "admin"**
```
🔍 [useAuth] Profile role: user
🔍 [useAuth] isAdmin check: {role: "user", isAdmin: false}
```
→ Go back to Step 1 and run the UPDATE query again.

**Scenario C: Profile is null/undefined**
```
🔍 [useAuth] Profile data: null
🔍 [useAuth] Profile error: null
```
→ Profile doesn't exist. Run the INSERT query from Step 1.

**Scenario D: Everything looks correct**
```
🔍 [useAuth] Profile role: admin
🔍 [useAuth] isAdmin check: {role: "admin", isAdmin: true}
```
→ But still no admin panel? Check the navbar component.

## Step 6: If Still Not Working

### Check the profiles table structure:

```sql
-- Make sure the table has the right columns
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'profiles'
ORDER BY ordinal_position;
```

You should see:
- `id` (uuid)
- `user_id` (uuid)
- `role` (text or USER-DEFINED for enum)
- `full_name` (text)
- `avatar_url` (text)
- `created_at` (timestamp with time zone)

### Check if there are multiple profiles:

```sql
-- Check for duplicate profiles
SELECT COUNT(*) as profile_count
FROM profiles
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'bandarathiwanka8@gmail.com');
```

Should return `profile_count: 1`. If more than 1, delete duplicates:

```sql
-- Delete duplicate profiles (keep the admin one)
DELETE FROM profiles
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'bandarathiwanka8@gmail.com')
  AND role != 'admin';
```

## Step 7: Nuclear Option - Recreate Profile

If nothing works, completely recreate the profile:

```sql
-- Delete existing profile
DELETE FROM profiles
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'bandarathiwanka8@gmail.com');

-- Create fresh admin profile
INSERT INTO profiles (user_id, role, full_name, created_at)
VALUES (
  (SELECT id FROM auth.users WHERE email = 'bandarathiwanka8@gmail.com'),
  'admin',
  'Admin User',
  NOW()
);

-- Verify
SELECT u.email, p.role, p.full_name
FROM auth.users u
JOIN profiles p ON u.id = p.user_id
WHERE u.email = 'bandarathiwanka8@gmail.com';
```

## Step 8: Check Environment Variables

Make sure your `.env.local` has the correct Supabase credentials:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Step 9: Clear Everything and Test

1. Log out from app
2. Close all browser tabs
3. Clear browser data (Ctrl+Shift+Delete):
   - Cookies
   - Cached images and files
   - Site data
4. Close browser completely
5. Restart dev server
6. Open browser in incognito mode
7. Go to http://localhost:3001/login
8. Log in with admin credentials
9. Check console for debug messages
10. Check navbar for admin panel link

## Quick Copy-Paste Test Script

Run this entire script in Supabase SQL Editor:

```sql
-- Complete admin setup script
DO $$
DECLARE
  v_user_id UUID;
  v_profile_count INT;
BEGIN
  -- Get user ID
  SELECT id INTO v_user_id
  FROM auth.users
  WHERE email = 'bandarathiwanka8@gmail.com';

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'User not found in auth.users!';
  END IF;

  RAISE NOTICE 'Found user: %', v_user_id;

  -- Check existing profiles
  SELECT COUNT(*) INTO v_profile_count
  FROM profiles
  WHERE user_id = v_user_id;

  RAISE NOTICE 'Existing profiles: %', v_profile_count;

  -- Delete all existing profiles for this user
  DELETE FROM profiles WHERE user_id = v_user_id;
  RAISE NOTICE 'Deleted old profiles';

  -- Create new admin profile
  INSERT INTO profiles (user_id, role, full_name, created_at)
  VALUES (v_user_id, 'admin', 'Admin User', NOW());
  RAISE NOTICE 'Created new admin profile';

END $$;

-- Verify the result
SELECT
  u.email,
  u.id as user_id,
  p.role,
  p.full_name,
  p.created_at
FROM auth.users u
JOIN profiles p ON u.id = p.user_id
WHERE u.email = 'bandarathiwanka8@gmail.com';

-- This should show:
-- email: bandarathiwanka8@gmail.com
-- role: admin
```

After running this script:
1. Restart your dev server
2. Open browser in incognito
3. Log in
4. Check console for debug messages
5. Admin panel should now appear

## What to Report Back

Copy the console output and tell me:
1. What does the console show for "Profile data"?
2. What does it show for "Profile role"?
3. What does it show for "isAdmin check"?
4. Does the database query show role = 'admin'?
5. Any errors in the console?

This will help me figure out exactly what's wrong!
