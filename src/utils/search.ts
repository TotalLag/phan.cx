import MiniSearch from 'minisearch'
import type { CollectionEntry } from 'astro:content'
import type { SearchableDocument, SearchResult, TokenPosition, SearchManifest } from '../types/search'
import { makePersisted } from '@solid-primitives/storage'
import { createSignal } from 'solid-js'
import { isServer } from 'solid-js/web'
import localforage from 'localforage'

let searchIndex: MiniSearch<SearchableDocument>
let searchManifest: SearchManifest | null = null

// Create persisted storage for chunks with localforage
const [chunks, setChunks] = makePersisted(createSignal<Record<string, SearchableDocument[]>>({}), {
  name: 'search-chunks',
  storage: !isServer ? localforage : undefined
})

export function cleanText(text: string): string {
  return text
    // Remove HTML tags
    .replace(/<[^>]*>/g, ' ')
    // Remove import statements
    .replace(/^import\s+.*?from\s+['"].*?['"];?\s*$/gm, '')
    // Remove frontmatter
    .replace(/^---[\s\S]*?---/, '')
    // Remove image markdown
    .replace(/!\[.*?\]\(.*?\)/g, '')
    // Remove markdown syntax
    .replace(/[#*`_~\[\]]/g, '')
    // Remove empty lines
    .replace(/\n\s*\n/g, '\n')
    // Normalize whitespace
    .replace(/\s+/g, ' ')
    .trim()
}

function tokenizeWithPositions(text: string): TokenPosition[] {
  const tokens: TokenPosition[] = []
  const regex = /\S+/g
  let match

  while ((match = regex.exec(text)) !== null) {
    tokens.push({
      token: match[0].toLowerCase(),
      start: match.index,
      end: match.index + match[0].length
    })
  }

  return tokens
}

export async function initializeSearch() {
  if (isServer) return

  searchIndex = new MiniSearch({
    fields: ['title', 'excerpt', 'content'],
    storeFields: ['title', 'excerpt', 'content', 'url'],
    tokenize: (text) => text.split(/\s+/).map(t => t.toLowerCase()),
    processTerm: (term) => term.toLowerCase(),
    searchOptions: {
      boost: { title: 2, excerpt: 1.5, content: 1 },
      fuzzy: 0.2,
      prefix: true
    }
  })

  try {
    // Load manifest
    const manifestResponse = await fetch('/search/manifest.json')
    searchManifest = await manifestResponse.json()

    // Load initial chunk
    const initialResponse = await fetch('/search/initial.json.gz')
    const initialDocs = await initialResponse.json()

    // Add initial documents to search index
    const cleanedDocs = initialDocs.map(cleanDocument)
    searchIndex.addAll(cleanedDocs)

    // Start loading other chunks in the background
    loadChunksInBackground()
  } catch (error) {
    console.error('Failed to initialize search:', error)
  }
}

function cleanDocument(doc: SearchableDocument): SearchableDocument {
  return {
    ...doc,
    title: cleanText(doc.title),
    excerpt: cleanText(doc.excerpt),
    content: cleanText(doc.content)
  }
}

async function loadChunksInBackground() {
  if (!searchManifest || isServer) return

  const cachedChunks = chunks()
  
  for (const chunk of searchManifest.chunks) {
    try {
      if (cachedChunks[chunk.id] && isChunkValid(chunk.id, cachedChunks[chunk.id])) {
        // Use cached chunk
        const cleanedDocs = cachedChunks[chunk.id].map(cleanDocument)
        searchIndex.addAll(cleanedDocs)
      } else {
        // Load chunk from network
        const chunkResponse = await fetch(`/search/${chunk.id}.json.gz`)
        const chunkData = await chunkResponse.json()
        const cleanedDocs = chunkData.map(cleanDocument)
        searchIndex.addAll(cleanedDocs)

        // Cache the chunk
        setChunks({
          ...cachedChunks,
          [chunk.id]: chunkData
        })
      }
    } catch (error) {
      console.error(`Failed to load chunk ${chunk.id}:`, error)
    }
  }
}

function isChunkValid(chunkId: string, chunk: SearchableDocument[]): boolean {
  if (!searchManifest) return false
  
  // Verify chunk exists in manifest
  const manifestChunk = searchManifest.chunks.find(c => c.id === chunkId)
  if (!manifestChunk) return false

  // Verify chunk size matches manifest
  if (chunk.length !== manifestChunk.size) return false

  return true
}

export function blogToSearchableDocuments(posts: CollectionEntry<'blog'>[]): SearchableDocument[] {
  return posts.map((post) => ({
    id: post.id,
    title: cleanText(post.data.title),
    excerpt: cleanText(post.data.excerpt || ''),
    content: cleanText(post.body),
    url: `/blog/${post.slug}`
  }))
}

function findMatchPositions(text: string, terms: string[]): TokenPosition[] {
  const tokens = tokenizeWithPositions(text)
  const positions: TokenPosition[] = []

  tokens.forEach(token => {
    if (terms.some(term => token.token.includes(term.toLowerCase()))) {
      positions.push(token)
    }
  })

  // Sort by position and limit to top 2 matches
  return positions.sort((a, b) => a.start - b.start).slice(0, 2)
}

export function search(query: string): SearchResult[] {
  if (!searchIndex || query.length < 3) return []

  const results = searchIndex.search(query, {
    boost: { title: 2, excerpt: 1.5, content: 1 },
    fuzzy: 0.2,
    prefix: true
  })

  return results.map(result => {
    const cleanedTitle = cleanText(result.title)
    const cleanedExcerpt = cleanText(result.excerpt)
    const cleanedContent = cleanText(result.content)

    return {
      id: result.id,
      title: cleanedTitle,
      excerpt: cleanedExcerpt,
      content: cleanedContent,
      url: result.url,
      score: result.score,
      terms: result.terms,
      matches: {
        title: {
          text: cleanedTitle,
          positions: findMatchPositions(cleanedTitle, result.terms)
        },
        excerpt: {
          text: cleanedExcerpt,
          positions: findMatchPositions(cleanedExcerpt, result.terms)
        },
        content: {
          text: cleanedContent,
          positions: findMatchPositions(cleanedContent, result.terms)
        }
      }
    }
  })
}

export function getSnippet(text: string, position: TokenPosition, context: number = 30): string {
  const snippetStart = Math.max(0, position.start - context)
  const snippetEnd = Math.min(text.length, position.end + context)
  
  const prefix = snippetStart > 0 ? '...' : ''
  const suffix = snippetEnd < text.length ? '...' : ''
  
  const beforeMatch = text.slice(snippetStart, position.start)
  const matchedText = text.slice(position.start, position.end)
  const afterMatch = text.slice(position.end, snippetEnd)
  
  return prefix + beforeMatch + 
    `<mark class="bg-accent/25 light:text-secondary rounded-sm px-0.5">${matchedText}</mark>` + 
    afterMatch + suffix
}
