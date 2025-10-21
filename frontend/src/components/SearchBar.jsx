import React, { useState, useRef, useEffect } from 'react'
import { Search, X, Clock, TrendingUp } from 'lucide-react'
import { useSearch } from '../contexts/SearchContext'
import { Link } from 'react-router-dom'

const SearchBar = ({ 
  placeholder = "Search posts...", 
  className = "", 
  showResults = true,
  size = "default" // "default" | "large"
}) => {
  const { 
    searchTerm, 
    setSearchTerm, 
    searchResults, 
    isSearching, 
    searchHistory, 
    handleSearch, 
    clearSearch,
    clearHistory,
    navigateToSearch 
  } = useSearch()
  
  const [isOpen, setIsOpen] = useState(false)
  const [localQuery, setLocalQuery] = useState(searchTerm)
  const searchRef = useRef(null)
  const resultsRef = useRef(null)

  // Popular search terms (in a real app, this would come from analytics)
  const popularSearches = [
    'JavaScript', 'React', 'Node.js', 'Python', 'Web Development', 
    'Machine Learning', 'DevOps', 'CSS', 'TypeScript', 'API'
  ]

  useEffect(() => {
    setLocalQuery(searchTerm)
  }, [searchTerm])

  // Close results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchRef.current && 
        !searchRef.current.contains(event.target) &&
        resultsRef.current &&
        !resultsRef.current.contains(event.target)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (localQuery.trim()) {
      handleSearch(localQuery)
      setIsOpen(false)
    }
  }

  const handleInputChange = (e) => {
    const value = e.target.value
    setLocalQuery(value)
    setSearchTerm(value)
    
    // Show dropdown when typing
    if (value.trim()) {
      setIsOpen(true)
    }
  }

  const handleHistoryClick = (query) => {
    setLocalQuery(query)
    navigateToSearch(query)
    setIsOpen(false)
  }

  const handleClear = () => {
    setLocalQuery('')
    clearSearch()
    setIsOpen(false)
    searchRef.current?.querySelector('input')?.focus()
  }

  const inputClasses = size === "large" 
    ? "input flex-1 text-lg py-4 px-6 pr-12" 
    : "input flex-1 pl-10 pr-10"
  
  const buttonClasses = size === "large"
    ? "btn btn-primary px-8 py-4 text-lg rounded-l-none"
    : "btn btn-primary rounded-l-none px-6"

  return (
    <div className={`relative ${className}`} ref={searchRef}>
      <form onSubmit={handleSubmit} className="flex relative">
        <div className="relative flex-1">
          <Search className={`absolute ${size === "large" ? "left-6 top-1/2" : "left-3 top-1/2"} transform -translate-y-1/2 h-4 w-4 text-gray-400`} />
          <input
            type="text"
            placeholder={placeholder}
            value={localQuery}
            onChange={handleInputChange}
            onFocus={() => setIsOpen(true)}
            className={inputClasses}
          />
          {localQuery && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <button
          type="submit"
          className={buttonClasses}
        >
          {isSearching ? (
            <div className="loading-spinner" />
          ) : (
            "Search"
          )}
        </button>
      </form>

      {/* Search Results Dropdown */}
      {showResults && isOpen && (
        <div 
          ref={resultsRef}
          className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-96 overflow-y-auto"
        >
          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="p-4">
              <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                <Search className="h-4 w-4 mr-2" />
                Search Results
              </h4>
              <div className="space-y-2">
                {searchResults.map((result) => (
                  <Link
                    key={result.id}
                    to={`/post/${result.slug}`}
                    onClick={() => setIsOpen(false)}
                    className="block p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <h5 className="font-medium text-gray-900 mb-1">{result.title}</h5>
                    <p className="text-sm text-gray-600 line-clamp-2">{result.excerpt}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Search History */}
          {searchHistory.length > 0 && !isSearching && (
            <div className="p-4 border-t border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium text-gray-900 flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  Recent Searches
                </h4>
                <button
                  onClick={clearHistory}
                  className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
                >
                  Clear All
                </button>
              </div>
              <div className="space-y-1">
                {searchHistory.slice(0, 5).map((query, index) => (
                  <button
                    key={index}
                    onClick={() => handleHistoryClick(query)}
                    className="block w-full text-left px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    {query}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Popular Searches */}
          {!localQuery && popularSearches.length > 0 && (
            <div className="p-4 border-t border-gray-100">
              <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                <TrendingUp className="h-4 w-4 mr-2" />
                Popular Searches
              </h4>
              <div className="flex flex-wrap gap-2">
                {popularSearches.slice(0, 8).map((term) => (
                  <button
                    key={term}
                    onClick={() => handleHistoryClick(term)}
                    className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-primary-100 hover:text-primary-700 transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* No Results */}
          {isSearching && (
            <div className="p-4 text-center">
              <div className="loading-spinner-lg mx-auto mb-3" />
              <p className="text-sm text-gray-600">Searching...</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default SearchBar