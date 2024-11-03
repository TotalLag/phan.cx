export interface SearchableDocument {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  url: string;
}

export interface TokenPosition {
  start: number;
  end: number;
  token: string;
}

export interface SearchResult {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  url: string;
  score: number;
  terms: string[];
  matches: {
    [field: string]: {
      text: string;
      positions: TokenPosition[];
    };
  };
}

export interface SearchChunk {
  id: string;
  documents: SearchableDocument[];
  timestamp: number;
}

export interface SearchManifest {
  version: string;
  totalDocuments: number;
  chunks: {
    id: string;
    size: number;
  }[];
  initial: string[];
}

export interface CachedChunk {
  data: SearchableDocument[];
  timestamp: number;
  version: string;
}
