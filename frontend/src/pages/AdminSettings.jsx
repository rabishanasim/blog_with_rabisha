import React, { useState } from 'react'
import { Save, Upload, User, Mail, MapPin, Globe, Phone, Camera } from 'lucide-react'

const AdminSettings = () => {
  const [adminSettings, setAdminSettings] = useState({
    // Personal Information
    firstName: 'Rabisha',
    lastName: 'Nasim',
    title: 'Blog Admin & Content Creator',
    bio: 'Welcome to my blog! I\'m passionate about sharing knowledge and connecting with like-minded individuals. This platform is where I share my thoughts, experiences, and insights on various topics.',
    
    // Contact Information
    email: 'admin@yourdomain.com',
    phone: '',
    location: 'Your City, Country',
    website: '',
    
    // Social Media (optional)
    twitter: '',
    linkedin: '',
    github: '',
    instagram: '',
    
    // Blog Settings
    blogTitle: 'My Personal Blog',
    blogSubtitle: 'Sharing knowledge and experiences',
    blogDescription: 'A place where I share my thoughts, insights, and experiences on various topics that matter to me.',
    
    // Profile Image
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200'
  })

  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleInputChange = (e) => {
    setAdminSettings({
      ...adminSettings,
      [e.target.name]: e.target.value
    })
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setIsSaving(true)
    
    // Save to localStorage for now (you can integrate with backend later)
    localStorage.setItem('admin_settings', JSON.stringify(adminSettings))
    
    // Simulate save delay
    setTimeout(() => {
      setIsSaving(false)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Settings</h1>
          <p className="text-gray-600">
            Customize your profile and blog information. This will be displayed across your blog platform.
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-8">
          {/* Personal Information */}
          <div className="card">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <User className="h-5 w-5 mr-2 text-primary-600" />
                Personal Information
              </h2>
              
              {/* Profile Image */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profile Image URL
                </label>
                <div className="flex items-center space-x-4">
                  <img
                    src={adminSettings.avatarUrl}
                    alt="Profile Preview"
                    className="w-16 h-16 rounded-full object-cover ring-4 ring-primary-100"
                  />
                  <div className="flex-1">
                    <input
                      type="url"
                      name="avatarUrl"
                      value={adminSettings.avatarUrl}
                      onChange={handleInputChange}
                      className="input w-full"
                      placeholder="https://example.com/your-photo.jpg"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Use a square image (200x200px minimum) for best results
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={adminSettings.firstName}
                    onChange={handleInputChange}
                    className="input w-full"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={adminSettings.lastName}
                    onChange={handleInputChange}
                    className="input w-full"
                    required
                  />
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Professional Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={adminSettings.title}
                  onChange={handleInputChange}
                  className="input w-full"
                  placeholder="e.g., Blog Admin & Content Creator"
                />
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bio / About You
                </label>
                <textarea
                  name="bio"
                  value={adminSettings.bio}
                  onChange={handleInputChange}
                  rows={4}
                  className="textarea w-full"
                  placeholder="Tell visitors about yourself..."
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="card">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <Mail className="h-5 w-5 mr-2 text-primary-600" />
                Contact Information
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={adminSettings.email}
                    onChange={handleInputChange}
                    className="input w-full"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone (Optional)
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={adminSettings.phone}
                    onChange={handleInputChange}
                    className="input w-full"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mt-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={adminSettings.location}
                    onChange={handleInputChange}
                    className="input w-full"
                    placeholder="City, Country"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Website (Optional)
                  </label>
                  <input
                    type="url"
                    name="website"
                    value={adminSettings.website}
                    onChange={handleInputChange}
                    className="input w-full"
                    placeholder="https://yourwebsite.com"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Blog Settings */}
          <div className="card">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <Globe className="h-5 w-5 mr-2 text-primary-600" />
                Blog Settings
              </h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Blog Title
                </label>
                <input
                  type="text"
                  name="blogTitle"
                  value={adminSettings.blogTitle}
                  onChange={handleInputChange}
                  className="input w-full"
                  placeholder="My Personal Blog"
                />
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Blog Subtitle
                </label>
                <input
                  type="text"
                  name="blogSubtitle"
                  value={adminSettings.blogSubtitle}
                  onChange={handleInputChange}
                  className="input w-full"
                  placeholder="A brief description of your blog"
                />
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Blog Description
                </label>
                <textarea
                  name="blogDescription"
                  value={adminSettings.blogDescription}
                  onChange={handleInputChange}
                  rows={3}
                  className="textarea w-full"
                  placeholder="Describe what your blog is about..."
                />
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className="card">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Social Media Links (Optional)
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Twitter Username
                  </label>
                  <input
                    type="text"
                    name="twitter"
                    value={adminSettings.twitter}
                    onChange={handleInputChange}
                    className="input w-full"
                    placeholder="@yourusername"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    LinkedIn Profile
                  </label>
                  <input
                    type="text"
                    name="linkedin"
                    value={adminSettings.linkedin}
                    onChange={handleInputChange}
                    className="input w-full"
                    placeholder="linkedin.com/in/yourprofile"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    GitHub Username
                  </label>
                  <input
                    type="text"
                    name="github"
                    value={adminSettings.github}
                    onChange={handleInputChange}
                    className="input w-full"
                    placeholder="github.com/yourusername"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Instagram Username
                  </label>
                  <input
                    type="text"
                    name="instagram"
                    value={adminSettings.instagram}
                    onChange={handleInputChange}
                    className="input w-full"
                    placeholder="@yourusername"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="submit"
              disabled={isSaving}
              className="btn btn-primary btn-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <>
                  <div className="loading-spinner mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-5 w-5 mr-2" />
                  Save Settings
                </>
              )}
            </button>
          </div>

          {/* Success Message */}
          {saved && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-500 rounded-full mr-3"></div>
                <p className="text-green-800 font-medium">Settings saved successfully!</p>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}

export default AdminSettings