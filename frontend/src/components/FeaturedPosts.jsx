import React from 'react'
import { Link } from 'react-router-dom'

const FeaturedPosts = ({ posts }) => {
  if (!posts || posts.length === 0) return null

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => (
        <Link
          key={post._id}
          to={`/post/${post.slug}`}
          className="group relative bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
        >
          {/* Featured Image */}
          {post.featuredImage && (
            <div className="aspect-w-16 aspect-h-9">
              <img
                src={post.featuredImage}
                alt={post.title}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          )}

          {/* Content */}
          <div className="p-6">
            {/* Category */}
            {post.category && (
              <span 
                className="inline-block px-2 py-1 text-xs font-medium text-white rounded mb-3"
                style={{ backgroundColor: post.category.color }}
              >
                {post.category.name}
              </span>
            )}

            {/* Title */}
            <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
              {post.title}
            </h3>

            {/* Excerpt */}
            {post.excerpt && (
              <p className="text-gray-600 text-sm line-clamp-2">
                {post.excerpt}
              </p>
            )}
          </div>

          {/* Featured Badge */}
          <div className="absolute top-4 right-4">
            <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded">
              Featured
            </span>
          </div>
        </Link>
      ))}
    </div>
  )
}

export default FeaturedPosts