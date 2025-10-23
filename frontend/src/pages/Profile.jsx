import React from 'react'
import { useQuery } from 'react-query'
import { useAuth } from '../contexts/AuthContext'
import api from '../utils/api'
import LoadingSpinner from '../components/LoadingSpinner'

const Profile = () => {
  const { user } = useAuth()

  const { data: userPosts, isLoading } = useQuery(
    'user-posts',
    () => api.get(`/posts?author=${user.id}`).then(res => res.data),
    { enabled: !!user }
  )

  if (isLoading) return <LoadingSpinner />

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">My Profile</h1>

          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">First Name</label>
                  <p className="mt-1 text-sm text-gray-900">{user?.firstName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Last Name</label>
                  <p className="mt-1 text-sm text-gray-900">{user?.lastName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <p className="mt-1 text-sm text-gray-900">{user?.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Username</label>
                  <p className="mt-1 text-sm text-gray-900">{user?.username}</p>
                </div>
              </div>

              {user?.bio && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">Bio</label>
                  <p className="mt-1 text-sm text-gray-900">{user.bio}</p>
                </div>
              )}
            </div>

            {user?.role === 'admin' && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Admin Actions</h2>
                <div className="space-y-2">
                  <a
                    href="/dashboard"
                    className="block px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-center"
                  >
                    Go to Dashboard
                  </a>
                </div>
              </div>
            )}

            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">My Posts</h2>
              {userPosts?.posts?.length > 0 ? (
                <div className="space-y-4">
                  {userPosts.posts.map((post) => (
                    <div key={post._id} className="border border-gray-200 rounded-lg p-4">
                      <h3 className="font-medium text-gray-900">{post.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Status: {post.status} • {post.views} views
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">You haven't written any posts yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile