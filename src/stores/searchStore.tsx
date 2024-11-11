import {
  createContext,
  useContext,
  createSignal,
  createEffect,
  type Component,
  type JSX,
  Show,
} from 'solid-js';
import { search, initializeSearch } from '../utils/search';
import { createLogger } from '../utils/logger';
import type { SearchResult, SearchContextType } from '../types/search';
import { isServer } from 'solid-js/web';

// Create a module-specific logger
const searchStoreLogger = createLogger('SearchStore');

const SearchContext = createContext<SearchContextType>();

export const SearchProvider: Component<{ children: JSX.Element }> = (props) => {
  // Use regular signals for all state
  const [query, setQuery] = createSignal('');
  const [results, setResults] = createSignal<SearchResult[]>([]);
  const [isLoading, setIsLoading] = createSignal(false);
  const [isNavigating, setIsNavigating] = createSignal(false);
  const [isInitialized, setIsInitialized] = createSignal(false);

  // Initialize search
  createEffect(async () => {
    if (!isInitialized() && !isServer) {
      searchStoreLogger.debug('Initializing search...');
      try {
        await initializeSearch();
        setIsInitialized(true);
        searchStoreLogger.info('Search initialized successfully');
      } catch (error) {
        searchStoreLogger.error('Failed to initialize search:', error);
        // Don't set initialized on error to allow retrying
      }
    }
  });

  // Handle search
  createEffect(() => {
    const searchQuery = query().trim();

    if (searchQuery.length >= 3 && isInitialized()) {
      setIsLoading(true);
      try {
        searchStoreLogger.debug(`Performing search for query: ${searchQuery}`);
        const searchResults = search(searchQuery);
        
        searchStoreLogger.info(`Search completed. Results: ${searchResults.length}`);
        setResults(searchResults);
      } catch (error) {
        searchStoreLogger.error('Search error:', error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    } else {
      setResults([]);
    }
  });

  const store: SearchContextType = {
    query,
    setQuery,
    results,
    isLoading,
    isNavigating,
    setIsNavigating,
    isInitialized,
  };

  return (
    <SearchContext.Provider value={store}>
      <Show when={!isServer}>{props.children}</Show>
    </SearchContext.Provider>
  );
};

export function useSearch() {
  const context = useContext(SearchContext);
  if (!context) {
    searchStoreLogger.error('useSearch must be used within a SearchProvider');
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
}
