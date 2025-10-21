import React, { createContext, useContext, useState, useCallback } from 'react'
import { useAuth } from './AuthContext'
import api from '../utils/api'
import toast from 'react-hot-toast'

const PostInteractionContext = createContext()

export const usePostInteraction = () => {
  const context = useContext(PostInteractionContext)
  if (!context) {
    throw new Error('usePostInteraction must be used within a PostInteractionProvider')
  }
  return context
}

export const PostInteractionProvider = ({ children }) => {
  const { isAuthenticated, user } = useAuth()
  const [likedPosts, setLikedPosts] = useState(new Set())
  const [postStats, setPostStats] = useState(new Map())

  // Initialize post stats
  const initializePostStats = useCallback((posts) => {
    const newStats = new Map()
    posts.forEach(post => {
      newStats.set(post._id || post.id, {
        likes: post.likeCount || 0,
        comments: post.commentCount || 0,
        views: post.views || 0,
        isLiked: post.isLiked || false
      })
      if (post.isLiked) {
        setLikedPosts(prev => new Set([...prev, post._id || post.id]))
      }
    })
    setPostStats(prev => new Map([...prev, ...newStats]))
  }, [])

  // Simulate API calls for demo (replace with real API calls when backend is ready)
  const toggleLike = useCallback(async (postId) => {
    if (!isAuthenticated) {
      toast.error('Please login to like posts')
      return false
    }

    try {
      const currentStats = postStats.get(postId) || { likes: 0, comments: 0, views: 0, isLiked: false }
      const wasLiked = likedPosts.has(postId)
      
      // Optimistic update
      const newLikeCount = wasLiked ? currentStats.likes - 1 : currentStats.likes + 1
      const newLikedPosts = new Set(likedPosts)
      
      if (wasLiked) {
        newLikedPosts.delete(postId)
      } else {
        newLikedPosts.add(postId)
      }
      
      setLikedPosts(newLikedPosts)
      setPostStats(prev => new Map(prev.set(postId, {
        ...currentStats,
        likes: newLikeCount,
        isLiked: !wasLiked
      })))

      // Simulate API call
      setTimeout(() => {
        toast.success(wasLiked ? 'Post unliked' : 'Post liked!')
      }, 300)

      // TODO: Replace with actual API call
      // await api.post(`/posts/${postId}/like`)
      
      return !wasLiked
    } catch (error) {
      // Revert optimistic update on error
      const currentStats = postStats.get(postId) || { likes: 0, comments: 0, views: 0, isLiked: false }
      const wasLiked = likedPosts.has(postId)
      
      setPostStats(prev => new Map(prev.set(postId, currentStats)))
      toast.error('Failed to update like status')
      return false
    }
  }, [isAuthenticated, likedPosts, postStats])

  const incrementViewCount = useCallback(async (postId) => {
    try {
      const currentStats = postStats.get(postId) || { likes: 0, comments: 0, views: 0, isLiked: false }
      
      setPostStats(prev => new Map(prev.set(postId, {
        ...currentStats,
        views: currentStats.views + 1
      })))

      // TODO: Replace with actual API call
      // await api.post(`/posts/${postId}/view`)
      
    } catch (error) {
      console.error('Failed to increment view count:', error)
    }
  }, [postStats])

  const addComment = useCallback(async (postId, commentText) => {
    if (!isAuthenticated) {
      toast.error('Please login to comment')
      return false
    }

    if (!commentText.trim()) {
      toast.error('Comment cannot be empty')
      return false
    }

    try {
      const currentStats = postStats.get(postId) || { likes: 0, comments: 0, views: 0, isLiked: false }
      
      // Optimistic update
      setPostStats(prev => new Map(prev.set(postId, {
        ...currentStats,
        comments: currentStats.comments + 1
      })))

      toast.success('Comment added!')
      
      // TODO: Replace with actual API call
      // const response = await api.post(`/posts/${postId}/comments`, { text: commentText })
      
      return true
    } catch (error) {
      // Revert optimistic update
      const currentStats = postStats.get(postId) || { likes: 0, comments: 0, views: 0, isLiked: false }
      setPostStats(prev => new Map(prev.set(postId, {
        ...currentStats,
        comments: Math.max(0, currentStats.comments - 1)
      })))
      toast.error('Failed to add comment')
      return false
    }
  }, [isAuthenticated, postStats])

  const getPostStats = useCallback((postId) => {
    return postStats.get(postId) || { likes: 0, comments: 0, views: 0, isLiked: false }
  }, [postStats])

  const isPostLiked = useCallback((postId) => {
    return likedPosts.has(postId)
  }, [likedPosts])

  const value = {
    toggleLike,
    incrementViewCount,
    addComment,
    getPostStats,
    isPostLiked,
    initializePostStats,
    postStats,
    likedPosts
  }

  return (
    <PostInteractionContext.Provider value={value}>
      {children}
    </PostInteractionContext.Provider>
  )
}