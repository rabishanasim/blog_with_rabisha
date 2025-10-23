import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Edit3, Trash2, Plus, Eye, BarChart } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { usePost } from '../contexts/PostContext'
import LoadingSpinner from '../components/LoadingSpinner'

const MyPosts = () => {
  const { user } = useAuth()
  const { getUserPosts, deletePost, isLoading: postLoading } = usePost()
  const [posts, setPosts] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (user) {
      setIsLoading(true)
      // Get all posts by the user (drafts and published)
      const userPosts = getUserPosts(user.id)
      setPosts(userPosts)
      setIsLoading(false)
    }
  }, [user, getUserPosts])

  const handleDelete = async (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      const result = await deletePost(postId)
      if (result.success) {
        // Refresh the posts list
        const userPosts = getUserPosts(user.id)
        setPosts(userPosts)
      }
    }
  }

  if (isLoading) return <LoadingSpinner />
  if (!user) return <div className="text-center text-red-600">Please login to view your posts</div>

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Posts</h1>
            <p className="text-gray-600 mt-2">
              Manage your blog posts and vlogs
            </p>
          </div>
          <Link
            to="/create-post"
            className="btn btn-primary inline-flex items-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create New Post
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-1">
                  <div className="text-2xl font-bold text-gray-900">{posts?.length || 0}</div>
                  <div className="text-sm text-gray-600">Total Posts</div>
                </div>
                <BarChart className="h-8 w-8 text-primary-600" />
              </div>
            </div>
          </div>
          <div className="card">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-1">
                  <div className="text-2xl font-bold text-green-600">
                    {posts?.filter(p => p.status === 'published').length || 0}
                  </div>
                  <div className="text-sm text-gray-600">Published</div>
                </div>
                <Eye className="h-8 w-8 text-green-600" />
              </div>
            </div>
          </div>
          <div className="card">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-1">
                  <div className="text-2xl font-bold text-yellow-600">
                    {posts?.filter(p => p.status === 'draft').length || 0}
                  </div>
                  <div className="text-sm text-gray-600">Drafts</div>
                </div>
                <Edit3 className="h-8 w-8 text-yellow-600" />
              </div>
            </div>
          </div>
          <div className="card">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-1">
                  <div className="text-2xl font-bold text-blue-600">
                    {posts?.reduce((total, post) => total + (post.views || 0), 0) || 0}
                  </div>
                  <div className="text-sm text-gray-600">Total Views</div>
                </div>
                <BarChart className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Posts List */}
        <div className="card overflow-hidden">
          {posts && posts.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Views
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {posts.map((post) => (
                    <tr key={post._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {post.title}
                        </div>
                        <div className="text-sm text-gray-500">
                          {post.excerpt}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${post.status === 'published'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                          }`}>
                          {post.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {post.views || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          {post.status === 'published' && (
                            <Link
                              to={`/post/${post.slug}`}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
                          )}
                          <Link
                            to={`/edit-post/${post._id}`}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            <Edit3 className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(post._id)}
                            className="text-red-600 hover:text-red-900 transition-colors"
                            disabled={postLoading}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-500 mb-4">No posts found</div>
              <Link
                to="/create-post"
                className="btn btn-primary inline-flex items-center"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create Your First Post
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MyPosts