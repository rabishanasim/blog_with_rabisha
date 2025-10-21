const mongoose = require('mongoose')

// Simple health check function
exports.handler = async (event, context) => {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': process.env.FRONTEND_URL || 'https://blog-with-rabisha2025.vercel.app',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Content-Type': 'application/json'
  }

  // Handle OPTIONS requests for CORS
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    }
  }

  try {
    // Connect to MongoDB if not connected
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI)
    }

    // Health check endpoint
    if (event.path === '/api/health' || event.path.endsWith('/health')) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          status: 'OK',
          message: 'Blog Platform API is running',
          timestamp: new Date().toISOString(),
          mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
        })
      }
    }

    // Basic API response for other endpoints
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        message: 'Blog Platform API',
        endpoints: ['/api/health'],
        status: 'Working'
      })
    }

  } catch (error) {
    console.error('Function error:', error)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Internal server error',
        message: error.message
      })
    }
  }
}