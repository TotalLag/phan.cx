import { createContext, useContext, createSignal, createEffect, type Component, type JSX } from 'solid-js'
import { search, initializeSearch, blogToSearchableDocuments } from '../utils/search'
import type { SearchResult, SearchableDocument } from '../types/search'
import { getCollection } from 'astro:content'

// Try to import page index, but don't fail if it doesn't exist
let pageIndex: SearchableDocument[] = []
try {
  pageIndex = (await import('../data/page-index.json')).default
} catch (e) {
  console.log('No page index found, falling back to blog collection')
}

export type SearchContextType = {
  query: () => string
  setQuery: (query: string) => void
  results: () => SearchResult[]
  isLoading: () => boolean
  isNavigating: () => boolean
  setIsNavigating: (value: boolean) => void
}

const SearchContext = createContext<SearchContextType>()

export const SearchProvider: Component<{ children: JSX.Element }> = (props) => {
  const [query, setQuery] = createSignal('')
  const [results, setResults] = createSignal<SearchResult[]>([])
  const [isLoading, setIsLoading] = createSignal(false)
  const [isNavigating, setIsNavigating] = createSignal(false)
  const [isInitialized, setIsInitialized] = createSignal(false)

  // Initialize search
  createEffect(async () => {
    if (!isInitialized()) {
      console.log('Initializing search...')
      try {
        let searchDocs: SearchableDocument[] = []

        if (pageIndex.length > 0) {
          // Use page index if it exists (already includes blog posts)
          console.log('Using page index with', pageIndex.length, 'pages')
          searchDocs = pageIndex
        } else {
          // Fall back to blog collection
          const posts = await getCollection('blog')
          console.log('Using blog collection with', posts.length, 'posts')
          searchDocs = blogToSearchableDocuments(posts)
        }
        
        // Initialize search
        initializeSearch(searchDocs)
        setIsInitialized(true)
        console.log('Search initialized successfully')
      } catch (error) {
        console.error('Failed to initialize search:', error)
      }
    }
  })

  // Handle search
  createEffect(() => {
    const searchQuery = query().trim()
    console.log('Search query:', searchQuery, 'Initialized:', isInitialized())
    
    if (searchQuery.length >= 3 && isInitialized()) {
      setIsLoading(true)
      try {
        const searchResults = search(searchQuery)
        console.log('Search results:', searchResults.length)
        setResults(searchResults)
      } catch (error) {
        console.error('Search error:', error)
        setResults([])
      } finally {
        setIsLoading(false)
      }
    } else {
      setResults([])
    }
  })

  const store: SearchContextType = {
    query,
    setQuery,
    results,
    isLoading,
    isNavigating,
    setIsNavigating
  }

  return (
    <SearchContext.Provider value={store}>
      {props.children}
    </SearchContext.Provider>
  )
}

export function useSearch() {
  const context = useContext(SearchContext)
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider')
  }
  return context
}
