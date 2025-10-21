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
    const saved = localStorage.getItem('demo_posts')
    if (saved) {
      return JSON.parse(saved)
    } else {
      // Initialize with some demo posts
      const demoPosts = [
        {
          _id: 'demo_1',
          title: 'Welcome to Your New Blog Platform!',
          excerpt: 'Discover all the amazing features of this modern blogging platform and start sharing your stories with the world.',
          content: `# Welcome to Your New Blog Platform!

We're excited to have you join our community of writers and creators. This platform is designed to help you share your thoughts, ideas, and stories with the world.

## Getting Started

Creating your first post is easy! Simply click on the "Create New Post" button and let your creativity flow. Here are some features you'll love:

### Rich Text Editing
- Write in Markdown or plain text
- Add images and media to your posts
- Preview your content before publishing

### Engagement Features
- Readers can like and comment on your posts
- Track your post views and engagement
- Build a following of loyal readers

### Categories and Tags
- Organize your posts with categories
- Use tags to make your content discoverable
- Help readers find exactly what they're looking for

## Community Guidelines

We believe in creating a positive, inclusive environment for all users. Please be respectful in your interactions and follow our community guidelines.

Happy writing! 🎉`,
          slug: 'welcome-to-your-new-blog-platform',
          author: {
            firstName: 'Blog',
            lastName: 'Team',
            fullName: 'Blog Team',
            id: 'demo_admin',
            avatar: null
          },
          status: 'published',
          featured: true,
          category: 'technology',
          tags: ['welcome', 'getting-started', 'blogging'],
          publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          views: 156,
          likeCount: 23,
          commentCount: 8,
          readingTime: 3,
          featuredImage: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
        },
        {
          _id: 'demo_2',
          title: 'Tips for Writing Engaging Blog Posts',
          excerpt: 'Learn the secrets to creating blog content that captivates your readers and keeps them coming back for more.',
          content: `# Tips for Writing Engaging Blog Posts

Creating content that resonates with your audience is both an art and a science. Here are some proven strategies to make your blog posts more engaging.

## Know Your Audience

Understanding who you're writing for is the foundation of great content. Ask yourself:
- Who are my readers?
- What problems do they face?
- What style of writing do they prefer?

## Craft Compelling Headlines

Your headline is the first thing readers see. Make it count by:
- Using numbers and specific details
- Creating curiosity or urgency
- Keeping it under 60 characters for SEO

## Structure for Readability

Break up your content with:
- Short paragraphs (2-3 sentences max)
- Bullet points and numbered lists
- Subheadings every few paragraphs
- Images and visual breaks

## End with a Call-to-Action

Always give your readers a next step:
- Ask a question to encourage comments
- Suggest related articles
- Invite them to subscribe or follow

Remember, great writing takes practice. The more you write, the better you'll become!`,
          slug: 'tips-for-writing-engaging-blog-posts',
          author: {
            firstName: 'Jane',
            lastName: 'Writer',
            fullName: 'Jane Writer',
            id: 'demo_user_1',
            avatar: null
          },
          status: 'published',
          featured: false,
          category: 'lifestyle',
          tags: ['writing', 'blogging', 'tips', 'content-creation'],
          publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          views: 89,
          likeCount: 15,
          commentCount: 4,
          readingTime: 4,
          featuredImage: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
        },
        {
          _id: 'demo_3',
          title: 'The Future of Digital Publishing',
          excerpt: 'Exploring how technology is reshaping the way we create, distribute, and consume written content in the digital age.',
          content: `# The Future of Digital Publishing

The publishing industry has undergone dramatic changes in the past decade, and the pace of transformation is only accelerating.

## The Rise of Independent Publishers

Today's creators have more opportunities than ever to:
- Publish directly to global audiences
- Retain control over their content
- Build direct relationships with readers
- Monetize their work through multiple channels

## Technology Trends Shaping Publishing

### Artificial Intelligence
AI is revolutionizing content creation and curation:
- Automated editing and proofreading
- Personalized content recommendations
- Dynamic content optimization

### Interactive Media
The future of publishing is interactive:
- Embedded multimedia content
- Reader engagement tools
- Real-time collaboration features

## Challenges and Opportunities

While technology opens new doors, publishers face challenges:
- Information oversaturation
- Changing reader habits
- Platform dependency risks

The key is finding the right balance between leveraging technology and maintaining authentic human connection.

What do you think the future holds for digital publishing?`,
          slug: 'the-future-of-digital-publishing',
          author: {
            firstName: 'Alex',
            lastName: 'Tech',
            fullName: 'Alex Tech',
            id: 'demo_user_2',
            avatar: null
          },
          status: 'published',
          featured: true,
          category: 'technology',
          tags: ['digital-publishing', 'technology', 'future', 'innovation'],
          publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          views: 234,
          likeCount: 45,
          commentCount: 12,
          readingTime: 5,
          featuredImage: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
        }
      ]
      return demoPosts
    }
  })
  const [isLoading, setIsLoading] = useState(false)

  // Save posts to localStorage whenever posts change
  useEffect(() => {
    localStorage.setItem('demo_posts', JSON.stringify(posts))
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