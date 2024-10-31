export interface SearchableDocument {
  id: string
  title: string
  excerpt: string
  content: string
  url: string
}

export interface SearchResult {
  id: string
  title: string
  excerpt: string
  content: string
  url: string
  score: number
  terms: string[]
  match: {
    [field: string]: [number, number][]
  }
}

export interface SearchSuggestion {
  suggestion: string
  terms: string[]
  score: number
}
