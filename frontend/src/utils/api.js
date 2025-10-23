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

// User Content API functions
export const userContentAPI = {
  // Get all published user content (public)
  getContent: async (params = {}) => {
    try {
      const response = await api.get('/user-content', { params })
      return response.data
    } catch (error) {
      console.error('Failed to fetch user content:', error)
      throw error
    }
  },

  // Get single content by slug
  getContentBySlug: async (slug) => {
    try {
      const response = await api.get(`/user-content/${slug}`)
      return response.data
    } catch (error) {
      console.error('Failed to fetch content:', error)
      throw error
    }
  },

  // Create new user content
  createContent: async (formData) => {
    try {
      const response = await api.post('/user-content', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      return response.data
    } catch (error) {
      console.error('Failed to create content:', error)
      throw error
    }
  },

  // Get current user's content
  getMyContent: async (params = {}) => {
    try {
      const response = await api.get('/user-content/my/content', { params })
      return response.data
    } catch (error) {
      console.error('Failed to fetch my content:', error)
      throw error
    }
  },

  // Update content
  updateContent: async (id, updateData) => {
    try {
      const response = await api.put(`/user-content/${id}`, updateData)
      return response.data
    } catch (error) {
      console.error('Failed to update content:', error)
      throw error
    }
  },

  // Delete content
  deleteContent: async (id) => {
    try {
      const response = await api.delete(`/user-content/${id}`)
      return response.data
    } catch (error) {
      console.error('Failed to delete content:', error)
      throw error
    }
  },

  // Toggle like
  toggleLike: async (id) => {
    try {
      const response = await api.post(`/user-content/${id}/like`)
      return response.data
    } catch (error) {
      console.error('Failed to toggle like:', error)
      throw error
    }
  },

  // Add comment
  addComment: async (id, content) => {
    try {
      const response = await api.post(`/user-content/${id}/comment`, { content })
      return response.data
    } catch (error) {
      console.error('Failed to add comment:', error)
      throw error
    }
  }
}

// Content Moderation API functions (Admin only)
export const moderationAPI = {
  // Get pending content
  getPendingContent: async () => {
    try {
      const response = await api.get('/admin/content/pending')
      return response.data
    } catch (error) {
      console.error('Failed to fetch pending content:', error)
      throw error
    }
  },

  // Approve content
  approveContent: async (id, notes = '', featured = false) => {
    try {
      const response = await api.put(`/admin/content/${id}/approve`, { notes, featured })
      return response.data
    } catch (error) {
      console.error('Failed to approve content:', error)
      throw error
    }
  },

  // Reject content
  rejectContent: async (id, notes) => {
    try {
      const response = await api.put(`/admin/content/${id}/reject`, { notes })
      return response.data
    } catch (error) {
      console.error('Failed to reject content:', error)
      throw error
    }
  },

  // Get moderation stats
  getStats: async () => {
    try {
      const response = await api.get('/admin/content/stats')
      return response.data
    } catch (error) {
      console.error('Failed to fetch moderation stats:', error)
      throw error
    }
  }
}

export default api