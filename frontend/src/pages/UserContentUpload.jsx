import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Upload, Video, FileText, Image, Link as LinkIcon, X, Plus } from 'lucide-react'
import api from '../utils/api'
import { useAuth } from '../contexts/AuthContext'

const UserContentUpload = () => {
    const navigate = useNavigate()
    const { user, isAuthenticated } = useAuth()

    const [contentType, setContentType] = useState('text')
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        textContent: '',
        category: 'technology',
        tags: '',
        videoUrl: '',
        metaTitle: '',
        metaDescription: ''
    })

    const [files, setFiles] = useState({
        video: null,
        featuredImage: null,
        thumbnail: null
    })

    const [externalLinks, setExternalLinks] = useState([])
    const [isUploading, setIsUploading] = useState(false)
    const [uploadProgress, setUploadProgress] = useState(0)
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(false)

    const categories = [
        { value: 'technology', label: 'Technology' },
        { value: 'lifestyle', label: 'Lifestyle' },
        { value: 'travel', label: 'Travel' },
        { value: 'food', label: 'Food' },
        { value: 'business', label: 'Business' },
        { value: 'health', label: 'Health' },
        { value: 'education', label: 'Education' },
        { value: 'entertainment', label: 'Entertainment' },
        { value: 'sports', label: 'Sports' },
        { value: 'gaming', label: 'Gaming' },
        { value: 'music', label: 'Music' },
        { value: 'art', label: 'Art' },
        { value: 'science', label: 'Science' },
        { value: 'politics', label: 'Politics' },
        { value: 'other', label: 'Other' }
    ]

    // Redirect if not authenticated
    if (!isAuthenticated) {
        navigate('/login')
        return null
    }

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleFileChange = (e) => {
        const { name, files: selectedFiles } = e.target
        if (selectedFiles[0]) {
            setFiles({
                ...files,
                [name]: selectedFiles[0]
            })
        }
    }

    const addExternalLink = () => {
        setExternalLinks([...externalLinks, { title: '', url: '', description: '' }])
    }

    const updateExternalLink = (index, field, value) => {
        const updatedLinks = [...externalLinks]
        updatedLinks[index][field] = value
        setExternalLinks(updatedLinks)
    }

    const removeExternalLink = (index) => {
        setExternalLinks(externalLinks.filter((_, i) => i !== index))
    }

    const validateForm = () => {
        if (!formData.title.trim()) {
            setError('Title is required')
            return false
        }

        if (!formData.description.trim()) {
            setError('Description is required')
            return false
        }

        if (contentType === 'text' && !formData.textContent.trim()) {
            setError('Text content is required for articles')
            return false
        }

        if (contentType === 'video' && !files.video && !formData.videoUrl.trim()) {
            setError('Video file or video URL is required for video content')
            return false
        }

        return true
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null)

        if (!validateForm()) {
            return
        }

        setIsUploading(true)
        setUploadProgress(0)

        try {
            const submitData = new FormData()

            // Add form data
            Object.keys(formData).forEach(key => {
                if (formData[key]) {
                    submitData.append(key, formData[key])
                }
            })

            submitData.append('contentType', contentType)

            // Add external links
            if (externalLinks.length > 0) {
                submitData.append('externalLinks', JSON.stringify(externalLinks.filter(link => link.title && link.url)))
            }

            // Add files
            Object.keys(files).forEach(fileType => {
                if (files[fileType]) {
                    submitData.append(fileType, files[fileType])
                }
            })

            // Simulate upload progress
            const progressInterval = setInterval(() => {
                setUploadProgress(prev => Math.min(prev + 10, 90))
            }, 200)

            const response = await api.post('/user-content', submitData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })

            clearInterval(progressInterval)
            setUploadProgress(100)

            setSuccess(true)

            // Reset form after success
            setTimeout(() => {
                navigate('/my-content')
            }, 2000)

        } catch (err) {
            console.error('Upload error:', err)
            setError(err.response?.data?.message || 'Failed to upload content')
        } finally {
            setIsUploading(false)
        }
    }

    if (success) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="card max-w-md mx-4">
                    <div className="p-8 text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                            <Upload className="h-8 w-8 text-green-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-3">Content Uploaded!</h2>
                        <p className="text-gray-600 mb-6">
                            Your content has been submitted successfully and is pending admin approval.
                        </p>
                        <div className="text-sm text-gray-500">
                            Redirecting to your content...
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Upload Your Content</h1>
                    <p className="text-gray-600">
                        Share your articles and video vlogs with the community. All content is reviewed before publication.
                    </p>
                </div>

                {/* Content Type Selection */}
                <div className="card mb-8">
                    <div className="p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Choose Content Type</h2>
                        <div className="grid md:grid-cols-2 gap-4">
                            <button
                                type="button"
                                onClick={() => setContentType('text')}
                                className={`p-6 rounded-lg border-2 transition-all duration-300 ${contentType === 'text'
                                        ? 'border-primary-500 bg-primary-50'
                                        : 'border-gray-200 hover:border-primary-300'
                                    }`}
                            >
                                <FileText className={`h-8 w-8 mx-auto mb-3 ${contentType === 'text' ? 'text-primary-600' : 'text-gray-400'
                                    }`} />
                                <h3 className="font-semibold text-gray-900 mb-2">Text Article</h3>
                                <p className="text-sm text-gray-600">
                                    Write and share articles, tutorials, stories, and more
                                </p>
                            </button>

                            <button
                                type="button"
                                onClick={() => setContentType('video')}
                                className={`p-6 rounded-lg border-2 transition-all duration-300 ${contentType === 'video'
                                        ? 'border-primary-500 bg-primary-50'
                                        : 'border-gray-200 hover:border-primary-300'
                                    }`}
                            >
                                <Video className={`h-8 w-8 mx-auto mb-3 ${contentType === 'video' ? 'text-primary-600' : 'text-gray-400'
                                    }`} />
                                <h3 className="font-semibold text-gray-900 mb-2">Video Vlog</h3>
                                <p className="text-sm text-gray-600">
                                    Upload videos or share links to YouTube, Vimeo, etc.
                                </p>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Error Alert */}
                {error && (
                    <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                        <div className="flex items-center">
                            <div className="w-4 h-4 bg-red-500 rounded-full mr-3"></div>
                            <p className="text-red-800 font-medium">{error}</p>
                        </div>
                    </div>
                )}

                {/* Upload Form */}
                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Basic Information */}
                    <div className="card">
                        <div className="p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Basic Information</h2>

                            <div className="grid md:grid-cols-2 gap-6 mb-6">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Title *
                                    </label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        required
                                        className="input w-full"
                                        placeholder="Enter a compelling title..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Category *
                                    </label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        required
                                        className="input w-full"
                                    >
                                        {categories.map(category => (
                                            <option key={category.value} value={category.value}>
                                                {category.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Tags
                                    </label>
                                    <input
                                        type="text"
                                        name="tags"
                                        value={formData.tags}
                                        onChange={handleInputChange}
                                        className="input w-full"
                                        placeholder="Separate tags with commas"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Description *
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    required
                                    rows={3}
                                    className="textarea w-full"
                                    placeholder="Brief description of your content..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="card">
                        <div className="p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">
                                {contentType === 'text' ? 'Article Content' : 'Video Content'}
                            </h2>

                            {contentType === 'text' ? (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Article Content *
                                    </label>
                                    <textarea
                                        name="textContent"
                                        value={formData.textContent}
                                        onChange={handleInputChange}
                                        rows={15}
                                        className="textarea w-full"
                                        placeholder="Write your article content here. You can use Markdown formatting..."
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        Supports Markdown formatting for headers, links, lists, etc.
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {/* Video Upload */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Video File
                                        </label>
                                        <input
                                            type="file"
                                            name="video"
                                            onChange={handleFileChange}
                                            accept="video/*"
                                            className="input w-full"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                            Supported formats: MP4, MOV, AVI, WebM (Max: 100MB)
                                        </p>
                                    </div>

                                    {/* Video URL Alternative */}
                                    <div className="text-center text-gray-500">
                                        <span>- OR -</span>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Video URL
                                        </label>
                                        <input
                                            type="url"
                                            name="videoUrl"
                                            value={formData.videoUrl}
                                            onChange={handleInputChange}
                                            className="input w-full"
                                            placeholder="https://youtube.com/watch?v=... or https://vimeo.com/..."
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                            YouTube, Vimeo, or other video platform links
                                        </p>
                                    </div>

                                    {/* Thumbnail */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Custom Thumbnail (Optional)
                                        </label>
                                        <input
                                            type="file"
                                            name="thumbnail"
                                            onChange={handleFileChange}
                                            accept="image/*"
                                            className="input w-full"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Media */}
                    <div className="card">
                        <div className="p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Featured Image</h2>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Featured Image (Optional)
                                </label>
                                <input
                                    type="file"
                                    name="featuredImage"
                                    onChange={handleFileChange}
                                    accept="image/*"
                                    className="input w-full"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    This will be displayed as the main image for your content
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* External Links */}
                    <div className="card">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-gray-900">External Links</h2>
                                <button
                                    type="button"
                                    onClick={addExternalLink}
                                    className="btn btn-outline btn-sm"
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Link
                                </button>
                            </div>

                            {externalLinks.map((link, index) => (
                                <div key={index} className="bg-gray-50 rounded-lg p-4 mb-4">
                                    <div className="flex justify-between items-start mb-4">
                                        <h4 className="font-medium text-gray-900">Link {index + 1}</h4>
                                        <button
                                            type="button"
                                            onClick={() => removeExternalLink(index)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <input
                                                type="text"
                                                placeholder="Link title"
                                                value={link.title}
                                                onChange={(e) => updateExternalLink(index, 'title', e.target.value)}
                                                className="input w-full"
                                            />
                                        </div>
                                        <div>
                                            <input
                                                type="url"
                                                placeholder="https://..."
                                                value={link.url}
                                                onChange={(e) => updateExternalLink(index, 'url', e.target.value)}
                                                className="input w-full"
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <input
                                                type="text"
                                                placeholder="Link description (optional)"
                                                value={link.description}
                                                onChange={(e) => updateExternalLink(index, 'description', e.target.value)}
                                                className="input w-full"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {externalLinks.length === 0 && (
                                <p className="text-gray-500 text-center py-8">
                                    No external links added yet. Click "Add Link" to include relevant resources.
                                </p>
                            )}
                        </div>
                    </div>

                    {/* SEO */}
                    <div className="card">
                        <div className="p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">SEO Settings (Optional)</h2>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Meta Title
                                    </label>
                                    <input
                                        type="text"
                                        name="metaTitle"
                                        value={formData.metaTitle}
                                        onChange={handleInputChange}
                                        className="input w-full"
                                        placeholder="SEO-friendly title (60 chars max)"
                                        maxLength={60}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Meta Description
                                    </label>
                                    <textarea
                                        name="metaDescription"
                                        value={formData.metaDescription}
                                        onChange={handleInputChange}
                                        rows={3}
                                        className="textarea w-full"
                                        placeholder="SEO description (160 chars max)"
                                        maxLength={160}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Upload Progress */}
                    {isUploading && (
                        <div className="card">
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-gray-700">Uploading...</span>
                                    <span className="text-sm text-gray-500">{uploadProgress}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                                        style={{ width: `${uploadProgress}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Submit */}
                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="btn btn-outline btn-lg"
                            disabled={isUploading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isUploading}
                            className="btn btn-primary btn-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isUploading ? (
                                <>
                                    <div className="loading-spinner mr-2"></div>
                                    Uploading...
                                </>
                            ) : (
                                <>
                                    <Upload className="h-5 w-5 mr-2" />
                                    Submit for Review
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default UserContentUpload