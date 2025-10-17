# Railway Backend Deployment Guide

## 1. Setup Railway Account

1. **Go to**: https://railway.app
2. **Sign up** with GitHub account
3. **Authorize Railway** to access your repositories

## 2. Deploy Backend

1. **Click "New Project"**
2. **Choose "Deploy from GitHub repo"**
3. **Select your repository**: `Personal-Blog-Platform`
4. **Choose service to deploy**: Select the **root folder** (it will detect the backend)
5. **Click "Deploy"**

## 3. Configure Environment Variables

1. **Go to your project** → **Variables tab**
2. **Add these environment variables**:

```
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://bloguser:YourPassword123@blog-platform-cluster.xxxxx.mongodb.net/blog-platform?retryWrites=true&w=majority
JWT_SECRET=super-secure-jwt-secret-change-this-xyz789-random-string
JWT_EXPIRE=30d
FRONTEND_URL=https://your-frontend-url.vercel.app
MAX_FILE_SIZE=5000000
BCRYPT_ROUNDS=12
```

3. **Replace**:
   - `MONGODB_URI`: Your actual MongoDB Atlas connection string
   - `JWT_SECRET`: Generate a random 32+ character string
   - `FRONTEND_URL`: Will be updated after frontend deployment

## 4. Set Root Directory (Important!)

1. **Go to Settings** → **Source**
2. **Root Directory**: Set to `backend`
3. **Build Command**: (leave empty)
4. **Start Command**: `node server.js`

## 5. Deploy & Get URL

1. **Railway will auto-deploy**
2. **Copy your Railway URL**: `https://personal-blog-platform-production-xxxx.up.railway.app`
3. **Save this URL** - you'll need it for frontend deployment!

## 6. Test Backend

Visit: `https://your-railway-url.railway.app/api/health`

You should see:
```json
{
  "status": "OK",
  "message": "Blog Platform API is running",
  "timestamp": "2025-10-18T..."
}
```

If successful, your backend is live! 🎉