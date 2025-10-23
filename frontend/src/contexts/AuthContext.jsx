import React, { createContext, useContext, useReducer, useEffect } from 'react'
import api from '../utils/api'
import toast from 'react-hot-toast'

const AuthContext = createContext()

const authReducer = (state, action) => {
  switch (action.type) {
    case 'AUTH_START':
      return { ...state, loading: true, error: null }
    case 'AUTH_SUCCESS':
      return {
        ...state,
        loading: false,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        error: null
      }
    case 'AUTH_FAILURE':
      return {
        ...state,
        loading: false,
        user: null,
        token: null,
        isAuthenticated: false,
        error: action.payload
      }
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: null
      }
    case 'UPDATE_USER':
      return {
        ...state,
        user: { ...state.user, ...action.payload }
      }
    default:
      return state
  }
}

const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  loading: true,
  error: null
}

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)

  // Check if user is logged in on app start
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token')
      if (token) {
        try {
          // Try API first
          const response = await api.get('/auth/me')
          dispatch({
            type: 'AUTH_SUCCESS',
            payload: {
              user: response.data.user,
              token
            }
          })
        } catch (error) {
          // If API fails, check for demo account
          if (token.startsWith('demo_token_')) {
            const storedUser = localStorage.getItem('user')
            if (storedUser) {
              try {
                const user = JSON.parse(storedUser)
                dispatch({
                  type: 'AUTH_SUCCESS',
                  payload: { user, token }
                })
                return
              } catch (parseError) {
                console.error('Error parsing stored user:', parseError)
              }
            }
          }

          // Clear invalid session
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          dispatch({ type: 'AUTH_FAILURE', payload: 'Session expired' })
        }
      } else {
        dispatch({ type: 'AUTH_FAILURE', payload: null })
      }
    }

    checkAuth()
  }, [])

  const login = async (credentials) => {
    try {
      dispatch({ type: 'AUTH_START' })

      // Try the API first
      try {
        const response = await api.post('/auth/login', credentials)
        const { token, user } = response.data

        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(user))

        dispatch({
          type: 'AUTH_SUCCESS',
          payload: { user, token }
        })

        toast.success('Login successful!')
        return { success: true, user }
      } catch (apiError) {
        // If API fails, check for demo accounts or predefined accounts
        console.log('API login failed, checking demo accounts')

        const demoUsers = JSON.parse(localStorage.getItem('demo_users') || '[]')

        // Add predefined demo accounts
        const predefinedUsers = [
          {
            id: 'admin_1',
            email: 'admin@example.com',
            password: 'admin123',
            firstName: 'Admin',
            lastName: 'User',
            username: 'admin',
            role: 'admin',
            bio: 'Platform Administrator'
          },
          {
            id: 'user_1',
            email: 'user@example.com',
            password: 'user123',
            firstName: 'Demo',
            lastName: 'User',
            username: 'demouser',
            role: 'user',
            bio: 'Demo user account'
          }
        ]

        const allUsers = [...predefinedUsers, ...demoUsers]
        const user = allUsers.find(u =>
          u.email === credentials.email &&
          (u.password === credentials.password || !u.password) // Allow login for demo accounts without password
        )

        if (!user) {
          throw new Error('Invalid email or password')
        }

        // Remove password from user object before storing
        const { password, ...userWithoutPassword } = user
        const demoToken = `demo_token_${user.id}`

        localStorage.setItem('token', demoToken)
        localStorage.setItem('user', JSON.stringify(userWithoutPassword))

        dispatch({
          type: 'AUTH_SUCCESS',
          payload: { user: userWithoutPassword, token: demoToken }
        })

        toast.success('Login successful! (Demo mode - backend not connected)')
        return { success: true, user: userWithoutPassword }
      }
    } catch (error) {
      const message = error.message || 'Login failed'
      dispatch({ type: 'AUTH_FAILURE', payload: message })
      toast.error(message)
      return { success: false, message }
    }
  }

  const register = async (userData) => {
    try {
      dispatch({ type: 'AUTH_START' })

      // Try the API first
      try {
        const response = await api.post('/auth/register', userData)
        const { token, user } = response.data

        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(user))

        dispatch({
          type: 'AUTH_SUCCESS',
          payload: { user, token }
        })

        toast.success('Registration successful!')
        return { success: true, user }
      } catch (apiError) {
        // If API fails, create a demo account locally
        console.log('API registration failed, creating demo account locally')

        // Check if user already exists locally
        const existingUsers = JSON.parse(localStorage.getItem('demo_users') || '[]')
        const userExists = existingUsers.find(u => u.email === userData.email)

        if (userExists) {
          throw new Error('User with this email already exists')
        }

        // Create demo user
        const demoUser = {
          id: Date.now().toString(),
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          username: userData.username || userData.email.split('@')[0],
          bio: userData.bio || '',
          role: 'user',
          createdAt: new Date().toISOString(),
          avatar: null
        }

        const demoToken = `demo_token_${demoUser.id}`

        // Store demo user
        existingUsers.push(demoUser)
        localStorage.setItem('demo_users', JSON.stringify(existingUsers))
        localStorage.setItem('token', demoToken)
        localStorage.setItem('user', JSON.stringify(demoUser))

        dispatch({
          type: 'AUTH_SUCCESS',
          payload: { user: demoUser, token: demoToken }
        })

        toast.success('Account created successfully! (Demo mode - backend not connected)')
        return { success: true, user: demoUser }
      }
    } catch (error) {
      const message = error.message || 'Registration failed'
      dispatch({ type: 'AUTH_FAILURE', payload: message })
      toast.error(message)
      return { success: false, message }
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    dispatch({ type: 'LOGOUT' })
    toast.success('Logged out successfully')
  }

  const updateProfile = async (profileData) => {
    try {
      const response = await api.put('/auth/profile', profileData)
      dispatch({ type: 'UPDATE_USER', payload: response.data.user })
      toast.success('Profile updated successfully!')
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || 'Update failed'
      toast.error(message)
      return { success: false, message }
    }
  }

  const value = {
    ...state,
    login,
    register,
    logout,
    updateProfile,
    isAdmin: state.user?.role === 'admin'
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}