# 🚀 Deployment Guide - Digital Signature Application

This is a **learning application** without database persistence. All data is stored in-memory and will reset when the server restarts.

## 📋 Prerequisites

- GitHub account
- Vercel account (for frontend)
- Render account (for backend)

---

## 🎯 Part 1: Deploy Frontend to Vercel

### Step 1: Push Code to GitHub

```bash
git add .
git commit -m "Prepare for deployment

Co-Authored-By: Warp <agent@warp.dev>"
git push origin main
```

### Step 2: Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"New Project"**
3. Import your GitHub repository
4. Vercel will auto-detect the configuration from `vercel.json`
5. **Add Environment Variable:**
   - Name: `VITE_API_URL`
   - Value: `https://your-backend-name.onrender.com` (you'll get this from Render in Part 2)
6. Click **"Deploy"**

### Step 3: Note Your Vercel URL

After deployment, you'll get a URL like:
```
https://your-project-name.vercel.app
```

**Save this URL - you'll need it for the backend setup!**

---

## 🔧 Part 2: Deploy Backend to Render

### Step 1: Create Web Service on Render

1. Go to [render.com](https://render.com) and sign in
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure the service:
   - **Name:** `digisign-pro-api` (or your choice)
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm run dev`
   - **Plan:** Free

### Step 2: Set Environment Variables

Add these environment variables in Render:

```bash
NODE_ENV=production
PORT=5000
HOST=0.0.0.0
CORS_ORIGIN=https://your-project-name.vercel.app
```

**Important:** Replace `https://your-project-name.vercel.app` with your actual Vercel URL from Part 1, Step 3.

### Step 3: Deploy

Click **"Create Web Service"** and wait for deployment to complete.

### Step 4: Note Your Render URL

After deployment, you'll get a URL like:
```
https://your-backend-name.onrender.com
```

---

## 🔄 Part 3: Update Frontend with Backend URL

### Step 1: Update Vercel Environment Variable

1. Go to your Vercel dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Update `VITE_API_URL` with your Render backend URL:
   ```
   https://your-backend-name.onrender.com
   ```
5. Click **"Save"**

### Step 2: Redeploy Frontend

1. Go to **Deployments** tab in Vercel
2. Click the three dots on the latest deployment
3. Click **"Redeploy"**

---

## ✅ Part 4: Test Your Deployment

1. Visit your Vercel frontend URL
2. Try uploading a PDF document
3. Test the signature functionality
4. Everything should work seamlessly!

---

## 🎓 Important Notes for Learning Application

### Data Persistence
- **No database:** All data is stored in-memory
- **Server restarts reset data:** When Render's free tier sleeps or restarts, all data is lost
- This is perfect for learning and testing!

### Free Tier Limitations

**Vercel:**
- Automatically sleeps after inactivity
- Fast cold starts
- Unlimited bandwidth for hobby projects

**Render:**
- Free tier sleeps after 15 minutes of inactivity
- Takes ~30 seconds to wake up on first request
- 750 hours/month of runtime

---

## 🔍 Troubleshooting

### Frontend can't connect to backend
- Check that `VITE_API_URL` in Vercel matches your Render URL exactly
- Ensure `CORS_ORIGIN` in Render matches your Vercel URL
- Wait for Render backend to wake up (check Render logs)

### Backend shows errors
- Check Render logs: Dashboard → Your Service → Logs
- Verify all environment variables are set correctly
- Make sure the backend is running (green status)

### 404 errors on frontend routes
- The `vercel.json` rewrites configuration handles this
- Try redeploying if routes don't work

---

## 📊 Monitoring

### Check Backend Status
Visit: `https://your-backend-name.onrender.com/api/health`

Should return: `{"status": "ok"}`

### View Logs

**Vercel:**
- Dashboard → Your Project → Deployments → Click deployment → View Function Logs

**Render:**
- Dashboard → Your Service → Logs

---

## 🎉 Success!

Your digital signature application is now live!

- **Frontend:** `https://your-project-name.vercel.app`
- **Backend:** `https://your-backend-name.onrender.com`

Share your frontend URL with others to test!

---

## 🔄 Making Updates

### Update Code

1. Make changes locally
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Your update message
   
   Co-Authored-By: Warp <agent@warp.dev>"
   git push origin main
   ```

3. Vercel auto-deploys on push
4. Render auto-deploys on push

---

## 💡 Tips

1. **First load is slow:** Render's free tier sleeps - be patient on first request
2. **Test frequently:** Since data doesn't persist, test thoroughly after each update
3. **Check logs:** Always check logs if something doesn't work
4. **CORS issues:** Make sure URLs match exactly (no trailing slashes)

---

Need help? Check the logs first - they usually tell you what's wrong!
