import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { Calendar, User, Eye, Heart, MessageCircle, Clock, Share2 } from 'lucide-react'
import { format } from 'date-fns'
import DOMPurify from 'dompurify'
import { marked } from 'marked'
import toast from 'react-hot-toast'
import api from '../utils/api'
import { useAuth } from '../contexts/AuthContext'
import LoadingSpinner from '../components/LoadingSpinner'
import CommentSection from '../components/CommentSection'
import RelatedPosts from '../components/RelatedPosts'

const BlogPost = () => {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const [showShareMenu, setShowShareMenu] = useState(false)

  const { data: post, isLoading, error } = useQuery(
    ['post', slug],
    () => api.get(`/posts/${slug}`).then(res => res.data),
    {
      onError: (err) => {
        if (err.response?.status === 404) {
          navigate('/404')
        }
      }
    }
  )

  const likeMutation = useMutation(
    () => api.post(`/posts/${post._id}/like`),
    {
      onSuccess: (data) => {
        queryClient.setQueryData(['post', slug], {
          ...post,
          hasLiked: data.data.liked,
          likeCount: data.data.likeCount
        })
        toast.success(data.data.message)
      },
      onError: (err) => {
        toast.error(err.response?.data?.message || 'Failed to like post')
      }
    }
  )

  const handleLike = () => {
    if (!user) {
      toast.error('Please login to like posts')
      return
    }
    likeMutation.mutate()
  }

  const handleShare = (platform) => {
    const url = window.location.href
    const title = post.title

    let shareUrl = ''

    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`
        break
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
        break
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
        break
      case 'copy':
        navigator.clipboard.writeText(url)
        toast.success('Link copied to clipboard!')
        setShowShareMenu(false)
        return
      default:
        return
    }

    window.open(shareUrl, '_blank', 'width=600,height=400')
    setShowShareMenu(false)
  }

  if (isLoading) return <LoadingSpinner />
  if (error) return <div className="text-center py-12 text-red-600">Error loading post</div>
  if (!post) return <div className="text-center py-12">Post not found</div>

  const contentHtml = DOMPurify.sanitize(marked.parse(post.content))

  return (
    <div className="min-h-screen bg-gray-50">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Featured Image */}
        {post.featuredImage && (
          <div className="mb-8 rounded-lg overflow-hidden shadow-lg">
            <img
              src={post.featuredImage}
              alt={post.title}
              className="w-full h-64 md:h-96 object-cover"
            />
          </div>
        )}

        {/* Article Header */}
        <header className="mb-8">
          {/* Category */}
          <div className="mb-4">
            <span
              className="inline-block px-3 py-1 text-sm font-medium text-white rounded-full"
              style={{ backgroundColor: post.category?.color }}
            >
              {post.category?.name}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            {post.title}
          </h1>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-xl text-gray-600 mb-6 leading-relaxed">
              {post.excerpt}
            </p>
          )}

          {/* Author and Meta Info */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-200 pb-6">
            <div className="flex items-center mb-4 sm:mb-0">
              {post.author.avatar && (
                <img
                  src={post.author.avatar}
                  alt={post.author.fullName}
                  className="h-12 w-12 rounded-full object-cover mr-4"
                />
              )}
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {post.author.firstName} {post.author.lastName}
                </p>
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="h-4 w-4 mr-1" />
                  {format(new Date(post.publishedAt), 'MMM dd, yyyy')}
                  <span className="mx-2">•</span>
                  <Clock className="h-4 w-4 mr-1" />
                  {post.readingTime} min read
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-4">
              {/* Views */}
              <div className="flex items-center text-gray-500">
                <Eye className="h-5 w-5 mr-1" />
                <span className="text-sm">{post.views}</span>
              </div>

              {/* Likes */}
              <button
                onClick={handleLike}
                disabled={likeMutation.isLoading}
                className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${post.hasLiked
                    ? 'bg-red-100 text-red-600 hover:bg-red-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
              >
                <Heart
                  className={`h-5 w-5 ${post.hasLiked ? 'fill-current' : ''}`}
                />
                <span className="text-sm">{post.likeCount}</span>
              </button>

              {/* Comments */}
              <div className="flex items-center text-gray-500">
                <MessageCircle className="h-5 w-5 mr-1" />
                <span className="text-sm">{post.commentCount}</span>
              </div>

              {/* Share */}
              <div className="relative">
                <button
                  onClick={() => setShowShareMenu(!showShareMenu)}
                  className="flex items-center px-3 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Share2 className="h-5 w-5 mr-1" />
                  <span className="text-sm">Share</span>
                </button>

                {showShareMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                    <button
                      onClick={() => handleShare('twitter')}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Share on Twitter
                    </button>
                    <button
                      onClick={() => handleShare('facebook')}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Share on Facebook
                    </button>
                    <button
                      onClick={() => handleShare('linkedin')}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Share on LinkedIn
                    </button>
                    <button
                      onClick={() => handleShare('copy')}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Copy Link
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Article Content */}
        <div className="mb-12">
          <div
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: contentHtml }}
          />
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Author Bio */}
        <div className="bg-white rounded-lg p-6 mb-12 shadow-md">
          <div className="flex items-start">
            {post.author.avatar && (
              <img
                src={post.author.avatar}
                alt={post.author.fullName}
                className="h-16 w-16 rounded-full object-cover mr-6 flex-shrink-0"
              />
            )}
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                About {post.author.firstName} {post.author.lastName}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {post.author.bio || 'This author hasn\'t written a bio yet.'}
              </p>
            </div>
          </div>
        </div>
      </article>

      {/* Comments Section */}
      <CommentSection postId={post._id} />

      {/* Related Posts */}
      <RelatedPosts
        currentPostId={post._id}
        categoryId={post.category?._id}
        tags={post.tags}
      />
    </div>
  )
}

export default BlogPost