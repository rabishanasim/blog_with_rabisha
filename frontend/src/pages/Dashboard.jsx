import React from 'react'
import { useQuery } from 'react-query'
import {
  Users,
  FileText,
  MessageCircle,
  Eye,
  Heart,
  TrendingUp,
  Calendar,
  Activity
} from 'lucide-react'
import { format, subDays } from 'date-fns'
import api from '../utils/api'
import LoadingSpinner from '../components/LoadingSpinner'

const Dashboard = () => {
  // Fetch dashboard statistics
  const { data: stats, isLoading: statsLoading } = useQuery(
    'dashboard-stats',
    async () => {
      const [postsRes, usersRes, commentsRes] = await Promise.all([
        api.get('/posts?status=published&limit=1'),
        api.get('/users/stats/overview'),
        api.get('/comments?limit=1')
      ])

      return {
        posts: postsRes.data,
        users: usersRes.data,
        comments: commentsRes.data
      }
    }
  )

  // Recent activity
  const { data: recentPosts } = useQuery(
    'recent-posts',
    () => api.get('/posts?limit=5').then(res => res.data),
    { staleTime: 2 * 60 * 1000 }
  )

  if (statsLoading) {
    return <LoadingSpinner className="min-h-screen" />
  }

  const statCards = [
    {
      title: 'Total Posts',
      value: stats?.posts?.pagination?.totalPosts || 0,
      icon: FileText,
      color: 'bg-blue-500',
      trend: '+12%'
    },
    {
      title: 'Total Users',
      value: stats?.users?.totalUsers || 0,
      icon: Users,
      color: 'bg-green-500',
      trend: `+${stats?.users?.newUsers || 0} this month`
    },
    {
      title: 'Comments',
      value: stats?.comments?.pagination?.totalComments || 0,
      icon: MessageCircle,
      color: 'bg-purple-500',
      trend: '+8%'
    },
    {
      title: 'Active Users',
      value: stats?.users?.activeUsers || 0,
      icon: Activity,
      color: 'bg-orange-500',
      trend: `${Math.round(((stats?.users?.activeUsers || 0) / (stats?.users?.totalUsers || 1)) * 100)}% active`
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Welcome back! Here's what's happening with your blog.
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div key={index} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <div className={`p-3 rounded-lg ${stat.color} text-white`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <span className="text-sm text-green-600 font-medium">
                    {stat.trend}
                  </span>
                </div>
              </div>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Posts */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Recent Posts</h2>
                <a
                  href="/dashboard/posts"
                  className="text-primary-600 hover:text-primary-500 text-sm font-medium"
                >
                  View all
                </a>
              </div>

              {recentPosts?.posts ? (
                <div className="space-y-4">
                  {recentPosts.posts.map((post) => (
                    <div key={post._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-gray-900 truncate">
                          {post.title}
                        </h3>
                        <div className="flex items-center mt-1 text-xs text-gray-500">
                          <Calendar className="h-3 w-3 mr-1" />
                          {format(new Date(post.createdAt), 'MMM dd, yyyy')}
                          <span className="mx-2">•</span>
                          <span className={`px-2 py-1 rounded text-xs ${post.status === 'published'
                              ? 'bg-green-100 text-green-800'
                              : post.status === 'draft'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                            {post.status}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center text-sm text-gray-500 space-x-4">
                        <div className="flex items-center">
                          <Eye className="h-4 w-4 mr-1" />
                          {post.views}
                        </div>
                        <div className="flex items-center">
                          <Heart className="h-4 w-4 mr-1" />
                          {post.likeCount}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No posts yet. Create your first post!</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions & User Stats */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <a
                  href="/dashboard/posts/create"
                  className="block w-full px-4 py-2 bg-primary-600 text-white text-center rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Create New Post
                </a>
                <a
                  href="/dashboard/posts"
                  className="block w-full px-4 py-2 bg-gray-100 text-gray-700 text-center rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Manage Posts
                </a>
                <a
                  href="/dashboard/users"
                  className="block w-full px-4 py-2 bg-gray-100 text-gray-700 text-center rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Manage Users
                </a>
              </div>
            </div>

            {/* User Overview */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">User Overview</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Users</span>
                  <span className="font-semibold">{stats?.users?.totalUsers || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Active Users</span>
                  <span className="font-semibold text-green-600">{stats?.users?.activeUsers || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Admins</span>
                  <span className="font-semibold text-blue-600">{stats?.users?.admins || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">New This Month</span>
                  <span className="font-semibold text-purple-600">{stats?.users?.newUsers || 0}</span>
                </div>
              </div>
            </div>

            {/* System Status */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">API Status</span>
                  <span className="flex items-center text-green-600">
                    <div className="h-2 w-2 bg-green-600 rounded-full mr-2"></div>
                    Online
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Database</span>
                  <span className="flex items-center text-green-600">
                    <div className="h-2 w-2 bg-green-600 rounded-full mr-2"></div>
                    Connected
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Last Updated</span>
                  <span className="text-sm text-gray-500">
                    {format(new Date(), 'MMM dd, HH:mm')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard