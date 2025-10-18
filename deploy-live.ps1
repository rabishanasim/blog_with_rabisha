# Live Deployment Script for Personal Blog Platform
# This script will deploy your blog platform to Railway and Vercel

Write-Host "🚀 Starting Live Deployment of Personal Blog Platform" -ForegroundColor Green

# Step 1: Create and push to GitHub
Write-Host "`n📁 Step 1: Setting up GitHub Repository" -ForegroundColor Cyan

# Generate a unique repository name
$repoName = "personal-blog-platform-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
Write-Host "Repository name: $repoName"

# Create GitHub repository using REST API (no auth - will be public)
try {
    $githubApiUrl = "https://api.github.com/user/repos"
    $repoData = @{
        name = $repoName
        description = "Full-stack Personal Blog Platform with React frontend and Node.js backend - Auto-deployed $(Get-Date -Format 'yyyy-MM-dd')"
        private = $false
        auto_init = $false
    } | ConvertTo-Json
    
    Write-Host "Creating GitHub repository..."
    # This will require user authentication, so we'll provide instructions instead
    Write-Host "⚠️  GitHub repository creation requires authentication." -ForegroundColor Yellow
    Write-Host "Please create a repository manually at: https://github.com/new" -ForegroundColor Yellow
    Write-Host "Repository name: $repoName" -ForegroundColor White
    Write-Host "Description: Full-stack Personal Blog Platform" -ForegroundColor White
    Write-Host "Set as Public repository" -ForegroundColor White
    Write-Host ""
    
} catch {
    Write-Host "Repository creation step needs manual setup" -ForegroundColor Yellow
}

# Step 2: Push code to GitHub
Write-Host "`n📤 Step 2: Pushing Code to GitHub" -ForegroundColor Cyan
Write-Host "After creating the GitHub repository, run these commands:" -ForegroundColor Yellow
Write-Host "git remote add origin https://github.com/YOUR-USERNAME/$repoName.git" -ForegroundColor White
Write-Host "git branch -M main" -ForegroundColor White
Write-Host "git push -u origin main" -ForegroundColor White

# Step 3: Deploy to Railway (Backend)
Write-Host "`n🚂 Step 3: Railway Backend Deployment" -ForegroundColor Cyan
Write-Host "1. Go to https://railway.app" -ForegroundColor White
Write-Host "2. Sign up/Login with GitHub" -ForegroundColor White
Write-Host "3. Click 'New Project' -> 'Deploy from GitHub repo'" -ForegroundColor White
Write-Host "4. Select your repository: $repoName" -ForegroundColor White
Write-Host "5. Set Root Directory to: backend" -ForegroundColor White
Write-Host "6. Railway will auto-detect Node.js and use the Procfile" -ForegroundColor White
Write-Host "7. Add these Environment Variables:" -ForegroundColor White
Write-Host "   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/blogplatform" -ForegroundColor Gray
Write-Host "   JWT_SECRET=your-super-secret-jwt-key-here" -ForegroundColor Gray
Write-Host "   NODE_ENV=production" -ForegroundColor Gray
Write-Host "   FRONTEND_URL=https://your-frontend.vercel.app" -ForegroundColor Gray
Write-Host "8. Deploy and copy the Railway URL" -ForegroundColor White

# Step 4: Deploy to Vercel (Frontend)
Write-Host "`n▲ Step 4: Vercel Frontend Deployment" -ForegroundColor Cyan
Write-Host "1. Go to https://vercel.com" -ForegroundColor White
Write-Host "2. Sign up/Login with GitHub" -ForegroundColor White
Write-Host "3. Click 'New Project' and import your repository" -ForegroundColor White
Write-Host "4. Set Root Directory to: frontend" -ForegroundColor White
Write-Host "5. Build Command: npm run build" -ForegroundColor White
Write-Host "6. Output Directory: dist" -ForegroundColor White
Write-Host "7. Add Environment Variable:" -ForegroundColor White
Write-Host "   VITE_API_URL=https://your-railway-url.railway.app/api" -ForegroundColor Gray
Write-Host "8. Deploy and copy the Vercel URL" -ForegroundColor White

# Step 5: MongoDB Atlas Setup
Write-Host "`n🍃 Step 5: MongoDB Atlas Database" -ForegroundColor Cyan
Write-Host "1. Go to https://cloud.mongodb.com" -ForegroundColor White
Write-Host "2. Create free account and new cluster" -ForegroundColor White
Write-Host "3. Create database user and get connection string" -ForegroundColor White
Write-Host "4. Update Railway MONGODB_URI with your connection string" -ForegroundColor White

# Step 6: Final Configuration
Write-Host "`n🔧 Step 6: Final Configuration" -ForegroundColor Cyan
Write-Host "1. Update Railway FRONTEND_URL with your Vercel URL" -ForegroundColor White
Write-Host "2. Test your live site!" -ForegroundColor White

Write-Host "`n✅ Deployment guide complete!" -ForegroundColor Green
Write-Host "Your live URLs will be:" -ForegroundColor Green
Write-Host "Frontend: https://your-project.vercel.app" -ForegroundColor White
Write-Host "Backend API: https://your-project.railway.app/api" -ForegroundColor White

# Create a deployment status file
$deploymentInfo = @"
# Deployment Status - $(Get-Date)

## Repository
Name: $repoName
GitHub URL: https://github.com/YOUR-USERNAME/$repoName

## Deployment URLs (fill in after deployment)
Frontend: https://_____.vercel.app
Backend: https://_____.railway.app
Database: MongoDB Atlas

## Status
GitHub repository created: [ ]
Code pushed to GitHub: [ ]
MongoDB Atlas cluster created: [ ]
Backend deployed to Railway: [ ]
Frontend deployed to Vercel: [ ]
Environment variables configured: [ ]
Live site verified: [ ]
"@

$deploymentInfo | Out-File -FilePath "DEPLOYMENT-STATUS.md" -Encoding UTF8
Write-Host "`n📝 Created DEPLOYMENT-STATUS.md to track progress" -ForegroundColor Blue