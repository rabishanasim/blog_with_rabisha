import React, { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'
import toast from 'react-hot-toast'

const PostContext = createContext()

export const usePost = () => {
  const context = useContext(PostContext)
  if (!context) {
    throw new Error('usePost must be used within a PostProvider')
  }
  return context
}

export const PostProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth()
  const [posts, setPosts] = useState(() => {
    const saved = localStorage.getItem('blog_posts')
    return saved ? JSON.parse(saved) : []
  })
  const [isLoading, setIsLoading] = useState(false)

  // Save posts to localStorage whenever posts change
  useEffect(() => {
    localStorage.setItem('blog_posts', JSON.stringify(posts))
  }, [posts])

  // Generate slug from title
  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-')
  }

  // Create a new post
  const createPost = async (postData) => {
    if (!isAuthenticated || !user) {
      toast.error('Please login to create posts')
      return { success: false, message: 'Not authenticated' }
    }

    try {
      setIsLoading(true)

      // Process tags
      const tags = postData.tags 
        ? postData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
        : []

      // Create new post object
      const newPost = {
        _id: `post_${Date.now()}`,
        title: postData.title,
        excerpt: postData.excerpt || postData.content.substring(0, 200) + '...',
        content: postData.content,
        slug: generateSlug(postData.title),
        author: {
          firstName: user.firstName,
          lastName: user.lastName,
          fullName: `${user.firstName} ${user.lastName}`,
          id: user.id,
          avatar: user.avatar
        },
        status: postData.status || 'draft',
        featured: postData.featured || false,
        category: postData.category || null,
        tags: tags,
        publishedAt: postData.status === 'published' ? new Date().toISOString() : null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        views: 0,
        likeCount: 0,
        commentCount: 0,
        readingTime: Math.ceil(postData.content.split(' ').length / 200), // Approximate reading time
        featuredImage: postData.featuredImageUrl || null
      }

      // Add to posts array
      const updatedPosts = [newPost, ...posts]
      setPosts(updatedPosts)

      toast.success('Post created successfully!')
      return { success: true, post: newPost }
    } catch (error) {
      toast.error('Failed to create post')
      return { success: false, message: error.message }
    } finally {
      setIsLoading(false)
    }
  }

  // Update an existing post
  const updatePost = async (postId, postData) => {
    if (!isAuthenticated || !user) {
      toast.error('Please login to update posts')
      return { success: false, message: 'Not authenticated' }
    }

    try {
      setIsLoading(true)

      const postIndex = posts.findIndex(p => p._id === postId)
      if (postIndex === -1) {
        throw new Error('Post not found')
      }

      // Check if user owns the post
      if (posts[postIndex].author.id !== user.id && user.role !== 'admin') {
        throw new Error('Not authorized to edit this post')
      }

      // Process tags
      const tags = postData.tags 
        ? postData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
        : []

      // Update post
      const updatedPost = {
        ...posts[postIndex],
        title: postData.title,
        excerpt: postData.excerpt || postData.content.substring(0, 200) + '...',
        content: postData.content,
        slug: generateSlug(postData.title),
        status: postData.status || posts[postIndex].status,
        featured: postData.featured || false,
        category: postData.category || null,
        tags: tags,
        updatedAt: new Date().toISOString(),
        publishedAt: postData.status === 'published' && !posts[postIndex].publishedAt 
          ? new Date().toISOString() 
          : posts[postIndex].publishedAt,
        readingTime: Math.ceil(postData.content.split(' ').length / 200),
        featuredImage: postData.featuredImageUrl || posts[postIndex].featuredImage
      }

      const updatedPosts = [...posts]
      updatedPosts[postIndex] = updatedPost
      setPosts(updatedPosts)

      toast.success('Post updated successfully!')
      return { success: true, post: updatedPost }
    } catch (error) {
      toast.error(error.message || 'Failed to update post')
      return { success: false, message: error.message }
    } finally {
      setIsLoading(false)
    }
  }

  // Delete a post
  const deletePost = async (postId) => {
    if (!isAuthenticated || !user) {
      toast.error('Please login to delete posts')
      return { success: false, message: 'Not authenticated' }
    }

    try {
      const post = posts.find(p => p._id === postId)
      if (!post) {
        throw new Error('Post not found')
      }

      // Check if user owns the post
      if (post.author.id !== user.id && user.role !== 'admin') {
        throw new Error('Not authorized to delete this post')
      }

      const updatedPosts = posts.filter(p => p._id !== postId)
      setPosts(updatedPosts)

      toast.success('Post deleted successfully!')
      return { success: true }
    } catch (error) {
      toast.error(error.message || 'Failed to delete post')
      return { success: false, message: error.message }
    }
  }

  // Get posts with filtering and pagination
  const getPosts = (options = {}) => {
    const {
      page = 1,
      limit = 9,
      status = 'published',
      author = null,
      category = null,
      search = null,
      featured = null
    } = options

    let filteredPosts = [...posts]

    // Filter by status
    if (status) {
      filteredPosts = filteredPosts.filter(post => post.status === status)
    }

    // Filter by author
    if (author) {
      filteredPosts = filteredPosts.filter(post => post.author.id === author)
    }

    // Filter by category
    if (category) {
      filteredPosts = filteredPosts.filter(post => post.category === category)
    }

    // Filter by search term
    if (search) {
      const searchLower = search.toLowerCase()
      filteredPosts = filteredPosts.filter(post => 
        post.title.toLowerCase().includes(searchLower) ||
        post.excerpt.toLowerCase().includes(searchLower) ||
        post.content.toLowerCase().includes(searchLower) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchLower))
      )
    }

    // Filter by featured
    if (featured !== null) {
      filteredPosts = filteredPosts.filter(post => post.featured === featured)
    }

    // Sort by date (newest first)
    filteredPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

    // Paginate
    const totalPosts = filteredPosts.length
    const totalPages = Math.ceil(totalPosts / limit)
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedPosts = filteredPosts.slice(startIndex, endIndex)

    return {
      posts: paginatedPosts,
      pagination: {
        current: page,
        total: totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
        totalPosts
      }
    }
  }

  // Get a single post by slug or ID
  const getPost = (slugOrId) => {
    return posts.find(post => post.slug === slugOrId || post._id === slugOrId)
  }

  // Get user's posts
  const getUserPosts = (userId = user?.id, status = null) => {
    if (!userId) return []
    
    let userPosts = posts.filter(post => post.author.id === userId)
    
    if (status) {
      userPosts = userPosts.filter(post => post.status === status)
    }
    
    return userPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }

  const value = {
    posts,
    isLoading,
    createPost,
    updatePost,
    deletePost,
    getPosts,
    getPost,
    getUserPosts
  }

  return (
    <PostContext.Provider value={value}>
      {children}
    </PostContext.Provider>
  )
}