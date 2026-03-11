# Deployment Guide

## Quick Reference

### Backend (Node.js/Express)
- **Root Directory:** `backend`
- **Build Command:** `npm install`
- **Start Command:** `npm start`
- **Port:** 8000

### Frontend (React/Vite)
- **Root Directory:** `frontend`
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Framework:** Vite

---

## Option 1: Vercel (Frontend) + Render (Backend)

### Step 1: Deploy Backend on Render

1. Go to [render.com](https://render.com) and sign up
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure:
   - **Name:** sales-insight-automator-api
   - **Root Directory:** `backend`
   - **Environment:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Free

5. Add Environment Variables:
   ```
   NODE_ENV=production
   PORT=8000
   GEMINI_API_KEY=AIzaSyCrKAqQv8FHZFV08D-tgG0UsUYCbMuMln4
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=navjotsinghsaini718@gmail.com
   SMTP_PASS=your_16_char_app_password
   SMTP_FROM=navjotsinghsaini718@gmail.com
   FRONTEND_URL=https://your-frontend.vercel.app
   ```

6. Click **"Create Web Service"**
7. Copy your backend URL: `https://sales-insight-automator-api.onrender.com`

### Step 2: Deploy Frontend on Vercel

1. Go to [vercel.com](https://vercel.com) and sign up
2. Click **"Add New"** → **"Project"**
3. Import your GitHub repository
4. Configure:
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

5. Add Environment Variable:
   ```
   VITE_API_URL=https://sales-insight-automator-api.onrender.com/api
   ```

6. Click **"Deploy"**
7. Your frontend will be live at: `https://your-project.vercel.app`

### Step 3: Update Backend CORS

Go back to Render and update the `FRONTEND_URL` environment variable with your Vercel URL:
```
FRONTEND_URL=https://your-project.vercel.app
```

---

## Option 2: Netlify (Frontend) + Railway (Backend)

### Step 1: Deploy Backend on Railway

1. Go to [railway.app](https://railway.app) and sign up
2. Click **"New Project"** → **"Deploy from GitHub repo"**
3. Select your repository
4. Configure:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`

5. Add Environment Variables (same as Render)
6. Click **"Deploy"**
7. Copy your backend URL from Railway

### Step 2: Deploy Frontend on Netlify

1. Go to [netlify.com](https://netlify.com) and sign up
2. Click **"Add new site"** → **"Import an existing project"**
3. Connect to GitHub and select your repository
4. Configure:
   - **Base directory:** `frontend`
   - **Build command:** `npm run build`
   - **Publish directory:** `frontend/dist`

5. Add Environment Variable:
   ```
   VITE_API_URL=https://your-backend.up.railway.app/api
   ```

6. Click **"Deploy site"**

---

## Option 3: Single Platform (Render for Both)

### Backend
Follow Step 1 from Option 1

### Frontend (Static Site on Render)

1. In Render, click **"New +"** → **"Static Site"**
2. Connect your repository
3. Configure:
   - **Name:** sales-insight-automator
   - **Root Directory:** `frontend`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `frontend/dist`

4. Add Environment Variable:
   ```
   VITE_API_URL=https://sales-insight-automator-api.onrender.com/api
   ```

---

## Environment Variables Summary

### Backend (.env)
```env
PORT=8000
NODE_ENV=production
FRONTEND_URL=https://your-frontend-url.app
BACKEND_URL=https://your-backend-url.app
GEMINI_API_KEY=your_gemini_api_key
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
SMTP_FROM=your_email@gmail.com
```

### Frontend (.env)
```env
VITE_API_URL=https://your-backend-url.app/api
```

---

## Testing Deployment

### Backend Health Check
```bash
curl https://your-backend-url.app/health
```

Should return:
```json
{
  "status": "healthy",
  "timestamp": "2026-03-11T...",
  "version": "1.0.0"
}
```

### Frontend
Visit your frontend URL and test the complete flow:
1. Upload a CSV file
2. Enter an email address
3. Click "Generate & Send Report"
4. Check the email inbox

---

## Troubleshooting

### Backend Issues

**Problem:** 500 errors on API calls
- Check logs in your hosting platform
- Verify all environment variables are set
- Check SMTP credentials

**Problem:** CORS errors
- Ensure `FRONTEND_URL` in backend matches your frontend URL exactly
- No trailing slash in URLs

### Frontend Issues

**Problem:** "Network Error" or failed API calls
- Check `VITE_API_URL` environment variable
- Ensure it includes `/api` at the end
- Backend must be deployed first

**Problem:** Build fails
- Check Node.js version (should be 18+)
- Clear npm cache: `npm cache clean --force`

---

## Free Tier Limits

### Render
- Backend sleeps after 15 minutes of inactivity
- First request after sleep takes ~30 seconds
- 750 hours/month free

### Vercel
- 100 GB bandwidth/month
- Unlimited deployments
- Serverless functions limited to 10 seconds

### Railway
- $5 free credit/month
- ~500 hours of runtime

---

## Recommended: Vercel + Render

✅ **Best for this project:**
- **Frontend:** Vercel (fast, easy, free SSL)
- **Backend:** Render (reliable, easy env vars, auto-deploy)

**Total Cost:** $0/month (free tier)

---

## After Deployment

1. Update README.md with your live URLs
2. Test all endpoints via Swagger docs
3. Send test email to verify SMTP works
4. Monitor logs for any errors

**Live URLs Template:**
```
Frontend: https://sales-insight-automator.vercel.app
Backend: https://sales-insight-automator-api.onrender.com
Swagger: https://sales-insight-automator-api.onrender.com/docs
```
