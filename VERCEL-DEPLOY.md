# Vercel Frontend Deployment Guide

## 1. Setup Vercel Account

1. **Go to**: https://vercel.com
2. **Sign up** with GitHub account  
3. **Authorize Vercel** to access your repositories

## 2. Import Project

1. **Click "New Project"**
2. **Import Git Repository**
3. **Select**: `Personal-Blog-Platform`
4. **Click "Import"**

## 3. Configure Project Settings

1. **Project Name**: `personal-blog-platform` 
2. **Framework Preset**: `Vite` (should auto-detect)
3. **Root Directory**: `frontend` ← **IMPORTANT!**
4. **Build Command**: `npm run build`
5. **Output Directory**: `dist`
6. **Install Command**: `npm install`

## 4. Environment Variables

**Click "Environment Variables"** and add:

```
VITE_API_URL=https://your-railway-backend-url.railway.app/api
VITE_APP_NAME=Personal Blog Platform
VITE_APP_DESCRIPTION=A modern blog platform for sharing your thoughts
```

**Replace** `your-railway-backend-url` with your actual Railway URL from previous step!

## 5. Deploy

1. **Click "Deploy"**
2. **Wait for build** (2-3 minutes)
3. **Get your live URL**: `https://personal-blog-platform-xxx.vercel.app`

## 6. Update Backend CORS

**Important**: Go back to Railway and update the `FRONTEND_URL` environment variable:

```
FRONTEND_URL=https://your-actual-vercel-url.vercel.app
```

## 7. Test Your Live Blog!

1. **Visit your Vercel URL**
2. **Register a new account**
3. **Login successfully**  
4. **Create your first blog post**
5. **Share the URL** with friends!

## 🎉 Your Blog Platform is LIVE!

**Frontend**: `https://your-blog.vercel.app`
**Backend**: `https://your-api.railway.app`

**Total deployment time**: ~15-20 minutes