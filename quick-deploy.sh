#!/bin/bash

# Quick deployment script for Personal Blog Platform
echo "🚀 Personal Blog Platform - Live Deployment"
echo "============================================"

# Generate unique repository name
REPO_NAME="personal-blog-platform-$(date +%Y%m%d-%H%M%S)"
echo "Repository name: $REPO_NAME"

echo ""
echo "📋 STEP-BY-STEP DEPLOYMENT INSTRUCTIONS"
echo "========================================"

echo ""
echo "1️⃣ CREATE GITHUB REPOSITORY"
echo "----------------------------"
echo "🌐 Go to: https://github.com/new"
echo "📝 Repository name: $REPO_NAME"
echo "📄 Description: Full-stack Personal Blog Platform"
echo "🔓 Set as: Public"
echo "❌ Don't initialize with README"
echo ""

echo "2️⃣ PUSH CODE TO GITHUB"
echo "----------------------"
echo "git remote add origin https://github.com/YOUR-USERNAME/$REPO_NAME.git"
echo "git branch -M main"
echo "git push -u origin main"
echo ""

echo "3️⃣ DEPLOY BACKEND TO RAILWAY"
echo "----------------------------"
echo "🌐 Go to: https://railway.app"
echo "🔗 Sign in with GitHub"
echo "➕ New Project → Deploy from GitHub repo"
echo "📁 Select: $REPO_NAME"
echo "📂 Root Directory: backend"
echo ""
echo "🔧 Environment Variables:"
echo "MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/blogplatform"
echo "JWT_SECRET=$(openssl rand -base64 32 2>/dev/null || echo 'your-jwt-secret-key-here')"
echo "NODE_ENV=production"
echo "FRONTEND_URL=https://your-frontend.vercel.app"
echo ""

echo "4️⃣ DEPLOY FRONTEND TO VERCEL"
echo "-----------------------------"
echo "🌐 Go to: https://vercel.com"
echo "🔗 Sign in with GitHub"
echo "➕ New Project → Import from GitHub"
echo "📁 Select: $REPO_NAME"
echo "📂 Root Directory: frontend"
echo "🔨 Build Command: npm run build"
echo "📁 Output Directory: dist"
echo ""
echo "🔧 Environment Variables:"
echo "VITE_API_URL=https://your-railway-url.railway.app/api"
echo ""

echo "5️⃣ SETUP MONGODB ATLAS"
echo "----------------------"
echo "🌐 Go to: https://cloud.mongodb.com"
echo "➕ Create free cluster"
echo "👤 Create database user"
echo "🔗 Get connection string"
echo "🔄 Update Railway MONGODB_URI"
echo ""

echo "6️⃣ FINAL CONFIGURATION"
echo "----------------------"
echo "🔄 Update Railway FRONTEND_URL with Vercel URL"
echo "🧪 Test live site"
echo ""

echo "✅ YOUR LIVE URLS WILL BE:"
echo "Frontend: https://your-project.vercel.app"
echo "Backend: https://your-project.railway.app/api"
echo ""

# Save deployment info
cat > DEPLOYMENT-INFO.txt << EOF
Personal Blog Platform - Deployment Information
Generated: $(date)

Repository Name: $REPO_NAME
GitHub URL: https://github.com/YOUR-USERNAME/$REPO_NAME

Deployment Steps:
1. Create GitHub repo: https://github.com/new
2. Push code: git push origin main  
3. Deploy backend: https://railway.app
4. Deploy frontend: https://vercel.com
5. Setup database: https://cloud.mongodb.com

Live URLs (fill after deployment):
Frontend: https://_____.vercel.app
Backend: https://_____.railway.app
EOF

echo "📝 Saved deployment info to: DEPLOYMENT-INFO.txt"