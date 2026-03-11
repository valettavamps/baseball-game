# Netlify Deployment Guide for DiamondChain ⚾

## What's Already Done ✅
- Created `netlify.toml` with build settings
- Build command: `npm run build`
- Publish directory: `build`
- Added redirect rule for SPA (Single Page App)

---

## Step-by-Step: Connect Your Repo to Netlify

### Step 1: Sign Up / Log In to Netlify
1. Go to **netlify.com**
2. Click **"Sign up"** → choose **GitHub** (fastest)
3. Authorize Netlify to access your GitHub

### Step 2: Add Your Site
1. Once logged in, click **"Add new site"** → **"Import an existing project"**
2. You should see your GitHub repos listed
3. Find and select **`valettavamps/baseball-game`**

### Step 3: Configure Build Settings
Netlify should auto-detect settings from `netlify.toml`, but verify:
- **Build command:** `npm run build` (or leave blank - it reads from config)
- **Publish directory:** `build` (or leave blank - it reads from config)
- **Node version:** 18 (or leave blank)

Click **"Deploy site"**

### Step 4: Wait for First Deploy
- Netlify will run `npm install` then `npm run build`
- Takes ~1-2 minutes
- You'll get a random URL like `random-name-123.netlify.app`

### Step 5: (Optional) Custom Domain
- Want your own domain? Netlify supports custom domains
- Change site name in **Site settings → Site details → Site name**

---

## After Deploy: Update Your Code

When you push changes to GitHub:
```bash
git add .
git commit -m "Your message"
git push origin main
```
Netlify auto-detects the push and redeploys in ~1 minute.

---

## Troubleshooting

**Build failing?**
- Check **"Deploys"** tab → click latest deploy → look at log
- Common issue: missing dependencies → check package.json

**404 errors on navigation?**
- The `netlify.toml` redirect rule handles this ✅

**Need to rebuild manually?**
- Go to **Deploys** tab → click **"Trigger deploy"** → **"Deploy site"**

---

## Quick Commands Reference

```bash
# Local build test (before pushing)
npm run build

# Test locally
npm start
```

---

## Questions?
I'm here to help! Just ping me when you're ready to deploy or if you hit any snags. 🦞
