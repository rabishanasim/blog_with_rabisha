import React from 'react'

const CategoryList = ({ categories, selectedCategory, onCategoryChange }) => {
  if (!categories || categories.length === 0) return null

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <button
        onClick={() => onCategoryChange('')}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
          !selectedCategory
            ? 'bg-primary-600 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        All Categories
      </button>
      {categories.map((category) => (
        <button
          key={category._id}
          onClick={() => onCategoryChange(category.slug)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            selectedCategory === category.slug
              ? 'bg-primary-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {category.name} ({category.postCount})
        </button>
      ))}
    </div>
  )
}

export default CategoryList