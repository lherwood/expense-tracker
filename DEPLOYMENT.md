# 🚀 Deployment Guide - Olarm Expense Tracker

## Option 1: Vercel CLI (Recommended)

### Prerequisites
1. Create a Vercel account at https://vercel.com
2. Sign in with GitHub (recommended)

### Deploy Steps
```bash
# 1. Login to Vercel
vercel login

# 2. Deploy
vercel

# 3. Follow prompts:
# - Project name: (press Enter for default)
# - Link to existing project: Y
# - Directory: ./ (press Enter)
```

## Option 2: Vercel Web Interface

### Steps
1. Go to https://vercel.com/dashboard
2. Click **"New Project"**
3. Import your GitHub repository (if you have one)
4. Or drag & drop the `dist` folder after running `npm run build`
5. Click **"Deploy"**

## Option 3: GitHub Integration

### Steps
1. Push your code to GitHub
2. Connect Vercel to your GitHub account
3. Import the repository
4. Vercel will auto-deploy on every push

## After Deployment

You'll get a URL like:
```
https://your-project-name.vercel.app
```

### Features Available
- ✅ **Global Access** - Works from anywhere
- ✅ **PWA Support** - Install on mobile devices
- ✅ **Auto-updates** - Deploys automatically
- ✅ **HTTPS** - Secure by default
- ✅ **CDN** - Fast loading worldwide

## Mobile Installation

### iPhone
1. Open Safari
2. Go to your Vercel URL
3. Tap Share → "Add to Home Screen"

### Android
1. Open Chrome
2. Go to your Vercel URL
3. Tap Menu → "Add to Home Screen"

## Environment Variables (Optional)

If you want to use Google Sheets API:
1. Go to Vercel Dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add your Google Sheets API key

---

**Your expense tracker will be live and accessible from anywhere in the world! 🌍** 