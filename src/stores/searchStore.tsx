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
import type { SearchResult } from '../types/search';
import { makePersisted } from '@solid-primitives/storage';
import { isServer } from 'solid-js/web';
import localforage from 'localforage';

export type SearchContextType = {
  query: () => string;
  setQuery: (query: string) => void;
  results: () => SearchResult[];
  isLoading: () => boolean;
  isNavigating: () => boolean;
  setIsNavigating: (value: boolean) => void;
  isInitialized: () => boolean;
};

const SearchContext = createContext<SearchContextType>();

export const SearchProvider: Component<{ children: JSX.Element }> = (props) => {
  // Persist the search query with localforage
  const [query, setQuery] = makePersisted(createSignal(''), {
    name: 'search-query',
    storage: !isServer ? localforage : undefined,
  });

  const [results, setResults] = createSignal<SearchResult[]>([]);
  const [isLoading, setIsLoading] = createSignal(false);
  const [isNavigating, setIsNavigating] = createSignal(false);
  const [isInitialized, setIsInitialized] = createSignal(false);

  // Initialize search
  createEffect(async () => {
    if (!isInitialized() && !isServer) {
      console.log('Initializing search...');
      try {
        await initializeSearch();
        setIsInitialized(true);
        console.log('Search initialized successfully');
      } catch (error) {
        console.error('Failed to initialize search:', error);
        // Don't set initialized on error to allow retrying
      }
    }
  });

  // Handle search
  createEffect(() => {
    const searchQuery = query().trim();
    console.log('Search query:', searchQuery, 'Initialized:', isInitialized());

    if (searchQuery.length >= 3 && isInitialized()) {
      setIsLoading(true);
      try {
        const searchResults = search(searchQuery);
        console.log('Search results:', searchResults.length);
        setResults(searchResults);
      } catch (error) {
        console.error('Search error:', error);
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
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
}
