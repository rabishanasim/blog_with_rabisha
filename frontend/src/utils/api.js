import axios from 'axios'

// Create axios instance with dynamic base URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://rabishablog.netlify.app/.netlify/functions',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Admin Settings API functions
export const adminAPI = {
  // Get admin settings (public)
  getSettings: async () => {
    try {
      const response = await api.get('/admin/settings')
      return response.data
    } catch (error) {
      console.error('Failed to fetch admin settings:', error)
      throw error
    }
  },

  // Update admin settings (admin only)
  updateSettings: async (settingsData) => {
    try {
      const response = await api.put('/admin/settings', settingsData)
      return response.data
    } catch (error) {
      console.error('Failed to update admin settings:', error)
      throw error
    }
  },

  // Reset admin settings to defaults (admin only)
  resetSettings: async () => {
    try {
      const response = await api.post('/admin/settings/reset')
      return response.data
    } catch (error) {
      console.error('Failed to reset admin settings:', error)
      throw error
    }
  }
}

export default api