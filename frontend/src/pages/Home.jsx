import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, User, Eye, Heart, MessageCircle, Clock } from 'lucide-react'
import LoadingSpinner from '../components/LoadingSpinner'
import PostCard from '../components/PostCard'
import FeaturedPosts from '../components/FeaturedPosts'
import CategoryList from '../components/CategoryList'
import SearchBar from '../components/SearchBar'
import AdminProfile from '../components/AdminProfile'
import { usePostInteraction } from '../contexts/PostInteractionContext'
import { usePost } from '../contexts/PostContext'

const Home = () => {
  const [page, setPage] = useState(1)
  const [selectedCategory, setSelectedCategory] = useState('')
  const [postsData, setPostsData] = useState(null)
  const [featuredPosts, setFeaturedPosts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const { initializePostStats } = usePostInteraction()
  const { getPosts } = usePost()

  // Mock categories
  const displayCategories = [
    { _id: 'tech', name: 'Technology', slug: 'technology', postCount: 12 },
    { _id: 'lifestyle', name: 'Lifestyle', slug: 'lifestyle', postCount: 8 },
    { _id: 'travel', name: 'Travel', slug: 'travel', postCount: 6 },
    { _id: 'food', name: 'Food', slug: 'food', postCount: 4 },
    { _id: 'business', name: 'Business', slug: 'business', postCount: 10 }
  ]

  // Fetch posts using PostContext
  useEffect(() => {
    setIsLoading(true)

    // Simulate loading delay
    setTimeout(() => {
      const result = getPosts({
        page,
        limit: 9,
        status: 'published',
        category: selectedCategory || null
      })

      setPostsData(result)

      // Get featured posts
      const featured = getPosts({
        page: 1,
        limit: 3,
        status: 'published',
        featured: true
      })
      setFeaturedPosts(featured.posts)

      setIsLoading(false)
    }, 500)
  }, [page, selectedCategory, getPosts])

  const displayPosts = postsData?.posts || []

  // Initialize post stats when posts change
  useEffect(() => {
    if (displayPosts && displayPosts.length > 0) {
      initializePostStats(displayPosts)
    }
  }, [displayPosts, initializePostStats])

  const handleCategoryChange = (categorySlug) => {
    setSelectedCategory(categorySlug)
    setPage(1)
  }

  if (isLoading && !postsData) return <LoadingSpinner />

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="hero-gradient py-20 mb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600/10 to-secondary-600/10"></div>
        <div className="absolute top-10 left-10 w-72 h-72 bg-primary-300/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-secondary-300/30 rounded-full blur-3xl"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Welcome to Our <span className="gradient-text">Blog</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 mb-10 max-w-3xl mx-auto leading-relaxed">
              Discover insightful articles, tutorials, and stories from our community of writers and creators.
              Join us on a journey of knowledge and inspiration.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8">
              <div className="max-w-lg mx-auto shadow-xl">
                <SearchBar
                  placeholder="Search amazing articles..."
                  className="w-full"
                  showResults={true}
                  size="large"
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                to="/register"
                className="btn btn-secondary btn-lg"
              >
                Join Our Community
              </Link>
              <Link
                to="/create-post"
                className="btn btn-outline btn-lg"
              >
                Start Writing
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      {featuredPosts && featuredPosts.length > 0 && (
        <section className="mb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Featured Posts</h2>
            <FeaturedPosts posts={featuredPosts} />
          </div>
        </section>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <main className="lg:w-2/3">
            {/* Category Filter */}
            {displayCategories && displayCategories.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleCategoryChange('')}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 ${!selectedCategory
                      ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-primary-50 hover:text-primary-600 shadow-md hover:shadow-lg'
                      }`}
                  >
                    All Posts
                  </button>
                  {displayCategories.map((category) => (
                    <button
                      key={category._id}
                      onClick={() => handleCategoryChange(category.slug)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 ${selectedCategory === category.slug
                        ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg'
                        : 'bg-white text-gray-700 hover:bg-primary-50 hover:text-primary-600 shadow-md hover:shadow-lg'
                        }`}
                    >
                      {category.name} ({category.postCount})
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Posts Grid */}
            <>
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-12">
                {displayPosts.map((post) => (
                  <PostCard key={post._id} post={post} />
                ))}
              </div>

              {/* Pagination */}
              {postsData?.pagination && (
                <div className="flex justify-center items-center space-x-4 mb-8">
                  <button
                    onClick={() => setPage(page - 1)}
                    disabled={!postsData.pagination.hasPrev}
                    className="btn btn-outline disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    Previous
                  </button>

                  <div className="bg-white rounded-lg px-4 py-2 shadow-md">
                    <span className="text-gray-700 font-medium">
                      Page {postsData.pagination.current} of {postsData.pagination.total}
                    </span>
                  </div>

                  <button
                    onClick={() => setPage(page + 1)}
                    disabled={!postsData.pagination.hasNext}
                    className="btn btn-outline disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    Next
                  </button>
                </div>
              )}

              {displayPosts.length === 0 && (
                <div className="text-center py-12">
                  <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md mx-auto">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No Posts Yet</h3>
                    <p className="text-gray-600 mb-4">
                      Be the first to share your story! Create your first blog post and start building your content.
                    </p>
                    <Link
                      to="/create-post"
                      className="btn btn-primary"
                    >
                      Write Your First Post
                    </Link>
                  </div>
                </div>
              )}
            </>
          </main>

          {/* Sidebar */}
          <aside className="lg:w-1/3 space-y-8">
            {/* Admin Profile */}
            <AdminProfile showStats={true} />

            <div className="card">
              <div className="p-6">
                <h3 className="text-xl font-bold gradient-text mb-4">About This Blog</h3>
                <p className="text-gray-600 leading-relaxed">
                  Welcome to my personal blog where I share my thoughts, experiences, and expertise
                  on various topics. Join me on this journey of learning and discovery.
                </p>
                <div className="mt-6">
                  <Link
                    to="/register"
                    className="btn btn-primary btn-sm w-full"
                  >
                    Join Community
                  </Link>
                </div>
              </div>
            </div>

            {/* Recent Posts Sidebar */}
            <div className="card">
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Posts</h3>
                <div className="space-y-4">
                  {displayPosts.slice(0, 5).map((post) => (
                    <div key={post._id} className="group border-b border-gray-100 pb-4 last:border-0">
                      <Link
                        to={`/post/${post.slug}`}
                        className="block text-sm font-medium text-gray-900 group-hover:text-primary-600 transition-colors duration-200 mb-2"
                      >
                        {post.title}
                      </Link>
                      <div className="flex items-center text-xs text-gray-500">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(post.publishedAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Newsletter Signup */}
            <div className="card-glass">
              <div className="p-6 text-center">
                <h3 className="text-xl font-bold text-white mb-4">Stay Updated</h3>
                <p className="text-white/80 text-sm mb-4">
                  Subscribe to get the latest articles delivered to your inbox.
                </p>
                <div className="space-y-3">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="input w-full bg-white/20 border-white/30 placeholder-white/60 text-white"
                  />
                  <button className="btn btn-primary w-full">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

export default Home