import React, { useState, useEffect } from 'react'
import { Check, X, Eye, Video, FileText, Calendar, User, MessageCircle } from 'lucide-react'
import api from '../utils/api'
import { useAuth } from '../contexts/AuthContext'
import LoadingSpinner from '../components/LoadingSpinner'

const ContentModeration = () => {
  const { user, isAdmin } = useAuth()
  const [pendingContent, setPendingContent] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState({})
  const [selectedContent, setSelectedContent] = useState(null)
  const [moderationNotes, setModerationNotes] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [modalAction, setModalAction] = useState(null)

  // Redirect if not admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    )
  }

  // Fetch pending content and stats
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [pendingResponse, statsResponse] = await Promise.all([
          api.get('/admin/content/pending'),
          api.get('/admin/content/stats')
        ])
        
        setPendingContent(pendingResponse.data.content)
        setStats(statsResponse.data)
      } catch (error) {
        console.error('Error fetching moderation data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleAction = async (contentId, action, notes = '', featured = false) => {
    try {
      setActionLoading({ ...actionLoading, [contentId]: true })
      
      const endpoint = action === 'approve' ? 'approve' : 'reject'
      const payload = { notes }
      
      if (action === 'approve' && featured) {
        payload.featured = true
      }
      
      await api.put(`/admin/content/${contentId}/${endpoint}`, payload)
      
      // Remove from pending list
      setPendingContent(pendingContent.filter(item => item._id !== contentId))
      
      // Update stats
      setStats({
        ...stats,
        pending: stats.pending - 1,
        [action === 'approve' ? 'approved' : 'rejected']: stats[action === 'approve' ? 'approved' : 'rejected'] + 1
      })
      
      setShowModal(false)
      setSelectedContent(null)
      setModerationNotes('')
    } catch (error) {
      console.error(`Error ${action}ing content:`, error)
      alert(`Failed to ${action} content. Please try again.`)
    } finally {
      setActionLoading({ ...actionLoading, [contentId]: false })
    }
  }

  const openModal = (content, action) => {
    setSelectedContent(content)
    setModalAction(action)
    setModerationNotes('')
    setShowModal(true)
  }

  const ContentCard = ({ content }) => {
    const isVideo = content.contentType === 'video'
    
    return (
      <div className="card">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                isVideo ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
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
              <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
                {content.category}
              </span>
            </div>
            
            <div className="flex items-center text-sm text-gray-500">
              <Calendar className="h-4 w-4 mr-1" />
              {new Date(content.createdAt).toLocaleDateString()}
            </div>
          </div>
          
          {/* Title */}
          <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
            {content.title}
          </h3>
          
          {/* Description */}
          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
            {content.description}
          </p>
          
          {/* Author */}
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mr-3">
              {content.author?.avatar ? (
                <img
                  src={content.author.avatar}
                  alt={content.authorName}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <User className="h-4 w-4 text-white" />
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{content.authorName}</p>
              <p className="text-xs text-gray-500">{content.authorEmail}</p>
            </div>
          </div>
          
          {/* Content Preview */}
          {content.textContent && (
            <div className="bg-gray-50 rounded-lg p-3 mb-4">
              <p className="text-sm text-gray-700 line-clamp-4">
                {content.textContent.substring(0, 200)}...
              </p>
            </div>
          )}
          
          {/* Video Info */}
          {content.videoFile && (
            <div className="bg-gray-50 rounded-lg p-3 mb-4">
              <div className="text-sm text-gray-700">
                {content.videoFile.originalName && (
                  <p><strong>File:</strong> {content.videoFile.originalName}</p>
                )}
                {content.videoFile.url && !content.videoFile.originalName && (
                  <p><strong>URL:</strong> {content.videoFile.url}</p>
                )}
                {content.videoFile.size && (
                  <p><strong>Size:</strong> {(content.videoFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                )}
              </div>
            </div>
          )}
          
          {/* Tags */}
          {content.tags && content.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-4">
              {content.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-block px-2 py-1 bg-primary-50 text-primary-700 text-xs rounded"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
          
          {/* Actions */}
          <div className="flex justify-between items-center pt-4 border-t border-gray-200">
            <button
              onClick={() => window.open(`/user-content/${content.slug}`, '_blank')}
              className="btn btn-outline btn-sm"
            >
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </button>
            
            <div className="flex space-x-2">
              <button
                onClick={() => openModal(content, 'reject')}
                disabled={actionLoading[content._id]}
                className="btn btn-red btn-sm"
              >
                <X className="h-4 w-4 mr-2" />
                Reject
              </button>
              <button
                onClick={() => openModal(content, 'approve')}
                disabled={actionLoading[content._id]}
                className="btn btn-green btn-sm"
              >
                <Check className="h-4 w-4 mr-2" />
                Approve
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (loading) return <LoadingSpinner />

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Content Moderation</h1>
          <p className="text-gray-600">
            Review and moderate user-submitted content before publication
          </p>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <div className="card">
              <div className="p-6 text-center">
                <div className="text-3xl font-bold text-yellow-600 mb-2">{stats.pending}</div>
                <div className="text-sm text-gray-600">Pending Review</div>
              </div>
            </div>
            <div className="card">
              <div className="p-6 text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">{stats.approved}</div>
                <div className="text-sm text-gray-600">Approved</div>
              </div>
            </div>
            <div className="card">
              <div className="p-6 text-center">
                <div className="text-3xl font-bold text-red-600 mb-2">{stats.rejected}</div>
                <div className="text-sm text-gray-600">Rejected</div>
              </div>
            </div>
            <div className="card">
              <div className="p-6 text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">{stats.total}</div>
                <div className="text-sm text-gray-600">Total Reviewed</div>
              </div>
            </div>
          </div>
        )}

        {/* Pending Content */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Pending Content ({pendingContent.length})
          </h2>
          
          {pendingContent.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-6">
              {pendingContent.map((content) => (
                <ContentCard key={content._id} content={content} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md mx-auto">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">All Caught Up!</h3>
                <p className="text-gray-600">
                  No content is currently pending review. Great job keeping up with moderation!
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Moderation Modal */}
      {showModal && selectedContent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="card max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  {modalAction === 'approve' ? 'Approve' : 'Reject'} Content
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              {/* Content Summary */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-gray-900 mb-2">{selectedContent.title}</h4>
                <p className="text-sm text-gray-600 mb-2">{selectedContent.description}</p>
                <div className="flex items-center text-sm text-gray-500">
                  <User className="h-4 w-4 mr-1" />
                  {selectedContent.authorName}
                </div>
              </div>
              
              {/* Notes */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {modalAction === 'approve' ? 'Approval Notes (Optional)' : 'Rejection Reason (Required)'}
                </label>
                <textarea
                  value={moderationNotes}
                  onChange={(e) => setModerationNotes(e.target.value)}
                  rows={4}
                  className="textarea w-full"
                  placeholder={
                    modalAction === 'approve' 
                      ? 'Add any notes about this approval...'
                      : 'Please explain why this content is being rejected...'
                  }
                  required={modalAction === 'reject'}
                />
              </div>
              
              {/* Featured Option for Approval */}
              {modalAction === 'approve' && (
                <div className="mb-6">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      id="featured"
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 mr-2"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Mark as Featured Content
                    </span>
                  </label>
                </div>
              )}
              
              {/* Actions */}
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    const featured = document.getElementById('featured')?.checked || false
                    handleAction(selectedContent._id, modalAction, moderationNotes, featured)
                  }}
                  disabled={modalAction === 'reject' && !moderationNotes.trim()}
                  className={`btn ${
                    modalAction === 'approve' ? 'btn-green' : 'btn-red'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {modalAction === 'approve' ? 'Approve' : 'Reject'} Content
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ContentModeration