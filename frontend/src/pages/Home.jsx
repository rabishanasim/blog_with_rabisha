import React, { useState } from 'react'
import { useQuery } from 'react-query'
import { Link } from 'react-router-dom'
import { Calendar, User, Eye, Heart, MessageCircle, Clock } from 'lucide-react'
import api from '../utils/api'
import LoadingSpinner from '../components/LoadingSpinner'
import PostCard from '../components/PostCard'
import FeaturedPosts from '../components/FeaturedPosts'
import CategoryList from '../components/CategoryList'

const Home = () => {
  const [page, setPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')

  // Mock data for demo when backend is not available
  const mockPosts = [
    {
      _id: '1',
      title: 'Welcome to Your Blog Platform',
      excerpt: 'This is a demo post showing how your blog will look when it\'s fully connected to the backend.',
      slug: 'welcome-to-blog',
      author: { firstName: 'Demo', lastName: 'User' },
      publishedAt: new Date().toISOString(),
      views: 0,
      likes: 0,
      comments: 0
    }
  ]

  const { data: postsData, isLoading, error } = useQuery(
    ['posts', page, searchTerm, selectedCategory],
    () => api.get('/posts', {
      params: {
        page,
        limit: 9,
        search: searchTerm || undefined,
        category: selectedCategory || undefined,
      }
    }).then(res => res.data),
    {
      keepPreviousData: true,
      retry: false,
      refetchOnWindowFocus: false,
      onError: () => {
        // Fallback to mock data when API fails
      }
    }
  )

  const { data: featuredPosts } = useQuery(
    'featured-posts',
    () => api.get('/posts/featured').then(res => res.data),
    {
      staleTime: 5 * 60 * 1000,
      retry: false,
      refetchOnWindowFocus: false
    }
  )

  const { data: categories } = useQuery(
    'categories',
    () => api.get('/categories').then(res => res.data),
    {
      staleTime: 10 * 60 * 1000,
      retry: false,
      refetchOnWindowFocus: false
    }
  )

  // Use mock data if API calls fail
  const displayPosts = postsData?.posts || (error ? mockPosts : [])
  const displayCategories = categories || []

  const handleSearch = (e) => {
    e.preventDefault()
    setPage(1) // Reset to first page when searching
  }

  const handleCategoryChange = (categorySlug) => {
    setSelectedCategory(categorySlug)
    setPage(1)
  }

  if (isLoading && !postsData) return <LoadingSpinner />

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-white py-16 mb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Welcome to Our <span className="text-primary-600">Blog</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Discover insightful articles, tutorials, and stories from our community of writers and creators.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <form onSubmit={handleSearch} className="flex max-w-md mx-auto">
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input flex-1 rounded-r-none"
                />
                <button
                  type="submit"
                  className="btn btn-primary rounded-l-none px-6"
                >
                  Search
                </button>
              </form>
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
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${!selectedCategory
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                  >
                    All Posts
                  </button>
                  {displayCategories.map((category) => (
                    <button
                      key={category._id}
                      onClick={() => handleCategoryChange(category.slug)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedCategory === category.slug
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
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
                <div className="flex justify-center items-center space-x-2 mb-8">
                  <button
                    onClick={() => setPage(page - 1)}
                    disabled={!postsData.pagination.hasPrev}
                    className="btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>

                  <span className="px-4 py-2 text-gray-700">
                    Page {postsData.pagination.current} of {postsData.pagination.total}
                  </span>

                  <button
                    onClick={() => setPage(page + 1)}
                    disabled={!postsData.pagination.hasNext}
                    className="btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              )}

              {displayPosts.length === 0 && (
                <div className="text-center py-12">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No posts found</h3>
                  <p className="text-gray-600">
                    {searchTerm ? 'Try adjusting your search terms.' : 'Backend not connected yet. Demo content coming soon!'}
                  </p>
                </div>
              )}
            </>
          </main>

          {/* Sidebar */}
          <aside className="lg:w-1/3">
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">About This Blog</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Welcome to our blog platform where writers share their thoughts, experiences, and expertise
                on various topics. Join our community of readers and contributors.
              </p>
            </div>

            {/* Recent Posts Sidebar */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Posts</h3>
              <div className="space-y-4">
                {displayPosts.slice(0, 5).map((post) => (
                  <div key={post._id} className="border-b border-gray-200 pb-4 last:border-0">
                    <Link
                      to={`/post/${post.slug}`}
                      className="text-sm font-medium text-gray-900 hover:text-primary-600 transition-colors"
                    >
                      {post.title}
                    </Link>
                    <div className="flex items-center text-xs text-gray-500 mt-2">
                      <Calendar className="h-3 w-3 mr-1" />
                      {new Date(post.publishedAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

export default Home