const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const serverless = require('serverless-http')

// Import routes
const authRoutes = require('../../backend/routes/auth')
const postRoutes = require('../../backend/routes/posts')
const userRoutes = require('../../backend/routes/users')
const categoryRoutes = require('../../backend/routes/categories')
const commentRoutes = require('../../backend/routes/comments')

const app = express()

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'https://blog-with-rabisha2025.vercel.app',
  credentials: true
}))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Connect to MongoDB
if (!mongoose.connections[0].readyState) {
  mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/blogplatform')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err))
}

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK',
    message: 'Blog Platform API is running',
    timestamp: new Date().toISOString()
  })
})

// Routes
app.use('/auth', authRoutes)
app.use('/posts', postRoutes)
app.use('/users', userRoutes)
app.use('/categories', categoryRoutes)
app.use('/comments', commentRoutes)

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'API endpoint not found' })
})

module.exports.handler = serverless(app)