import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from 'react-query'
import { useNavigate } from 'react-router-dom'
import { Save, Upload, Eye } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../utils/api'

const CreatePost = () => {
  const [preview, setPreview] = useState(false)
  const [imagePreview, setImagePreview] = useState('')
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm({
    defaultValues: {
      status: 'draft',
      featured: false
    }
  })

  const watchContent = watch('content', '')

  const createPostMutation = useMutation(
    (formData) => api.post('/posts', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    }),
    {
      onSuccess: (data) => {
        toast.success('Post created successfully!')
        queryClient.invalidateQueries('posts')
        queryClient.invalidateQueries('my-posts')
        navigate('/my-posts')
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to create post')
      }
    }
  )

  const onSubmit = (data) => {
    const formData = new FormData()
    
    // Append text fields
    Object.keys(data).forEach(key => {
      if (key !== 'featuredImage') {
        formData.append(key, data[key])
      }
    })

    // Append file if selected
    if (data.featuredImage && data.featuredImage[0]) {
      formData.append('featuredImage', data.featuredImage[0])
    }

    createPostMutation.mutate(formData)
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create New Post</h1>
          <p className="text-gray-600 mt-2">
            Share your thoughts with the world
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            {/* Title */}
            <div className="mb-6">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                id="title"
                type="text"
                className={`input ${errors.title ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                placeholder="Enter your post title..."
                {...register('title', {
                  required: 'Title is required',
                  maxLength: {
                    value: 200,
                    message: 'Title must be less than 200 characters'
                  }
                })}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>

            {/* Excerpt */}
            <div className="mb-6">
              <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-2">
                Excerpt
              </label>
              <textarea
                id="excerpt"
                rows={3}
                className="input"
                placeholder="Brief description of your post..."
                {...register('excerpt', {
                  maxLength: {
                    value: 300,
                    message: 'Excerpt must be less than 300 characters'
                  }
                })}
              />
              {errors.excerpt && (
                <p className="mt-1 text-sm text-red-600">{errors.excerpt.message}</p>
              )}
            </div>

            {/* Featured Image */}
            <div className="mb-6">
              <label htmlFor="featuredImage" className="block text-sm font-medium text-gray-700 mb-2">
                Featured Image
              </label>
              <input
                id="featuredImage"
                type="file"
                accept="image/*"
                className="input"
                {...register('featuredImage')}
                onChange={handleImageChange}
              />
              {imagePreview && (
                <div className="mt-4">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="h-48 w-full object-cover rounded-lg"
                  />
                </div>
              )}
            </div>

            {/* Content */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                  Content *
                </label>
                <button
                  type="button"
                  onClick={() => setPreview(!preview)}
                  className="flex items-center text-sm text-primary-600 hover:text-primary-500"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  {preview ? 'Edit' : 'Preview'}
                </button>
              </div>
              
              {preview ? (
                <div className="min-h-[300px] p-4 border border-gray-300 rounded-md bg-gray-50 prose max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: watchContent.replace(/\n/g, '<br>') }} />
                </div>
              ) : (
                <textarea
                  id="content"
                  rows={15}
                  className={`input ${errors.content ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                  placeholder="Write your post content here... (Supports Markdown)"
                  {...register('content', {
                    required: 'Content is required'
                  })}
                />
              )}
              {errors.content && (
                <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
              )}
            </div>

            {/* Tags */}
            <div className="mb-6">
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <input
                id="tags"
                type="text"
                className="input"
                placeholder="Enter tags separated by commas (e.g., technology, programming, tutorial)"
                {...register('tags')}
              />
              <p className="mt-1 text-sm text-gray-500">
                Separate tags with commas
              </p>
            </div>
          </div>

          {/* Settings */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Post Settings</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Category */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  id="category"
                  className="input"
                  {...register('category')}
                >
                  <option value="">Select a category (optional)</option>
                  <option value="">No Category</option>
                </select>
              </div>

              {/* Status */}
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  id="status"
                  className="input"
                  {...register('status')}
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>

              {/* Featured */}
              <div className="flex items-center">
                <input
                  id="featured"
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  {...register('featured')}
                />
                <label htmlFor="featured" className="ml-2 block text-sm text-gray-900">
                  Featured Post
                </label>
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/dashboard/posts')}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createPostMutation.isLoading}
              className="btn btn-primary"
            >
              {createPostMutation.isLoading ? (
                <div className="loading-spinner h-5 w-5 mr-2"></div>
              ) : (
                <Save className="h-5 w-5 mr-2" />
              )}
              Create Post
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreatePost