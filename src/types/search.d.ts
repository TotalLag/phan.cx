// Core search document type
export interface SearchableDocument {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  url: string;
}

// Token position for highlighting matches
export interface TokenPosition {
  token: string;
  start: number;
  end: number;
}

// Text match with positions for highlighting
export interface TextMatch {
  text: string;
  positions: TokenPosition[];
}

// Search result with highlighting information
export interface SearchResult {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  url: string;
  score: number;
  terms: string[];
  matches: {
    title: TextMatch;
    excerpt: TextMatch;
    content: TextMatch;
  };
}

// Search chunk metadata
export interface SearchChunk {
  id: string;
  size: number;
}

// Search manifest for versioning and chunk management
export interface SearchManifest {
  version: string;
  totalDocuments: number;
  chunks: SearchChunk[];
}

// Search store context type
export interface SearchContextType {
  query: () => string;
  setQuery: (query: string) => void;
  results: () => SearchResult[];
  isLoading: () => boolean;
  isNavigating: () => boolean;
  setIsNavigating: (value: boolean) => void;
  isInitialized: () => boolean;
}
