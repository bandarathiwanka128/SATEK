# Quick Fix: Admin Panel Not Showing

## The Problem

You can log in with `bandarathiwanka8@gmail.com` but don't see the "Admin Panel" link in the navbar.

## The Solution

The profile in the database either doesn't exist or has `role = 'user'` instead of `role = 'admin'`.

## Fix It Now (5 minutes)

### 1. Open Supabase Dashboard

Go to your Supabase project dashboard: https://supabase.com/dashboard

### 2. Run SQL Query

Click on **SQL Editor** in the sidebar, then run this:

```sql
-- First, check what's there
SELECT
  u.email,
  u.id as user_id,
  p.role,
  p.full_name
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.user_id
WHERE u.email = 'bandarathiwanka8@gmail.com';
```

### 3. Based on Results:

#### If you see `role: user` or `role: null`:

Run this to fix it:

```sql
-- Fix the admin role
UPDATE profiles
SET role = 'admin'
WHERE user_id = (
  SELECT id FROM auth.users WHERE email = 'bandarathiwanka8@gmail.com'
);
```

#### If profile doesn't exist (all NULL):

Run this to create it:

```sql
-- Create admin profile
INSERT INTO profiles (user_id, role, full_name)
SELECT
  id,
  'admin',
  'Admin User'
FROM auth.users
WHERE email = 'bandarathiwanka8@gmail.com';
```

### 4. Verify It Worked

Run this:

```sql
-- Should show role = 'admin'
SELECT
  u.email,
  p.role
FROM auth.users u
JOIN profiles p ON u.id = p.user_id
WHERE u.email = 'bandarathiwanka8@gmail.com';
```

Expected result:
```
email: bandarathiwanka8@gmail.com
role: admin
```

### 5. Test in Your App

1. **Log out** from your app
2. **Close browser completely**
3. **Reopen browser**
4. **Go to** http://localhost:3001/login
5. **Log in** with:
   - Email: `bandarathiwanka8@gmail.com`
   - Password: `1aA#22##`
6. **Click** the user icon (top right)
7. **You should see** "Admin Panel" in the dropdown

## Still Not Working?

### Check Table Structure

Make sure the profiles table exists with the correct structure:

```sql
-- Check if profiles table exists
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'profiles';
```

You should see:
- `id` (uuid)
- `user_id` (uuid)
- `role` (text or enum)
- `full_name` (text)
- `avatar_url` (text)
- `created_at` (timestamp)

### Check RLS Policies

Make sure you can read profiles:

```sql
-- Check RLS policies
SELECT *
FROM profiles
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'bandarathiwanka8@gmail.com');
```

If this returns nothing, RLS might be blocking it. Temporarily disable RLS to test:

```sql
-- Temporarily disable RLS for testing
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- Try the app again

-- Re-enable RLS after testing
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
```

### Debug in Browser

1. Open browser console (F12)
2. Go to your app homepage
3. Log in as admin
4. In console, check:

```javascript
// Check localStorage
console.log(localStorage);

// Check cookies (auth session should be there)
console.log(document.cookie);
```

### Common Issues

1. **Browser cache**: Clear all cookies and cache
2. **Wrong password**: Double-check password is `1aA#22##`
3. **Profile not created**: When you registered, profile might not have been auto-created
4. **RLS blocking**: Row Level Security policies might be too restrictive

### Need More Help?

If none of this works, check:

1. Browser console for errors
2. Supabase logs (Dashboard → Logs)
3. Network tab to see if profile query is failing
4. Make sure you're using the correct Supabase project

## Quick Test Script

Run this in Supabase SQL Editor to do everything at once:

```sql
-- All-in-one fix script
DO $$
DECLARE
  admin_user_id UUID;
BEGIN
  -- Get the admin user ID
  SELECT id INTO admin_user_id
  FROM auth.users
  WHERE email = 'bandarathiwanka8@gmail.com';

  IF admin_user_id IS NULL THEN
    RAISE NOTICE 'User not found in auth.users!';
    RAISE NOTICE 'Make sure you created the account first.';
  ELSE
    -- Check if profile exists
    IF EXISTS (SELECT 1 FROM profiles WHERE user_id = admin_user_id) THEN
      -- Update existing profile
      UPDATE profiles
      SET role = 'admin'
      WHERE user_id = admin_user_id;
      RAISE NOTICE 'Profile updated to admin role';
    ELSE
      -- Create new profile
      INSERT INTO profiles (user_id, role, full_name)
      VALUES (admin_user_id, 'admin', 'Admin User');
      RAISE NOTICE 'Profile created with admin role';
    END IF;
  END IF;
END $$;

-- Verify the result
SELECT
  u.email,
  p.role,
  p.full_name
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.user_id
WHERE u.email = 'bandarathiwanka8@gmail.com';
```

This script will:
1. Find your user
2. Check if profile exists
3. Create or update profile to admin
4. Show you the result

After running this, log out and log back in. The admin panel should appear!
