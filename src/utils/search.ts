import MiniSearch from 'minisearch'
import type { CollectionEntry } from 'astro:content'
import type { SearchableDocument, SearchResult } from '../types/search'

let searchIndex: MiniSearch<SearchableDocument>

export function initializeSearch(documents: SearchableDocument[]) {
  searchIndex = new MiniSearch({
    fields: ['title', 'excerpt', 'content'],
    storeFields: ['title', 'excerpt', 'content', 'url'],
    searchOptions: {
      boost: { title: 2, excerpt: 1.5, content: 1 },
      fuzzy: 0.2,
      prefix: true
    }
  })

  searchIndex.addAll(documents)
}

export function blogToSearchableDocuments(posts: CollectionEntry<'blog'>[]): SearchableDocument[] {
  return posts.map((post) => ({
    id: post.id,
    title: post.data.title,
    excerpt: post.data.excerpt || '',
    content: post.body, // Use original content without cleaning
    url: `/blog/${post.slug}`
  }))
}

export function search(query: string): SearchResult[] {
  if (!searchIndex || query.length < 3) return []

  const results = searchIndex.search(query, {
    boost: { title: 2, excerpt: 1.5, content: 1 },
    fuzzy: 0.2,
    prefix: true
  })

  return results.map(result => ({
    id: result.id,
    title: result.title,
    excerpt: result.excerpt,
    content: result.content,
    url: result.url,
    score: result.score,
    terms: result.terms,
    match: result.match
  }))
}

// Clean text only when displaying
export function cleanDisplayText(text: string): string {
  return text
    .replace(/[#*`_~\[\]]/g, '') // Remove markdown syntax
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim()
}

// Get snippet with proper context
export function getSnippet(text: string, term: string, matchStart: number): string {
  const cleanedText = cleanDisplayText(text)
  const snippetStart = Math.max(0, matchStart - 30)
  const snippetEnd = Math.min(cleanedText.length, matchStart + term.length + 30)
  
  const prefix = snippetStart > 0 ? '... ' : ''
  const suffix = snippetEnd < cleanedText.length ? ' ...' : ''
  
  const beforeMatch = cleanedText.slice(snippetStart, matchStart)
  const matchedText = cleanedText.slice(matchStart, matchStart + term.length)
  const afterMatch = cleanedText.slice(matchStart + term.length, snippetEnd)
  
  return prefix + beforeMatch + 
    `<mark class="bg-accent/20 text-text-primary rounded-sm px-0.5">${matchedText}</mark>` + 
    afterMatch + suffix
}
