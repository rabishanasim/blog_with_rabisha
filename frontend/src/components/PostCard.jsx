import React from 'react'
import { Link } from 'react-router-dom'
import { Calendar, User, Eye, Heart, MessageCircle, Clock } from 'lucide-react'
import { format } from 'date-fns'

const PostCard = ({ post }) => {
  return (
    <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Featured Image */}
      {post.featuredImage && (
        <div className="aspect-w-16 aspect-h-9">
          <img
            src={post.featuredImage}
            alt={post.title}
            className="w-full h-48 object-cover"
          />
        </div>
      )}

      <div className="p-6">
        {/* Category */}
        {post.category && (
          <div className="mb-3">
            <span 
              className="inline-block px-2 py-1 text-xs font-medium text-white rounded"
              style={{ backgroundColor: post.category.color }}
            >
              {post.category.name}
            </span>
          </div>
        )}

        {/* Title */}
        <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
          <Link
            to={`/post/${post.slug}`}
            className="hover:text-primary-600 transition-colors"
          >
            {post.title}
          </Link>
        </h2>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
            {post.excerpt}
          </p>
        )}

        {/* Author and Date */}
        <div className="flex items-center text-sm text-gray-500 mb-4">
          <div className="flex items-center">
            {post.author.avatar && (
              <img
                src={post.author.avatar}
                alt={post.author.fullName || `${post.author.firstName} ${post.author.lastName}`}
                className="h-6 w-6 rounded-full object-cover mr-2"
              />
            )}
            <span className="font-medium">
              {post.author.firstName} {post.author.lastName}
            </span>
          </div>
          <span className="mx-2">•</span>
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            {format(new Date(post.publishedAt), 'MMM dd, yyyy')}
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Eye className="h-4 w-4 mr-1" />
              {post.views}
            </div>
            <div className="flex items-center">
              <Heart className="h-4 w-4 mr-1" />
              {post.likeCount}
            </div>
            <div className="flex items-center">
              <MessageCircle className="h-4 w-4 mr-1" />
              {post.commentCount}
            </div>
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            {post.readingTime} min read
          </div>
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1">
            {post.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
              >
                #{tag}
              </span>
            ))}
            {post.tags.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                +{post.tags.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>
    </article>
  )
}

export default PostCard