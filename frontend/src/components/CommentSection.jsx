import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { format } from 'date-fns'
import { Heart, Reply, Trash2, Edit3, Send } from 'lucide-react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import api from '../utils/api'
import { useAuth } from '../contexts/AuthContext'

const CommentSection = ({ postId }) => {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const [page, setPage] = useState(1)
  const [replyingTo, setReplyingTo] = useState(null)

  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  // Fetch comments
  const { data: commentsData, isLoading } = useQuery(
    ['comments', postId, page],
    () => api.get(`/comments/post/${postId}?page=${page}`).then(res => res.data),
    { enabled: !!postId }
  )

  // Add comment mutation
  const addCommentMutation = useMutation(
    (commentData) => api.post('/comments', commentData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['comments', postId])
        reset()
        setReplyingTo(null)
        toast.success('Comment added successfully!')
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to add comment')
      }
    }
  )

  // Like comment mutation
  const likeCommentMutation = useMutation(
    (commentId) => api.post(`/comments/${commentId}/like`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['comments', postId])
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to like comment')
      }
    }
  )

  const onSubmit = (data) => {
    if (!user) {
      toast.error('Please login to comment')
      return
    }

    addCommentMutation.mutate({
      content: data.content,
      post: postId,
      parentComment: replyingTo
    })
  }

  const handleLikeComment = (commentId) => {
    if (!user) {
      toast.error('Please login to like comments')
      return
    }
    likeCommentMutation.mutate(commentId)
  }

  const CommentItem = ({ comment, isReply = false }) => (
    <div className={`${isReply ? 'ml-8 border-l-2 border-gray-200 pl-4' : ''}`}>
      <div className="flex items-start space-x-3">
        {/* Avatar */}
        <div className="flex-shrink-0">
          {comment.author.avatar ? (
            <img
              src={comment.author.avatar}
              alt={comment.author.fullName}
              className="h-8 w-8 rounded-full object-cover"
            />
          ) : (
            <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
              <span className="text-sm font-medium text-gray-600">
                {comment.author.firstName?.[0]}{comment.author.lastName?.[0]}
              </span>
            </div>
          )}
        </div>

        <div className="flex-1">
          {/* Author and date */}
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-sm font-medium text-gray-900">
              {comment.author.firstName} {comment.author.lastName}
            </span>
            <span className="text-xs text-gray-500">
              {format(new Date(comment.createdAt), 'MMM dd, yyyy at h:mm a')}
            </span>
            {comment.isEdited && (
              <span className="text-xs text-gray-400">(edited)</span>
            )}
          </div>

          {/* Content */}
          <p className="text-gray-700 text-sm mb-3">{comment.content}</p>

          {/* Actions */}
          <div className="flex items-center space-x-4 text-xs">
            <button
              onClick={() => handleLikeComment(comment._id)}
              className={`flex items-center space-x-1 ${comment.hasLiked ? 'text-red-600' : 'text-gray-500 hover:text-red-600'
                }`}
            >
              <Heart className={`h-4 w-4 ${comment.hasLiked ? 'fill-current' : ''}`} />
              <span>{comment.likeCount}</span>
            </button>

            {!isReply && (
              <button
                onClick={() => setReplyingTo(replyingTo === comment._id ? null : comment._id)}
                className="flex items-center space-x-1 text-gray-500 hover:text-primary-600"
              >
                <Reply className="h-4 w-4" />
                <span>Reply</span>
              </button>
            )}

            {user && (user.id === comment.author._id || user.role === 'admin') && (
              <>
                <button className="flex items-center space-x-1 text-gray-500 hover:text-blue-600">
                  <Edit3 className="h-4 w-4" />
                  <span>Edit</span>
                </button>
                <button className="flex items-center space-x-1 text-gray-500 hover:text-red-600">
                  <Trash2 className="h-4 w-4" />
                  <span>Delete</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Reply Form */}
      {replyingTo === comment._id && (
        <div className="mt-4 ml-11">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <textarea
              rows={3}
              placeholder="Write a reply..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              {...register('content', { required: 'Reply content is required' })}
            />
            {errors.content && (
              <p className="text-sm text-red-600">{errors.content.message}</p>
            )}
            <div className="flex space-x-2">
              <button
                type="submit"
                disabled={addCommentMutation.isLoading}
                className="btn btn-primary text-sm"
              >
                {addCommentMutation.isLoading ? (
                  <div className="loading-spinner h-4 w-4 mr-2"></div>
                ) : (
                  <Send className="h-4 w-4 mr-2" />
                )}
                Reply
              </button>
              <button
                type="button"
                onClick={() => setReplyingTo(null)}
                className="btn btn-secondary text-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-4 space-y-4">
          {comment.replies.map((reply) => (
            <CommentItem key={reply._id} comment={reply} isReply={true} />
          ))}
        </div>
      )}
    </div>
  )

  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Comments ({commentsData?.pagination?.totalComments || 0})
        </h2>

        {/* Add Comment Form */}
        {user ? (
          <div className="mb-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <textarea
                rows={4}
                placeholder="What are your thoughts?"
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                {...register('content', { required: 'Comment content is required' })}
              />
              {errors.content && (
                <p className="text-sm text-red-600">{errors.content.message}</p>
              )}
              <button
                type="submit"
                disabled={addCommentMutation.isLoading}
                className="btn btn-primary"
              >
                {addCommentMutation.isLoading ? (
                  <div className="loading-spinner h-5 w-5 mr-2"></div>
                ) : (
                  <Send className="h-5 w-5 mr-2" />
                )}
                Post Comment
              </button>
            </form>
          </div>
        ) : (
          <div className="mb-8 p-4 bg-gray-50 rounded-lg text-center">
            <p className="text-gray-600">
              Please <a href="/login" className="text-primary-600 hover:text-primary-500">login</a> to join the discussion.
            </p>
          </div>
        )}

        {/* Comments List */}
        {isLoading ? (
          <div className="text-center py-8">
            <div className="loading-spinner mx-auto"></div>
          </div>
        ) : commentsData?.comments?.length > 0 ? (
          <div className="space-y-6">
            {commentsData.comments.map((comment) => (
              <CommentItem key={comment._id} comment={comment} />
            ))}

            {/* Pagination */}
            {commentsData.pagination && commentsData.pagination.total > 1 && (
              <div className="flex justify-center items-center space-x-2 pt-6">
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={!commentsData.pagination.hasPrev}
                  className="btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>

                <span className="px-4 py-2 text-gray-700">
                  Page {commentsData.pagination.current} of {commentsData.pagination.total}
                </span>

                <button
                  onClick={() => setPage(page + 1)}
                  disabled={!commentsData.pagination.hasNext}
                  className="btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No comments yet. Be the first to share your thoughts!</p>
          </div>
        )}
      </div>
    </section>
  )
}

export default CommentSection