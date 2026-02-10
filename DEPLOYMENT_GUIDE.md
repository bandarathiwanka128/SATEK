# 🚀 SATEK Deployment Guide - Vercel + GitHub CI/CD

Complete guide to deploy your SATEK platform to Vercel with automatic deployments.

---

## 📋 Prerequisites Checklist

Before deploying, make sure:

- ✅ Admin user works locally (bandarathiwanka8@gmail.com)
- ✅ RLS is disabled on profiles table (or has correct policies)
- ✅ Products can be created with image upload
- ✅ Wishlist and comparison features work
- ✅ Supabase project is ready (not paused)
- ✅ You have your Supabase credentials ready

---

## 🔧 Step 1: Prepare Your Code

### 1.1 Create/Update .gitignore

Make sure you have a `.gitignore` file in your project root:

```bash
# .gitignore
node_modules/
.next/
out/
build/
dist/

# Environment variables
.env
.env.local
.env.production.local
.env.development.local

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# OS
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
*.swp
*.swo

# Testing
coverage/

# Misc
*.log
.vercel
```

### 1.2 Create .env.example

Create a template for environment variables:

```bash
# .env.example
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### 1.3 Verify package.json scripts

Make sure these scripts exist in `package.json`:

```json
{
  "scripts": {
    "dev": "next dev --port 3001",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  }
}
```

---

## 📤 Step 2: Push to GitHub

### 2.1 Initialize Git (if not done)

```bash
git init
git add .
git commit -m "Initial commit: SATEK platform ready for deployment"
```

### 2.2 Add Remote Repository

```bash
git remote add origin https://github.com/bandarathiwanka128/SATEK.git
```

### 2.3 Push to GitHub

```bash
# Push to main branch
git branch -M main
git push -u origin main
```

If you get an error about existing content:

```bash
# Force push (ONLY if you're sure)
git push -u origin main --force
```

---

## 🌐 Step 3: Deploy to Vercel

### 3.1 Sign Up / Log In to Vercel

1. Go to: https://vercel.com
2. Click **"Sign Up"** or **"Log In"**
3. Choose **"Continue with GitHub"**
4. Authorize Vercel to access your GitHub account

### 3.2 Import Your Project

1. After logging in, click **"Add New..."** → **"Project"**
2. Find your repository: **SATEK**
3. Click **"Import"**

### 3.3 Configure Project

**Framework Preset:** Next.js (should auto-detect)

**Root Directory:** `./` (leave default)

**Build Command:** `npm run build` (auto-filled)

**Output Directory:** `.next` (auto-filled)

**Install Command:** `npm install` (auto-filled)

### 3.4 Add Environment Variables

⚠️ **IMPORTANT:** Add these before deploying!

Click **"Environment Variables"** and add:

**Variable 1:**
- **Name:** `NEXT_PUBLIC_SUPABASE_URL`
- **Value:** Your Supabase project URL
  - Get from: Supabase Dashboard → Settings → API
  - Example: `https://xvwgcqklmhtxpofvaank.supabase.co`

**Variable 2:**
- **Name:** `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Value:** Your Supabase anon/public key
  - Get from: Supabase Dashboard → Settings → API → Project API keys → anon/public
  - Example: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

**Where to get these:**
```
Supabase Dashboard → Settings → API

URL: https://your-project.supabase.co
anon key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 3.5 Deploy

1. Click **"Deploy"**
2. Wait 2-5 minutes for build to complete
3. You'll see: ✅ **"Congratulations! Your project has been deployed"**

---

## 🎉 Step 4: Test Your Live Site

### 4.1 Visit Your Site

Vercel will give you a URL like:
- `https://satek.vercel.app`
- or `https://satek-bandarathiwanka128.vercel.app`

### 4.2 Test Checklist

- [ ] Homepage loads correctly
- [ ] Can register new account
- [ ] Can log in
- [ ] Admin can access /admin panel
- [ ] Products display correctly
- [ ] Image upload works in admin
- [ ] Wishlist works
- [ ] Comparison works
- [ ] Affiliate links work

---

## 🔄 Step 5: Set Up CI/CD (Automatic Deployments)

Good news! **CI/CD is already set up!** 🎉

Vercel automatically:
- ✅ Watches your GitHub repository
- ✅ Deploys on every push to `main` branch
- ✅ Creates preview deployments for pull requests

### How it works:

1. **Make changes locally:**
   ```bash
   # Edit some files
   git add .
   git commit -m "Update homepage design"
   git push
   ```

2. **Automatic deployment:**
   - Vercel detects the push
   - Starts building automatically
   - Deploys to production (2-5 minutes)
   - Sends you a notification

3. **Check deployment status:**
   - Go to: https://vercel.com/dashboard
   - Or check your email for deployment notifications

### Preview Deployments (Bonus!)

If you use branches:

```bash
# Create feature branch
git checkout -b feature/new-design
# Make changes
git add .
git commit -m "New design"
git push origin feature/new-design
```

Vercel will create a **preview URL** (separate from production) so you can test before merging!

---

## 🌍 Step 6: Add Custom Domain (.com)

### Option A: Buy Domain from Vercel

1. Go to: Vercel Dashboard → Your Project → Settings → Domains
2. Click **"Buy a domain"**
3. Search for: `satek.com` or `yourdomain.com`
4. Purchase (around $15-20/year)
5. Domain automatically configured! ✅

### Option B: Use Existing Domain

If you bought from Namecheap, GoDaddy, etc.:

1. **In Vercel:**
   - Go to: Settings → Domains
   - Click **"Add"**
   - Enter: `satek.com`
   - Click **"Add"**

2. **Vercel will show DNS records:**
   ```
   Type: A
   Name: @
   Value: 76.76.21.21

   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

3. **In your domain registrar (Namecheap/GoDaddy):**
   - Go to DNS settings
   - Add the A record
   - Add the CNAME record
   - Save

4. **Wait 24-48 hours** for DNS propagation

5. **Your site will be live at:**
   - `https://satek.com` ✅
   - `https://www.satek.com` ✅

---

## 🔒 Step 7: Configure Supabase for Production

### 7.1 Add Production URL to Supabase

1. Go to: Supabase Dashboard → Authentication → URL Configuration
2. Add your Vercel URL to **"Site URL":**
   - `https://satek.vercel.app`
   - or your custom domain: `https://satek.com`

3. Add to **"Redirect URLs":**
   - `https://satek.vercel.app/**`
   - `https://satek.com/**`

### 7.2 Update Allowed Origins (CORS)

1. Go to: Supabase Dashboard → Settings → API
2. Under **"CORS"**, add:
   - `https://satek.vercel.app`
   - `https://satek.com`

---

## 🐛 Troubleshooting

### Build Fails on Vercel

**Error: "Module not found"**
```bash
# Locally, reinstall dependencies
rm -rf node_modules package-lock.json
npm install
git add package-lock.json
git commit -m "Update dependencies"
git push
```

**Error: "Environment variables not found"**
- Check: Vercel Dashboard → Settings → Environment Variables
- Make sure both `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are added

### Site Deployed But Not Working

**Check 1: Environment Variables**
- Vercel Dashboard → Settings → Environment Variables
- Click "Redeploy" after adding/updating variables

**Check 2: Supabase URLs**
- Supabase → Authentication → URL Configuration
- Add your production URL

**Check 3: RLS Policies**
- Make sure profiles table RLS is disabled or has correct policies
- Check other tables don't have blocking policies

### Images Not Uploading on Production

**Check Supabase Storage:**
- Dashboard → Storage → images bucket
- Make sure bucket exists
- Check bucket is public
- Verify admin can upload

### Admin Panel Not Showing

**Run this SQL in Supabase:**
```sql
-- Verify admin exists
SELECT u.email, p.role
FROM auth.users u
JOIN profiles p ON u.id = p.user_id
WHERE u.email = 'bandarathiwanka8@gmail.com';

-- Should show role = 'admin'
```

**Check RLS:**
```sql
-- Disable RLS on profiles
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
```

---

## 📊 Step 8: Monitor Your Site

### Vercel Analytics (Free)

1. Go to: Vercel Dashboard → Your Project → Analytics
2. See:
   - Page views
   - Unique visitors
   - Top pages
   - Performance metrics

### Deployment Logs

1. Vercel Dashboard → Deployments
2. Click any deployment
3. View build logs and runtime logs

### Error Monitoring

Add error tracking (optional):
- Sentry: https://sentry.io
- LogRocket: https://logrocket.com

---

## 🔄 Daily Workflow

### Making Updates

```bash
# 1. Make changes to your code
# Edit files in VSCode

# 2. Test locally
npm run dev
# Check at http://localhost:3001

# 3. Commit and push
git add .
git commit -m "Description of changes"
git push

# 4. Wait 2-5 minutes
# Vercel automatically deploys

# 5. Check live site
# Visit https://satek.vercel.app
```

### Rollback if Needed

If something breaks:

1. Go to: Vercel Dashboard → Deployments
2. Find the last working deployment
3. Click **"..."** → **"Promote to Production"**
4. Previous version restored instantly! ✅

---

## 🎯 Success Checklist

After deployment, verify:

- [ ] Site is live at Vercel URL
- [ ] Can create account and log in
- [ ] Admin panel works (bandarathiwanka8@gmail.com)
- [ ] Products display on homepage
- [ ] Can create products with images in admin
- [ ] Image upload works
- [ ] Wishlist feature works
- [ ] Comparison feature works
- [ ] All affiliate links work
- [ ] Mobile responsive
- [ ] Custom domain connected (if applicable)
- [ ] SSL certificate active (https://)
- [ ] Auto-deploy works (push = deploy)

---

## 📚 Useful Commands

```bash
# Check git status
git status

# View commit history
git log --oneline

# Create new branch
git checkout -b feature-name

# Switch back to main
git checkout main

# Pull latest changes
git pull

# Push to GitHub
git push

# Force push (careful!)
git push --force

# View remote URL
git remote -v

# Undo last commit (keep changes)
git reset --soft HEAD~1
```

---

## 🆘 Need Help?

1. **Vercel Documentation:** https://vercel.com/docs
2. **Next.js Deployment:** https://nextjs.org/docs/deployment
3. **Supabase Guides:** https://supabase.com/docs

---

## 🎉 You're Done!

Your SATEK platform is now:
- ✅ Live on the internet
- ✅ Automatically deployed on every push
- ✅ Fast and globally distributed (Vercel CDN)
- ✅ SSL secured (HTTPS)
- ✅ Ready for custom domain

**Congratulations!** 🚀

Every time you push to GitHub, your site updates automatically within minutes. That's modern CI/CD!

Make sure to share your live URL! 🌐
