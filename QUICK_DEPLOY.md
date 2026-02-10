# ⚡ Quick Deploy Guide - 15 Minutes

Fast track to deploy SATEK to Vercel with automatic CI/CD.

---

## 🚀 Step 1: Push to GitHub (2 minutes)

```bash
# In your project folder (D:\SATEk.com)
git add .
git commit -m "Ready for deployment"
git push -u origin main
```

If you get an error:
```bash
git push -u origin main --force
```

---

## 🌐 Step 2: Deploy to Vercel (5 minutes)

### 1. Go to Vercel
Visit: https://vercel.com

### 2. Sign in with GitHub
Click **"Continue with GitHub"**

### 3. Import Project
- Click **"Add New..."** → **"Project"**
- Find **"SATEK"** repository
- Click **"Import"**

### 4. Add Environment Variables
**BEFORE clicking Deploy**, add these:

**Variable 1:**
```
Name: NEXT_PUBLIC_SUPABASE_URL
Value: https://xvwgcqklmhtxpofvaank.supabase.co
```

**Variable 2:**
```
Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: (Get from Supabase Dashboard → Settings → API)
```

### 5. Deploy
Click **"Deploy"** → Wait 3 minutes ✅

---

## ✅ Step 3: Configure Supabase (2 minutes)

### In Supabase Dashboard

**Authentication → URL Configuration:**

Add your Vercel URL:
```
Site URL: https://your-app.vercel.app

Redirect URLs:
https://your-app.vercel.app/**
```

**Settings → API → CORS:**

Add:
```
https://your-app.vercel.app
```

---

## 🎯 Step 4: Test (3 minutes)

Visit your Vercel URL and test:

- [ ] Homepage loads
- [ ] Can log in
- [ ] Admin panel works
- [ ] Images upload
- [ ] Products display

---

## 🔄 CI/CD is Already Working!

From now on:

```bash
# Make changes
git add .
git commit -m "Update something"
git push
```

**→ Vercel automatically deploys in 2-3 minutes!** 🎉

---

## 🌍 Add Custom Domain (Optional)

### In Vercel:
1. Dashboard → Your Project → Settings → Domains
2. Enter your domain: `satek.com`
3. Follow DNS instructions

---

## 🆘 Common Issues

### Build Fails?
```bash
# Check environment variables in Vercel Dashboard
# Make sure both Supabase variables are set
```

### Admin Panel Not Showing?
```sql
-- Run in Supabase SQL Editor:
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
```

### Images Not Uploading?
```
Check: Supabase Storage → images bucket → Settings → Make Public
```

---

## ✨ Done!

Your site is now:
- ✅ Live on the internet
- ✅ Auto-deploys on every push
- ✅ Fast (Vercel CDN)
- ✅ Secure (HTTPS)

**Every time you push to GitHub = Automatic deployment!**

That's modern CI/CD! 🚀

---

**See DEPLOYMENT_GUIDE.md for detailed instructions.**
