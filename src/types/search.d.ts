export interface SearchableDocument {
  id: string
  title: string
  excerpt: string
  content: string
  url: string
}

export interface TokenPosition {
  start: number
  end: number
  token: string
}

export interface SearchResult {
  id: string
  title: string
  excerpt: string
  content: string
  url: string
  score: number
  terms: string[]
  matches: {
    [field: string]: {
      text: string
      positions: TokenPosition[]
    }
  }
}
