import React, { useState, useEffect } from 'react'
import { Mail, MapPin, Calendar, Award, BookOpen, Users } from 'lucide-react'
import { adminAPI } from '../utils/api'

const AdminProfile = ({ variant = 'default', showStats = false }) => {
  const [adminInfo, setAdminInfo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch admin settings from backend
  useEffect(() => {
    const fetchAdminInfo = async () => {
      try {
        const settings = await adminAPI.getSettings()

        // Transform backend data to match component needs
        const adminData = {
          name: settings.fullName || `${settings.firstName} ${settings.lastName}`,
          title: settings.title || 'Blog Admin & Content Creator',
          bio: settings.bio || 'Welcome to my blog!',
          email: settings.email || 'admin@example.com',
          location: settings.location || 'Unknown Location',
          joinDate: new Date(settings.joinDate).toLocaleDateString('en-US', {
            month: 'long',
            year: 'numeric'
          }),
          avatar: settings.avatarUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
          skills: settings.skills || ['Content Writing', 'Blog Management'],
          stats: {
            posts: '0', // This will be updated dynamically
            followers: '0', // This will grow as your blog grows
            views: '0', // Total blog views
            experience: Math.max(1, new Date().getFullYear() - new Date(settings.joinDate).getFullYear()) + '+' // Calculate years
          }
        }

        setAdminInfo(adminData)
      } catch (err) {
        console.error('Failed to load admin info:', err)
        setError('Failed to load admin information')

        // Fallback to default data if backend fails
        setAdminInfo({
          name: 'Blog Admin',
          title: 'Blog Admin & Content Creator',
          bio: 'Welcome to my blog!',
          email: 'admin@example.com',
          location: 'Unknown Location',
          joinDate: 'Recent',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
          skills: ['Content Writing', 'Blog Management'],
          stats: {
            posts: '0',
            followers: '0',
            views: '0',
            experience: '1+'
          }
        })
      } finally {
        setLoading(false)
      }
    }

    fetchAdminInfo()
  }, [])

  if (loading) {
    return (
      <div className="card">
        <div className="p-6 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading admin profile...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="card">
        <div className="p-6 text-center">
          <p className="text-red-500 text-sm">{error}</p>
        </div>
      </div>
    )
  }

  if (variant === 'compact') {
    return (
      <div className="card">
        <div className="p-6">
          <div className="flex items-center space-x-4">
            <img
              src={adminInfo.avatar}
              alt={adminInfo.name}
              className="w-16 h-16 rounded-full object-cover ring-4 ring-primary-100"
            />
            <div>
              <h3 className="text-lg font-bold text-gray-900">{adminInfo.name}</h3>
              <p className="text-primary-600 font-medium">{adminInfo.title}</p>
              <div className="flex items-center text-sm text-gray-500 mt-1">
                <MapPin className="h-4 w-4 mr-1" />
                {adminInfo.location}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="p-6">
        {/* Header */}
        <div className="text-center mb-6">
          <img
            src={adminInfo.avatar}
            alt={adminInfo.name}
            className="w-24 h-24 rounded-full mx-auto mb-4 object-cover ring-4 ring-primary-100"
          />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{adminInfo.name}</h2>
          <p className="text-primary-600 font-medium mb-3">{adminInfo.title}</p>
          <p className="text-gray-600 text-sm leading-relaxed">{adminInfo.bio}</p>
        </div>

        {/* Contact Info */}
        <div className="border-t border-gray-100 pt-6 mb-6">
          <div className="space-y-3">
            <div className="flex items-center text-sm">
              <Mail className="h-4 w-4 text-gray-400 mr-3" />
              <a
                href={`mailto:${adminInfo.email}`}
                className="text-gray-600 hover:text-primary-600 transition-colors"
              >
                {adminInfo.email}
              </a>
            </div>
            <div className="flex items-center text-sm">
              <MapPin className="h-4 w-4 text-gray-400 mr-3" />
              <span className="text-gray-600">{adminInfo.location}</span>
            </div>
            <div className="flex items-center text-sm">
              <Calendar className="h-4 w-4 text-gray-400 mr-3" />
              <span className="text-gray-600">Started {adminInfo.joinDate}</span>
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="border-t border-gray-100 pt-6 mb-6">
          <h4 className="text-sm font-semibold text-gray-900 mb-3">Expertise</h4>
          <div className="flex flex-wrap gap-2">
            {adminInfo.skills.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-primary-50 text-primary-700 text-xs rounded-full font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Stats */}
        {showStats && (
          <div className="border-t border-gray-100 pt-6">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Blog Stats</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-lg font-bold text-primary-600">{adminInfo.stats.posts}</div>
                <div className="text-xs text-gray-500">Posts</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-primary-600">{adminInfo.stats.views}</div>
                <div className="text-xs text-gray-500">Views</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-primary-600">{adminInfo.stats.followers}</div>
                <div className="text-xs text-gray-500">Followers</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-primary-600">{adminInfo.stats.experience}</div>
                <div className="text-xs text-gray-500">Years</div>
              </div>
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="border-t border-gray-100 pt-6 text-center">
          <a
            href={`mailto:${adminInfo.email}`}
            className="btn btn-primary btn-sm w-full"
          >
            <Mail className="h-4 w-4 mr-2" />
            Get In Touch
          </a>
        </div>
      </div>
    </div>
  )
}

export default AdminProfile