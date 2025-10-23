import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Tag, ArrowLeft, Calendar, User, Eye, Heart, MessageCircle } from 'lucide-react'
import PostCard from '../components/PostCard'
import { usePostInteraction } from '../contexts/PostInteractionContext'

const Category = () => {
  const { slug } = useParams()
  const { initializePostStats } = usePostInteraction()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  // Category information
  const categories = {
    technology: {
      name: 'Technology',
      description: 'Latest trends in tech, programming, AI, and digital innovation.',
      color: '#3b82f6',
      icon: '💻'
    },
    lifestyle: {
      name: 'Lifestyle',
      description: 'Health, wellness, productivity, and personal development.',
      color: '#10b981',
      icon: '🌱'
    },
    travel: {
      name: 'Travel',
      description: 'Travel guides, tips, and adventures from around the world.',
      color: '#f59e0b',
      icon: '✈️'
    },
    food: {
      name: 'Food',
      description: 'Recipes, restaurant reviews, and culinary experiences.',
      color: '#ef4444',
      icon: '🍽️'
    },
    business: {
      name: 'Business',
      description: 'Entrepreneurship, finance, marketing, and business strategy.',
      color: '#8b5cf6',
      icon: '💼'
    }
  }

  const category = categories[slug] || {
    name: slug?.charAt(0).toUpperCase() + slug?.slice(1) || 'Category',
    description: 'Explore articles in this category.',
    color: '#6b7280',
    icon: '📄'
  }

  // Mock posts for demo
  const mockPosts = [
    {
      _id: `${slug}_1`,
      title: `Getting Started with ${category.name}`,
      excerpt: `A comprehensive guide to understanding the basics of ${category.name.toLowerCase()} and how to get started.`,
      slug: `${slug}-getting-started`,
      author: { firstName: 'John', lastName: 'Doe' },
      publishedAt: new Date().toISOString(),
      views: Math.floor(Math.random() * 1000),
      likeCount: Math.floor(Math.random() * 100),
      commentCount: Math.floor(Math.random() * 50),
      category: { name: category.name, color: category.color },
      readingTime: 5
    },
    {
      _id: `${slug}_2`,
      title: `Advanced ${category.name} Techniques`,
      excerpt: `Take your ${category.name.toLowerCase()} skills to the next level with these advanced techniques and best practices.`,
      slug: `${slug}-advanced-techniques`,
      author: { firstName: 'Jane', lastName: 'Smith' },
      publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      views: Math.floor(Math.random() * 1000),
      likeCount: Math.floor(Math.random() * 100),
      commentCount: Math.floor(Math.random() * 50),
      category: { name: category.name, color: category.color },
      readingTime: 8
    },
    {
      _id: `${slug}_3`,
      title: `${category.name} Trends for 2025`,
      excerpt: `Discover the latest trends and innovations shaping the future of ${category.name.toLowerCase()}.`,
      slug: `${slug}-trends-2025`,
      author: { firstName: 'Mike', lastName: 'Johnson' },
      publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      views: Math.floor(Math.random() * 1000),
      likeCount: Math.floor(Math.random() * 100),
      commentCount: Math.floor(Math.random() * 50),
      category: { name: category.name, color: category.color },
      readingTime: 6
    }
  ]

  useEffect(() => {
    // Simulate loading
    setLoading(true)
    setTimeout(() => {
      setPosts(mockPosts)
      initializePostStats(mockPosts)
      setLoading(false)
    }, 500)
  }, [slug, initializePostStats])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner-lg mx-auto mb-4"></div>
          <p className="text-gray-600">Loading category...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="hero-gradient py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center text-4xl shadow-xl"
                style={{ backgroundColor: `${category.color}20` }}
              >
                {category.icon}
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span style={{ color: category.color }}>{category.name}</span> Articles
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto mb-8">
              {category.description}
            </p>
            <div className="flex justify-center">
              <Link
                to="/"
                className="btn btn-outline inline-flex items-center"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {posts.length > 0 ? (
            <>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-gray-900">
                  {posts.length} Article{posts.length !== 1 ? 's' : ''} Found
                </h2>
                <div className="flex items-center text-sm text-gray-600">
                  <Tag className="h-4 w-4 mr-2" />
                  Category: {category.name}
                </div>
              </div>

              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {posts.map((post) => (
                  <PostCard key={post._id} post={post} />
                ))}
              </div>

              {/* Load More Button */}
              <div className="text-center mt-12">
                <button className="btn btn-outline">
                  Load More Articles
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <div
                className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center text-5xl"
                style={{ backgroundColor: `${category.color}10` }}
              >
                {category.icon}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                No Articles Yet
              </h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                We haven't published any articles in the {category.name} category yet.
                Check back soon for new content!
              </p>
              <Link
                to="/"
                className="btn btn-primary"
              >
                Explore Other Categories
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Related Categories */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Explore Other Categories
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {Object.entries(categories)
              .filter(([key]) => key !== slug)
              .map(([key, cat]) => (
                <Link
                  key={key}
                  to={`/category/${key}`}
                  className="card p-6 text-center group hover:shadow-xl transition-all duration-300"
                >
                  <div
                    className="w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center text-2xl group-hover:scale-110 transition-transform"
                    style={{ backgroundColor: `${cat.color}20` }}
                  >
                    {cat.icon}
                  </div>
                  <h4 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                    {cat.name}
                  </h4>
                </Link>
              ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Category