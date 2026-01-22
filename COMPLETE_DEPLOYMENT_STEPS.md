# 🚀 Complete Deployment Guide - From Scratch

Follow these steps exactly to deploy your application from scratch.

---

## 📋 Part 1: Create GitHub Repository

### Step 1: Initialize Git in Your Project

Open PowerShell in your project directory and run:

```powershell
# Initialize git repository
git init

# Check git status
git status
```

### Step 2: Create .gitignore (Already Done ✅)

Your project already has a `.gitignore` file, so this step is complete!

### Step 3: Make First Commit

```powershell
# Add all files
git add .

# Create first commit
git commit -m "Initial commit - Digital signature application

Co-Authored-By: Warp <agent@warp.dev>"
```

### Step 4: Create GitHub Repository

1. Go to **https://github.com**
2. Click the **"+"** icon (top right) → **"New repository"**
3. Fill in:
   - **Repository name:** `digital-signature-app` (or any name you like)
   - **Description:** `Digital signature application for PDFs`
   - **Visibility:** Public or Private (your choice)
   - **DO NOT** initialize with README, .gitignore, or license (we already have files)
4. Click **"Create repository"**

### Step 5: Push to GitHub

GitHub will show you commands. Use these (replace with your actual URL):

```powershell
# Add remote repository
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Push to GitHub
git branch -M main
git push -u origin main
```

**Example:**
```powershell
git remote add origin https://github.com/johndoe/digital-signature-app.git
git branch -M main
git push -u origin main
```

You may need to authenticate with GitHub (use Personal Access Token if asked).

---

## 🎨 Part 2: Deploy Frontend to Vercel

### Step 1: Sign Up / Login to Vercel

1. Go to **https://vercel.com**
2. Click **"Sign Up"** (or **"Login"**)
3. Sign up with **GitHub** (easiest option)
4. Authorize Vercel to access GitHub

### Step 2: Import Project

1. Click **"Add New..."** → **"Project"**
2. Select **"Import Git Repository"**
3. Find your `digital-signature-app` repository
4. Click **"Import"**

### Step 3: Configure Project

Vercel will auto-detect settings from `vercel.json`:

- **Framework Preset:** Vite (auto-detected) ✅
- **Build Command:** Auto-filled ✅
- **Output Directory:** Auto-filled ✅

**Important:** Expand **"Environment Variables"** section and add:

