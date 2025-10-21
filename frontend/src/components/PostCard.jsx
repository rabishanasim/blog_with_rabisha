import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, User, Eye, Heart, MessageCircle, Clock, MessageSquare } from 'lucide-react'
import { format } from 'date-fns'
import { usePostInteraction } from '../contexts/PostInteractionContext'

const PostCard = ({ post }) => {
  const { toggleLike, incrementViewCount, getPostStats, isPostLiked } = usePostInteraction()
  const [showCommentInput, setShowCommentInput] = useState(false)
  const [commentText, setCommentText] = useState('')
  
  const postId = post._id || post.id
  const stats = getPostStats(postId)
  const isLiked = isPostLiked(postId)

  const handleLikeClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    toggleLike(postId)
  }

  const handleCommentClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setShowCommentInput(!showCommentInput)
  }

  const handleViewClick = (e) => {
    incrementViewCount(postId)
  }

  return (
    <article className="card group cursor-pointer">
      {/* Featured Image */}
      {post.featuredImage ? (
        <div className="relative overflow-hidden">
          <img
            src={post.featuredImage}
            alt={post.title}
            className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
      ) : (
        <div className="w-full h-48 bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center">
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full mx-auto mb-3 flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
              </svg>
            </div>
            <h3 className="text-sm text-gray-600">No Image</h3>
          </div>
        </div>
      )}

      <div className="p-6">
        {/* Category */}
        {post.category && (
          <div className="mb-3">
            <span 
              className="inline-block px-3 py-1 text-xs font-semibold text-white rounded-full shadow-sm"
              style={{ backgroundColor: post.category.color || '#3b82f6' }}
            >
              {post.category.name}
            </span>
          </div>
        )}

        {/* Title */}
        <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
          <Link
            to={`/post/${post.slug}`}
            onClick={handleViewClick}
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
        <div className="flex items-center justify-between text-sm text-gray-500 border-t border-gray-100 pt-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center text-gray-400">
              <Eye className="h-4 w-4 mr-1" />
              {stats.views}
            </div>
            <button 
              onClick={handleLikeClick}
              className={`flex items-center transition-all duration-200 transform hover:scale-105 ${
                isLiked 
                  ? 'text-red-500 hover:text-red-600' 
                  : 'text-gray-400 hover:text-red-500'
              }`}
            >
              <Heart className={`h-4 w-4 mr-1 ${isLiked ? 'fill-current' : ''}`} />
              {stats.likes}
            </button>
            <button 
              onClick={handleCommentClick}
              className="flex items-center hover:text-blue-500 transition-all duration-200 transform hover:scale-105"
            >
              <MessageCircle className="h-4 w-4 mr-1" />
              {stats.comments}
            </button>
          </div>
          <div className="flex items-center text-primary-600 font-medium">
            <Clock className="h-4 w-4 mr-1" />
            {post.readingTime || 5} min read
          </div>
        </div>

        {/* Comment Input */}
        {showCommentInput && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="input flex-1 text-sm"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && commentText.trim()) {
                    // Handle comment submission
                    setCommentText('')
                    setShowCommentInput(false)
                  }
                }}
              />
              <button
                onClick={() => {
                  if (commentText.trim()) {
                    setCommentText('')
                    setShowCommentInput(false)
                  }
                }}
                className="btn btn-primary btn-sm"
                disabled={!commentText.trim()}
              >
                Post
              </button>
            </div>
          </div>
        )}

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