import React, { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

const SearchContext = createContext()

export const useSearch = () => {
  const context = useContext(SearchContext)
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider')
  }
  return context
}

export const SearchProvider = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [searchHistory, setSearchHistory] = useState(() => {
    const saved = localStorage.getItem('searchHistory')
    return saved ? JSON.parse(saved) : []
  })
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  // Initialize search term from URL params
  useEffect(() => {
    const query = searchParams.get('q')
    if (query) {
      setSearchTerm(query)
    }
  }, [searchParams])

  // Save search history to localStorage
  useEffect(() => {
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory))
  }, [searchHistory])

  const performSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults([])
      return
    }

    setIsSearching(true)
    
    try {
      // Update URL with search query
      setSearchParams({ q: query })
      
      // Add to search history
      const newHistory = [query, ...searchHistory.filter(item => item !== query)].slice(0, 10)
      setSearchHistory(newHistory)
      
      // TODO: Replace with actual API call when backend is connected
      // For now, simulate search results
      setTimeout(() => {
        const mockResults = [
          {
            id: '1',
            title: `Search result for "${query}"`,
            excerpt: 'This is a mock search result. In a real application, this would come from your backend API.',
            slug: 'mock-result-1',
            type: 'post'
          },
          {
            id: '2',
            title: `Another result for "${query}"`,
            excerpt: 'Another mock search result to demonstrate the search functionality.',
            slug: 'mock-result-2',
            type: 'post'
          }
        ]
        
        setSearchResults(mockResults)
        setIsSearching(false)
      }, 1000)
      
    } catch (error) {
      console.error('Search error:', error)
      setSearchResults([])
      setIsSearching(false)
    }
  }

  const handleSearch = (query) => {
    setSearchTerm(query)
    performSearch(query)
  }

  const clearSearch = () => {
    setSearchTerm('')
    setSearchResults([])
    setSearchParams({})
  }

  const clearHistory = () => {
    setSearchHistory([])
    localStorage.removeItem('searchHistory')
  }

  const navigateToSearch = (query) => {
    handleSearch(query)
    navigate(`/?q=${encodeURIComponent(query)}`)
  }

  const value = {
    searchTerm,
    setSearchTerm,
    searchResults,
    isSearching,
    searchHistory,
    handleSearch,
    performSearch,
    clearSearch,
    clearHistory,
    navigateToSearch
  }

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  )
}