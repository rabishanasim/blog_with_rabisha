import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Eye, Heart, MessageCircle, Play, FileText, Video, Clock, User, Calendar } from 'lucide-react'
import api from '../utils/api'
import LoadingSpinner from '../components/LoadingSpinner'

const UserContentGallery = () => {
  const [content, setContent] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState({
    page: 1,
    limit: 12,
    category: 'all',
    contentType: 'all',
    featured: false
  })
  const [pagination, setPagination] = useState(null)

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'technology', label: 'Technology' },
    { value: 'lifestyle', label: 'Lifestyle' },
    { value: 'travel', label: 'Travel' },
    { value: 'food', label: 'Food' },
    { value: 'business', label: 'Business' },
    { value: 'health', label: 'Health' },
    { value: 'education', label: 'Education' },
    { value: 'entertainment', label: 'Entertainment' },
    { value: 'sports', label: 'Sports' },
    { value: 'gaming', label: 'Gaming' },
    { value: 'music', label: 'Music' },
    { value: 'art', label: 'Art' },
    { value: 'science', label: 'Science' },
    { value: 'politics', label: 'Politics' },
    { value: 'other', label: 'Other' }
  ]

  // Fetch content
  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true)
        const params = new URLSearchParams()
        
        Object.keys(filters).forEach(key => {
          if (filters[key] && filters[key] !== 'all' && filters[key] !== false) {
            params.append(key, filters[key])
          }
        })

        const response = await api.get(`/user-content?${params.toString()}`)
        setContent(response.data.content)
        setPagination(response.data.pagination)
      } catch (err) {
        console.error('Error fetching content:', err)
        setError('Failed to load content')
      } finally {
        setLoading(false)
      }
    }

    fetchContent()
  }, [filters])

  const handleFilterChange = (key, value) => {
    setFilters({
      ...filters,
      [key]: value,
      page: 1 // Reset to first page when filters change
    })
  }

  const handlePageChange = (newPage) => {
    setFilters({
      ...filters,
      page: newPage
    })
  }

  const ContentCard = ({ item }) => {
    const isVideo = item.contentType === 'video'
    
    return (
      <div className="card group">
        {/* Featured Image/Video Thumbnail */}
        <div className="relative aspect-video bg-gray-200 overflow-hidden">
          {item.featuredImage || item.videoFile?.thumbnail ? (
            <img
              src={item.featuredImage || item.videoFile?.thumbnail}
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-100 to-secondary-100">
              {isVideo ? (
                <Video className="h-12 w-12 text-primary-600" />
              ) : (
                <FileText className="h-12 w-12 text-primary-600" />
              )}
            </div>
          )}
          
          {/* Content Type Badge */}
          <div className="absolute top-3 left-3">
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              isVideo 
                ? 'bg-red-100 text-red-800' 
                : 'bg-blue-100 text-blue-800'
            }`}>
              {isVideo ? (
                <>
                  <Video className="h-3 w-3 mr-1" />
                  Video
                </>
              ) : (
                <>
                  <FileText className="h-3 w-3 mr-1" />
                  Article
                </>
              )}
            </span>
          </div>
          
          {/* Play Button for Videos */}
          {isVideo && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 bg-black bg-opacity-70 rounded-full flex items-center justify-center group-hover:bg-opacity-80 transition-all duration-300">
                <Play className="h-8 w-8 text-white ml-1" />
              </div>
            </div>
          )}
          
          {/* Featured Badge */}
          {item.featured && (
            <div className="absolute top-3 right-3">
              <span className="inline-flex items-center px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                ⭐ Featured
              </span>
            </div>
          )}
        </div>
        
        {/* Content */}
        <div className="p-6">
          {/* Category */}
          <div className="mb-3">
            <span className="inline-flex items-center px-2 py-1 bg-primary-50 text-primary-700 rounded-full text-xs font-medium">
              {categories.find(c => c.value === item.category)?.label || item.category}
            </span>
          </div>
          
          {/* Title */}
          <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">
            <Link to={`/user-content/${item.slug}`}>
              {item.title}
            </Link>
          </h3>
          
          {/* Description */}
          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
            {item.description}
          </p>
          
          {/* Author */}
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mr-3">
              {item.author?.avatar ? (
                <img
                  src={item.author.avatar}
                  alt={item.authorName}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <User className="h-4 w-4 text-white" />
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{item.authorName}</p>
              <div className="flex items-center text-xs text-gray-500">
                <Calendar className="h-3 w-3 mr-1" />
                {new Date(item.publishedAt || item.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
          
          {/* Stats */}
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <Eye className="h-4 w-4 mr-1" />
                {item.views || 0}
              </div>
              <div className="flex items-center">
                <Heart className="h-4 w-4 mr-1" />
                {item.likeCount || 0}
              </div>
              <div className="flex items-center">
                <MessageCircle className="h-4 w-4 mr-1" />
                {item.commentCount || 0}
              </div>
            </div>
            
            {item.readingTime && item.contentType === 'text' && (
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {item.readingTime} min
              </div>
            )}
          </div>
          
          {/* Tags */}
          {item.tags && item.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1">
              {item.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                >
                  #{tag}
                </span>
              ))}
              {item.tags.length > 3 && (
                <span className="text-xs text-gray-500">
                  +{item.tags.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    )
  }

  if (loading && content.length === 0) return <LoadingSpinner />

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="hero-gradient py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Community <span className="gradient-text">Content</span>
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Discover amazing articles and videos shared by our community members
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Category Filter */}
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-gray-700">Category:</label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="input"
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Content Type Filter */}
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-gray-700">Type:</label>
              <select
                value={filters.contentType}
                onChange={(e) => handleFilterChange('contentType', e.target.value)}
                className="input"
              >
                <option value="all">All Types</option>
                <option value="text">Articles</option>
                <option value="video">Videos</option>
              </select>
            </div>

            {/* Featured Toggle */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="featured"
                checked={filters.featured}
                onChange={(e) => handleFilterChange('featured', e.target.checked)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <label htmlFor="featured" className="text-sm font-medium text-gray-700">
                Featured Only
              </label>
            </div>

            {/* Upload Button */}
            <Link
              to="/upload-content"
              className="btn btn-primary"
            >
              Share Your Content
            </Link>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
              <p className="text-red-800">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="btn btn-outline btn-sm mt-4"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Content Grid */}
        {!error && (
          <>
            {loading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="card animate-pulse">
                    <div className="aspect-video bg-gray-200"></div>
                    <div className="p-6">
                      <div className="h-4 bg-gray-200 rounded mb-4"></div>
                      <div className="h-6 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                        <div className="h-4 bg-gray-200 rounded flex-1"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : content.length > 0 ? (
              <>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                  {content.map((item) => (
                    <ContentCard key={item._id} item={item} />
                  ))}
                </div>

                {/* Pagination */}
                {pagination && (
                  <div className="flex justify-center items-center space-x-4">
                    <button
                      onClick={() => handlePageChange(filters.page - 1)}
                      disabled={!pagination.hasPrev}
                      className="btn btn-outline disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>

                    <div className="bg-white rounded-lg px-4 py-2 shadow-md">
                      <span className="text-gray-700 font-medium">
                        Page {pagination.current} of {pagination.total}
                      </span>
                    </div>

                    <button
                      onClick={() => handlePageChange(filters.page + 1)}
                      disabled={!pagination.hasNext}
                      className="btn btn-outline disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md mx-auto">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-primary-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No Content Found</h3>
                  <p className="text-gray-600 mb-4">
                    No content matches your current filters. Try adjusting your search criteria.
                  </p>
                  <Link
                    to="/upload-content"
                    className="btn btn-primary"
                  >
                    Be the First to Share
                  </Link>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default UserContentGallery