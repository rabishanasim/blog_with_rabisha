import React from 'react'
import { useQuery } from 'react-query'
import { Link } from 'react-router-dom'
import { Calendar, Eye } from 'lucide-react'
import { format } from 'date-fns'
import api from '../utils/api'

const RelatedPosts = ({ currentPostId, categoryId, tags }) => {
  const { data: relatedPosts } = useQuery(
    ['related-posts', currentPostId, categoryId],
    async () => {
      // Try to find posts in the same category first
      let query = `/posts?category=${categoryId}&limit=3`
      
      const response = await api.get(query)
      let posts = response.data.posts || []
      
      // Filter out the current post
      posts = posts.filter(post => post._id !== currentPostId)
      
      // If we don't have enough posts, try to get more by tags
      if (posts.length < 3 && tags && tags.length > 0) {
        const tagQuery = `/posts?tag=${tags[0]}&limit=6`
        const tagResponse = await api.get(tagQuery)
        const tagPosts = (tagResponse.data.posts || []).filter(
          post => post._id !== currentPostId && !posts.find(p => p._id === post._id)
        )
        posts = [...posts, ...tagPosts].slice(0, 3)
      }
      
      return posts.slice(0, 3)
    },
    {
      enabled: !!(categoryId || (tags && tags.length > 0)),
      staleTime: 5 * 60 * 1000 // 5 minutes
    }
  )

  if (!relatedPosts || relatedPosts.length === 0) {
    return null
  }

  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Posts</h2>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {relatedPosts.map((post) => (
            <Link
              key={post._id}
              to={`/post/${post.slug}`}
              className="group block"
            >
              <article className="bg-gray-50 rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200">
                {/* Featured Image */}
                {post.featuredImage && (
                  <div className="aspect-w-16 aspect-h-9">
                    <img
                      src={post.featuredImage}
                      alt={post.title}
                      className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                )}

                <div className="p-4">
                  {/* Category */}
                  {post.category && (
                    <span 
                      className="inline-block px-2 py-1 text-xs font-medium text-white rounded mb-2"
                      style={{ backgroundColor: post.category.color }}
                    >
                      {post.category.name}
                    </span>
                  )}

                  {/* Title */}
                  <h3 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
                    {post.title}
                  </h3>

                  {/* Excerpt */}
                  {post.excerpt && (
                    <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                      {post.excerpt}
                    </p>
                  )}

                  {/* Meta */}
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {format(new Date(post.publishedAt), 'MMM dd')}
                    </div>
                    <div className="flex items-center">
                      <Eye className="h-3 w-3 mr-1" />
                      {post.views}
                    </div>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export default RelatedPosts