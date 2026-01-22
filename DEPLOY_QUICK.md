# 🚀 Quick Deployment Reference

## ✅ Configuration Files Ready

Your project is configured for deployment:

### Frontend (Vercel)
- ✅ `vercel.json` - Configured at root
- ✅ Build command: `cd client && npm install && npm run build`
- ✅ Output directory: `client/dist`

### Backend (Render)
- ✅ `render.yaml` - Simplified for no-database setup
- ✅ Build command: `npm install`
- ✅ Start command: `npm run dev`

---

## 🎯 Deployment Steps (Summary)

### 1️⃣ Deploy Frontend to Vercel
```bash
# Push to GitHub first
git add .
git commit -m "Deploy to Vercel and Render

Co-Authored-By: Warp <agent@warp.dev>"
git push origin main
```

Then on Vercel:
- Import repository
- Add env var: `VITE_API_URL` = (leave empty for now)
- Deploy
- **Save the Vercel URL**

### 2️⃣ Deploy Backend to Render

On Render:
- Create Web Service
- Connect repository
- Set environment variables:
  ```
  NODE_ENV=production
  PORT=5000
  HOST=0.0.0.0
  CORS_ORIGIN=<YOUR_VERCEL_URL>
  ```
- Deploy
- **Save the Render URL**

### 3️⃣ Update Frontend

On Vercel:
- Go to Settings → Environment Variables
- Update `VITE_API_URL` = `<YOUR_RENDER_URL>`
- Redeploy

---

## 📝 Environment Variables Checklist

### Vercel (Frontend)
- [ ] `VITE_API_URL` = Your Render backend URL

### Render (Backend)
- [ ] `NODE_ENV` = production
- [ ] `PORT` = 5000
- [ ] `HOST` = 0.0.0.0
- [ ] `CORS_ORIGIN` = Your Vercel frontend URL

---

## 🔍 Quick Test

After deployment:

1. **Frontend:** Visit your Vercel URL
2. **Backend:** Visit `<YOUR_RENDER_URL>/api/vercel-test`
   - Should return: `{"success": true, "message": "✅ Vercel API is working!"}`

---

## ⚠️ Important Notes

- **No database:** This is an in-memory learning app
- **Data resets:** When backend restarts, all data is lost
- **First load:** Render free tier sleeps - first request takes ~30s
- **CORS:** URLs must match exactly (no trailing slashes)

---

## 📚 Full Guide

For detailed step-by-step instructions, see: **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)**

---

## 🆘 Troubleshooting

**Can't connect to backend?**
- Wait 30s for Render to wake up
- Check CORS_ORIGIN matches Vercel URL
- Check VITE_API_URL matches Render URL

**Frontend shows 404?**
- vercel.json rewrites handle this
- Try redeploying

**Check logs:**
- Vercel: Dashboard → Deployments → Function Logs
- Render: Dashboard → Service → Logs