| Name | Value |
|------|-------|
| `VITE_API_URL` | Leave empty for now (we'll update this later) |

### Step 4: Deploy

1. Click **"Deploy"**
2. Wait for build to complete (2-3 minutes)
3. You'll see: **"Congratulations! Your project has been deployed"**

### Step 5: Save Your Vercel URL

After deployment, you'll see a URL like:
```
https://digital-signature-app-xyz123.vercel.app
```

**📝 IMPORTANT: Copy and save this URL!** You'll need it for backend setup.

---

## 🔧 Part 3: Deploy Backend to Render

### Step 1: Sign Up / Login to Render

1. Go to **https://render.com**
2. Click **"Get Started"**
3. Sign up with **GitHub** (recommended)
4. Authorize Render to access GitHub

### Step 2: Create Web Service

1. Click **"New +"** (top right)
2. Select **"Web Service"**
3. Click **"Connect account"** if needed
4. Find your `digital-signature-app` repository
5. Click **"Connect"**

### Step 3: Configure Service

Fill in these settings:

| Setting | Value |
|---------|-------|
| **Name** | `digital-signature-api` (or your choice) |
| **Region** | Choose closest to you |
| **Branch** | `main` |
| **Root Directory** | Leave empty |
| **Runtime** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `npm run dev` |
| **Instance Type** | `Free` |

### Step 4: Add Environment Variables

Scroll down to **"Environment Variables"** and click **"Add Environment Variable"**

Add these **4 variables**:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `PORT` | `5000` |
| `HOST` | `0.0.0.0` |
| `CORS_ORIGIN` | **YOUR VERCEL URL** (from Part 2, Step 5) |

**Example for CORS_ORIGIN:**
```
https://digital-signature-app-xyz123.vercel.app
```

⚠️ **IMPORTANT:** Use your ACTUAL Vercel URL (no trailing slash!)

### Step 5: Deploy

1. Click **"Create Web Service"**
2. Wait for deployment (3-5 minutes)
3. Watch the logs - should see: "🚀 Server running at..."

### Step 6: Save Your Render URL

After deployment, you'll see a URL like:
```
https://digital-signature-api-abc123.onrender.com
```

**📝 IMPORTANT: Copy and save this URL!**

---

## 🔄 Part 4: Connect Frontend to Backend

Now we need to tell the frontend where the backend is.

### Step 1: Update Vercel Environment Variable

1. Go to **Vercel Dashboard** (https://vercel.com/dashboard)
2. Click on your project (`digital-signature-app`)
3. Go to **"Settings"** tab
4. Click **"Environment Variables"** (left sidebar)
5. Find `VITE_API_URL`
6. Click **"Edit"**
7. Change value to your **Render URL** (from Part 3, Step 6)

**Example:**
```
https://digital-signature-api-abc123.onrender.com
```

⚠️ **No trailing slash!**

8. Click **"Save"**

### Step 2: Redeploy Frontend

1. Go to **"Deployments"** tab
2. Click the **three dots (...)** next to the latest deployment
3. Click **"Redeploy"**
4. Wait for redeployment (1-2 minutes)

---

## ✅ Part 5: Test Your Deployment

### Step 1: Test Backend

1. Open your browser
2. Visit: `https://YOUR-RENDER-URL/api/vercel-test`

**Example:**
```
https://digital-signature-api-abc123.onrender.com/api/vercel-test
```

**Expected Response:**
```json
{
  "success": true,
  "message": "✅ Vercel API is working!",
  "timestamp": "2026-01-22T10:00:00.000Z",
  "environment": "production"
}
```

⏰ **First load may take 30-60 seconds** (Render free tier wakes up)

### Step 2: Test Frontend

1. Visit your Vercel URL: `https://YOUR-VERCEL-URL`
2. You should see the Digital Signature application
3. Try uploading a PDF
4. Try adding a signature
5. Try downloading the signed PDF

### Step 3: Check for Errors

Open browser console (F12) and check for:
- ✅ No CORS errors
- ✅ No API connection errors
- ✅ All features working

---

## 📝 Summary - Your URLs

After completing all steps, you'll have:

| Service | URL | Purpose |
|---------|-----|---------|
| **Frontend** | `https://your-app.vercel.app` | User interface |
| **Backend** | `https://your-api.onrender.com` | API server |
| **GitHub** | `https://github.com/username/repo` | Source code |

---

## 🔄 Making Changes Later

When you want to update your code:

```powershell
# Make your changes to the code...

# Then commit and push
git add .
git commit -m "Description of changes

Co-Authored-By: Warp <agent@warp.dev>"
git push origin main
```

**Both Vercel and Render will automatically redeploy!** 🎉

---

## 🆘 Troubleshooting

### Problem: Git push asks for password

**Solution:** Use Personal Access Token
1. Go to GitHub → Settings → Developer settings → Personal access tokens
2. Generate new token (classic)
3. Select scope: `repo`
4. Copy token
5. Use token as password when pushing

### Problem: Frontend shows white screen

**Solution:**
- Check Vercel deployment logs
- Verify build completed successfully
- Check browser console for errors

### Problem: Backend not responding

**Solution:**
- Wait 30-60 seconds (Render wakes up)
- Check Render logs for errors
- Verify environment variables are set

### Problem: CORS errors in browser

**Solution:**
- Check `CORS_ORIGIN` in Render matches your Vercel URL exactly
- No trailing slashes
- Include `https://`

### Problem: Can't upload PDFs

**Solution:**
- Check backend logs in Render
- Verify backend URL is correct in Vercel
- Check browser console for API errors

---

## 📊 Expected Behavior

### First Load
- **Frontend:** Loads instantly
- **Backend:** May take 30-60 seconds to wake up (Render free tier)

### Subsequent Loads
- **Frontend:** Instant
- **Backend:** Fast (if used within 15 minutes)

### Data Persistence
- ⚠️ **Data does NOT persist** - This is a learning app
- All data stored in memory
- Backend restart = data lost
- This is NORMAL and EXPECTED

---

## 🎉 Success!

When everything works, you should be able to:

- ✅ Open the app in browser
- ✅ Upload PDF documents
- ✅ Create digital signatures
- ✅ Drag signatures onto PDFs
- ✅ Download signed PDFs
- ✅ Share the Vercel URL with others

---

## 📱 Share Your App

Your app is now live! Share your Vercel URL with:
- Friends
- Colleagues
- Portfolio
- Resume

---

## 🎓 What You've Learned

You now know how to:
- Create a Git repository
- Push code to GitHub
- Deploy frontend to Vercel
- Deploy backend to Render
- Configure environment variables
- Connect frontend and backend
- Debug deployment issues

**Congratulations!** 🎊

---

## ❓ Questions?

If something doesn't work:
1. Check the URLs are correct (no typos)
2. Verify environment variables
3. Check deployment logs
4. Wait for Render to wake up
5. Check browser console

---

**Happy Deploying!** 🚀
