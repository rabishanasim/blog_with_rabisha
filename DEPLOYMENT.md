# Personal Blog Platform - Deployment Guide

## 🚀 **Quick Deploy (Recommended)**

### **Option 1: One-Click Deploy**

**Frontend (Vercel):**
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR-USERNAME/Personal-Blog-Platform&project-name=personal-blog-platform&repository-name=Personal-Blog-Platform&env=VITE_API_URL&envDescription=Backend%20API%20URL&envLink=https://personal-blog-platform.railway.app/api)

**Backend (Railway):**
[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template?template=https://github.com/YOUR-USERNAME/Personal-Blog-Platform&plugins=mongodb&envs=JWT_SECRET,MONGODB_URI,FRONTEND_URL&optionalEnvs=NODE_ENV,BCRYPT_ROUNDS&JWT_SECRETDesc=JWT%20Secret%20Key&MONGODB_URIDesc=MongoDB%20Connection%20String&FRONTEND_URLDesc=Frontend%20URL)

---

## 🛠️ **Manual Deployment Steps**

### **Step 1: Prepare Database (MongoDB Atlas)**

1. **Sign up** at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. **Create a cluster** (free tier available)
3. **Create database user** with username/password
4. **Get connection string**: `mongodb+srv://username:password@cluster.mongodb.net/blog-platform`
5. **Whitelist IP**: Allow access from anywhere (0.0.0.0/0)

### **Step 2: Deploy Backend (Railway)**

1. **Sign up** at [Railway](https://railway.app)
2. **Create new project** from GitHub repo
3. **Add environment variables**:
   ```
   NODE_ENV=production
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/blog-platform
   JWT_SECRET=your-super-secret-jwt-key-change-this-random-xyz789
   FRONTEND_URL=https://your-frontend.vercel.app
   PORT=5000
   ```
4. **Deploy** - Railway will auto-deploy from your repo
5. **Note the URL**: `https://your-backend.railway.app`

### **Step 3: Deploy Frontend (Vercel)**

1. **Sign up** at [Vercel](https://vercel.com)
2. **Import GitHub project**
3. **Set Root Directory**: `frontend`
4. **Add environment variables**:
   ```
   VITE_API_URL=https://your-backend.railway.app/api
   ```
5. **Deploy** - Vercel will build and deploy automatically
6. **Note the URL**: `https://your-frontend.vercel.app`

### **Step 4: Update CORS Settings**

1. **Update backend environment** with actual frontend URL:
   ```
   FRONTEND_URL=https://your-actual-frontend.vercel.app
   ```
2. **Redeploy backend** on Railway

---

## 🔧 **Environment Variables Setup**

### **Backend (.env.production)**
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/blog-platform
JWT_SECRET=your-super-secret-jwt-key-change-this-random-xyz789
JWT_EXPIRE=30d
FRONTEND_URL=https://your-frontend.vercel.app
MAX_FILE_SIZE=5000000
BCRYPT_ROUNDS=12
```

### **Frontend (.env.production)**
```env
VITE_API_URL=https://your-backend.railway.app/api
VITE_APP_NAME=Personal Blog Platform
```

---

## 📋 **Post-Deployment Checklist**

- [ ] **Test Registration**: Create a new account
- [ ] **Test Login**: Login with created account  
- [ ] **Test Post Creation**: Create a blog post
- [ ] **Test File Upload**: Upload a featured image
- [ ] **Test Comments**: Add comments to posts
- [ ] **Create Admin User**: Set first user as admin in MongoDB
- [ ] **Test Admin Features**: Access admin dashboard

---

## 🌐 **Your Live URLs**

After deployment, your blog platform will be available at:

- **Frontend**: `https://your-blog.vercel.app`
- **Backend API**: `https://your-api.railway.app`
- **Admin Dashboard**: `https://your-blog.vercel.app/dashboard`

---

## 🔑 **Default Admin Setup**

1. **Register first user** on your live site
2. **Connect to MongoDB Atlas**
3. **Find your user** in the `users` collection  
4. **Change role field** from "user" to "admin"
5. **Refresh and login** - you now have admin access!

---

## 🎉 **You're Live!**

Your blog platform is now publicly accessible! Share your URL with others so they can:

- **Read your blog posts**
- **Register their own accounts** 
- **Create their own content**
- **Comment and engage**

**Happy blogging!** 🚀