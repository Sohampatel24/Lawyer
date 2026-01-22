# Quick Start Guide - Running Frontend & Backend Independently

## 🚀 Local Development Setup

### Prerequisites
- Node.js 18+ installed
- PostgreSQL database (Neon recommended)

### Option 1: Run Both Together (Recommended for Development)

```bash
# From root directory
npm install
npm run dev:both
```

**Frontend:** http://localhost:5173  
**Backend:** http://localhost:5000

---

### Option 2: Run Backend Only (Render Testing)

```bash
cd server
npm install
npm start
```

**Backend:** http://localhost:5000

---

### Option 3: Run Frontend Only (Vercel Testing)

```bash
cd client
npm install
npm run dev
```

**Frontend:** http://localhost:5173  
**Connects to:** http://localhost:5000 (if running separately)

---

### Option 4: Run Each Independently

**Terminal 1 - Backend:**
```bash
cd server
npm install
npm start
```

**Terminal 2 - Frontend:**
```bash
cd client
npm install
npm run dev
```

---

## 📋 Configuration Files Created

✅ `/client/package.json` - Frontend dependencies  
✅ `/client/vite.config.ts` - Frontend build config  
✅ `/client/.env.local` - Local dev environment  
✅ `/client/.env.production` - Production environment  
✅ `/server/.env.example` - Backend environment template  
✅ `/render.yaml` - Render deployment config  
✅ `/client/vercel.json` - Vercel deployment config  

---

## 🌐 API Connection Setup

### Local Development
Frontend automatically connects to `http://localhost:5000` (set in `.env.local`)

### Production Deployment

**Frontend on Vercel:**
1. Set environment variable: `VITE_API_URL=https://your-backend.onrender.com`
2. Or leave empty to use same-origin requests (if proxied)

**Backend on Render:**
1. Set environment variable: `CORS_ORIGIN=https://your-frontend.vercel.app`

---

## 🔧 Environment Variables

### Frontend (`.env` files in `/client`)

```env
# Local development
VITE_API_URL=http://localhost:5000

# Production
VITE_API_URL=https://your-backend.onrender.com
```

### Backend (`.env` in `/server` or `/`)

```env
# Database
DATABASE_URL=postgresql://...

# Server
NODE_ENV=development
PORT=5000
HOST=0.0.0.0

# CORS (comma-separated, no spaces)
CORS_ORIGIN=http://localhost:5173,http://localhost:3000,https://your-frontend.vercel.app

# Email & Auth
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
SESSION_SECRET=your-secret-key

# Deployment
BACKEND_ONLY=true
```

---

## 🚢 Deployment Steps

### Deploy Backend to Render

1. **Create Render Account:** https://render.com
2. **Connect Repository:** New Web Service → GitHub
3. **Settings:**
   - Build Command: `cd server && npm install`
   - Start Command: `cd server && npm start`
4. **Environment Variables:**
   ```
   DATABASE_URL=your_neon_url
   NODE_ENV=production
   CORS_ORIGIN=https://your-frontend.vercel.app
   BACKEND_ONLY=true
   SESSION_SECRET=new_secret_key
   ```
5. **Deploy:** Click Deploy

**Backend URL:** `https://your-backend.onrender.com`

---

### Deploy Frontend to Vercel

1. **Create Vercel Account:** https://vercel.com
2. **Connect Repository:** New Project → GitHub
3. **Settings:**
   - Framework: Vite
   - Build Command: `cd client && npm run build`
   - Output Directory: `client/dist`
4. **Environment Variables:**
   ```
   VITE_API_URL=https://your-backend.onrender.com
   ```
5. **Deploy:** Click Deploy

**Frontend URL:** `https://your-frontend.vercel.app`

---

## ✅ Testing After Deployment

### Test Backend API
```bash
curl https://your-backend.onrender.com/api/vercel-test
```

Expected response:
```json
{
  "success": true,
  "message": "✅ Vercel API is working!"
}
```

### Test Frontend
Visit: `https://your-frontend.vercel.app`

Should connect to backend successfully (check browser console for API calls)

---

## 🐛 Troubleshooting

### CORS Error
**Problem:** `Access to XMLHttpRequest blocked by CORS policy`

**Solution:**
1. Check `CORS_ORIGIN` in backend `.env`
2. Ensure frontend URL is included (with protocol)
3. Format: `https://frontend.vercel.app,http://localhost:3000`

### API Connection Failed
**Problem:** `Cannot connect to API`

**Solution:**
1. Verify `VITE_API_URL` in frontend `.env.production`
2. Ensure backend is running at that URL
3. Check CORS headers are being sent

### Port Already in Use
```bash
# Kill process on port 5000
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :5000 | grep LISTEN | awk '{print $2}' | xargs kill -9
```

### Dependencies Missing
```bash
# Reinstall all dependencies
cd client && npm install
cd ../server && npm install
cd ..
```

---

## 📊 Project Structure After Setup

```
lawyer_digital_signature/
├── client/
│   ├── package.json (NEW)
│   ├── vite.config.ts (MODIFIED)
│   ├── .env.local (NEW)
│   ├── .env.production (NEW)
│   ├── .env.example (NEW)
│   ├── src/
│   └── dist/
├── server/
│   ├── package.json
│   ├── index.ts (MODIFIED)
│   ├── .env.example (NEW)
│   └── ...
├── package.json (MODIFIED)
├── render.yaml (NEW)
└── .github/
    └── workflows/
        └── deploy.yml (NEW)
```

---

## 📝 NPM Scripts Summary

| Script | Location | Purpose |
|--------|----------|---------|
| `npm run dev` | Root | Run backend only (old) |
| `npm run dev:server` | Root | Run backend from root |
| `npm run dev:client` | Root | Run frontend from root |
| `npm run dev:both` | Root | Run both concurrently |
| `npm run build:client` | Root | Build frontend |
| `npm run build:server` | Root | Build backend |
| `npm run dev` | Client | Run dev server |
| `npm run build` | Client | Build for production |
| `npm start` | Client | Build & preview |
| `npm start` | Server | Start server |

---

## 🎯 Next Steps

1. ✅ Create `/client/package.json` (Done)
2. ✅ Create environment files (Done)
3. ✅ Test local setup: `npm run dev:both`
4. ✅ Deploy backend to Render
5. ✅ Deploy frontend to Vercel
6. ✅ Update CORS_ORIGIN in backend
7. ✅ Update VITE_API_URL in frontend
8. ✅ Test API connectivity

---

**Questions?** Check the main `MONOREPO_SETUP_GUIDE.md` for detailed information.
