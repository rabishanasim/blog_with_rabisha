# MongoDB Atlas Setup Guide

## 1. Create MongoDB Atlas Account

1. **Go to**: https://www.mongodb.com/cloud/atlas
2. **Sign up** for free account
3. **Verify your email**

## 2. Create Cluster

1. **Click "Create"** → "Shared Cluster" (Free)
2. **Choose Cloud Provider**: AWS
3. **Choose Region**: Closest to your users
4. **Cluster Name**: `blog-platform-cluster`
5. **Click "Create Cluster"** (takes 5-10 minutes)

## 3. Create Database User

1. **Go to "Database Access"** (left sidebar)
2. **Click "Add New Database User"**
3. **Username**: `bloguser`
4. **Password**: `Generate strong password` (save it!)
5. **Database User Privileges**: `Read and write to any database`
6. **Click "Add User"**

## 4. Setup Network Access

1. **Go to "Network Access"** (left sidebar) 
2. **Click "Add IP Address"**
3. **Click "Allow Access from Anywhere"** (0.0.0.0/0)
4. **Click "Confirm"**

## 5. Get Connection String

1. **Go to "Clusters"** (left sidebar)
2. **Click "Connect"** on your cluster
3. **Choose "Connect your application"**
4. **Copy the connection string**:
   ```
   mongodb+srv://bloguser:<password>@blog-platform-cluster.xxxxx.mongodb.net/blog-platform?retryWrites=true&w=majority
   ```
5. **Replace `<password>`** with your actual password

## 6. Save Connection String

Keep this connection string safe - you'll need it for deployment!

Example:
```
mongodb+srv://bloguser:YourPassword123@blog-platform-cluster.xxxxx.mongodb.net/blog-platform?retryWrites=true&w=majority
```