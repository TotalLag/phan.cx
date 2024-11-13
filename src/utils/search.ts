import MiniSearch from 'minisearch';
import type { CollectionEntry } from 'astro:content';
import type {
  SearchableDocument,
  SearchResult,
  TokenPosition,
  SearchManifest,
} from '../types/search.d.ts';
import { isServer } from 'solid-js/web';
import localforage from 'localforage';
import { createLogger } from './logger';

const searchLogger = createLogger('SearchUtility');

// Function to decode HTML entities that works in both browser and Node.js
function decodeHtml(text: string): string {
  const entities: { [key: string]: string } = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
    '&apos;': "'",
  };
  return text.replace(/&[#\w]+;/g, entity => entities[entity] || entity);
}

export function cleanText(text: string): string {
  // First decode any HTML entities
  const decodedText = decodeHtml(text);
  
  return (
    decodedText
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
  );
}

// Single localforage instance with a clear namespace
const storage = localforage.createInstance({
  name: 'search-storage',
  storeName: 'search-chunks',
  description: 'Search chunks storage'
});

let searchIndex: MiniSearch<SearchableDocument>;
let searchManifest: SearchManifest | null = null;

function processChunkForStorage(docs: SearchableDocument[]): SearchableDocument[] {
  return docs.map(doc => ({
    id: doc.id || doc.url,
    title: cleanText(doc.title),
    excerpt: cleanText(doc.excerpt || doc.content.slice(0, 150) + '...'),
    content: cleanText(doc.content)
      .split(/\s+/)
      .filter((word, idx, arr) => 
        arr.indexOf(word) === idx && word.length > 2
      )
      .join(' '),
    url: doc.url
  }));
}

async function removeOldestChunk() {
  try {
    const keys = await storage.keys();
    const chunkKeys = keys.filter(key => key.startsWith('chunk-'));
    if (chunkKeys.length > 0) {
      await storage.removeItem(chunkKeys[0]);
      searchLogger.debug(`Removed oldest chunk: ${chunkKeys[0]}`);
    }
  } catch (error) {
    searchLogger.warn('Failed to remove oldest chunk:', error);
  }
}

async function storeChunk(chunkId: string, docs: SearchableDocument[]) {
  try {
    await storage.setItem(`chunk-${chunkId}`, docs);
  } catch (storageError) {
    try {
      await removeOldestChunk();
      await storage.setItem(`chunk-${chunkId}`, docs);
    } catch (retryError) {
      searchLogger.warn('Storage failed, falling back to memory-only', retryError);
    }
  }
}

// Keep track of added document IDs to prevent duplicates
const addedDocuments = new Set<string>();

function addDocumentsToIndex(docs: SearchableDocument[]) {
  const newDocs = docs.filter((doc) => {
    if (!doc.id || addedDocuments.has(doc.id)) {
      return false;
    }
    addedDocuments.add(doc.id);
    return true;
  });

  if (newDocs.length > 0) {
    searchIndex.addAll(newDocs);
    searchLogger.debug(`Added ${newDocs.length} new documents to search index`);
  }
}

async function loadChunksInBackground() {
  if (!searchManifest || isServer) return;

  for (const chunk of searchManifest.chunks) {
    try {
      // Skip chunk-0 if it was already loaded as initial
      if (chunk.id === 'chunk-0' && addedDocuments.size > 0) {
        continue;
      }

      // Check if we already have this chunk in storage
      const storedChunk = await storage.getItem(chunk.id);
      if (storedChunk) {
        searchLogger.debug(`Using stored chunk ${chunk.id}`);
        addDocumentsToIndex(storedChunk as SearchableDocument[]);
        continue;
      }

      searchLogger.debug(`Loading chunk ${chunk.id} from network...`);
      const chunkResponse = await fetch(`/search/${chunk.id}.json.gz`);
      const chunkData = await chunkResponse.json();
      
      // Process chunk before storage
      const processedChunk = processChunkForStorage(chunkData);
      
      // Try to store, fallback to memory if storage fails
      try {
        await storeChunk(chunk.id.replace('chunk-', ''), processedChunk);
      } catch (error) {
        searchLogger.warn(`Storage failed for ${chunk.id}, keeping in memory`);
      }
      
      addDocumentsToIndex(processedChunk);
    } catch (error) {
      searchLogger.error(`Failed to load chunk ${chunk.id}:`, error);
    }
  }
}

export async function initializeSearch() {
  if (isServer) return false;

  try {
    searchLogger.debug('Loading search manifest...');
    const manifestResponse = await fetch('/search/manifest.json');
    const manifest = await manifestResponse.json();
    searchManifest = manifest;

    // Enhanced version checking with detailed logging
    const cachedVersion = await storage.getItem<string>('version');
    searchLogger.debug('Manifest Version:', manifest.version);
    searchLogger.debug('Cached Version:', cachedVersion);

    if (manifest.version !== cachedVersion) {
      searchLogger.debug('🔄 Search index version changed, clearing cache...');
      
      // Log all existing keys before clearing
      const existingKeys = await storage.keys();
      searchLogger.debug('Existing Storage Keys:', existingKeys);

      await storage.clear();
      await storage.setItem('version', manifest.version);
      
      searchLogger.debug('✅ Cache cleared and new version set');
    } else {
      searchLogger.debug('✓ Version unchanged, using existing cache');
    }

    // Clear the set of added documents when initializing
    addedDocuments.clear();

    searchIndex = new MiniSearch({
      fields: ['title', 'excerpt', 'content'],
      storeFields: ['title', 'excerpt', 'content', 'url'],
      tokenize: (text) => text.split(/\s+/),
      processTerm: (term) => term.toLowerCase(),
      searchOptions: {
        boost: { title: 2, excerpt: 1.5, content: 1 },
        fuzzy: 0.2,
        prefix: true
      }
    });

    // Load chunk-0 as initial data
    searchLogger.debug('Loading initial chunk...');
    const initialResponse = await fetch('/search/chunk-0.json.gz');
    const initialDocs = await initialResponse.json();
    const processedDocs = processChunkForStorage(initialDocs);
    addDocumentsToIndex(processedDocs);

    // Try to store initial chunk
    try {
      await storeChunk('0', processedDocs);
    } catch (error) {
      searchLogger.warn('Failed to store initial chunk:', error);
    }

    // Start background loading
    requestIdleCallback(() => {
      loadChunksInBackground().catch(error => {
        searchLogger.error('Background chunk loading failed:', error);
      });
    });

    return true;
  } catch (error) {
    searchLogger.error('Failed to initialize search:', error);
    throw error;
  }
}

function tokenizeWithPositions(text: string): TokenPosition[] {
  const tokens: TokenPosition[] = [];
  const regex = /\S+/g;
  let match;

  while ((match = regex.exec(text)) !== null) {
    tokens.push({
      token: match[0].toLowerCase(),
      start: match.index,
      end: match.index + match[0].length,
    });
  }

  return tokens;
}

function findMatchPositions(text: string, terms: string[]): TokenPosition[] {
  const tokens = tokenizeWithPositions(text);
  const positions: TokenPosition[] = [];

  tokens.forEach((token) => {
    if (terms.some((term) => token.token.includes(term.toLowerCase()))) {
      positions.push(token);
    }
  });

  return positions.sort((a, b) => a.start - b.start).slice(0, 2);
}

export function search(query: string): SearchResult[] {
  if (!searchIndex || query.length < 3) return [];

  const results = searchIndex.search(query, {
    boost: { title: 2, excerpt: 1.5, content: 1 },
    fuzzy: 0.2,
    prefix: true,
  });

  return results.map((result) => {
    return {
      id: result.id,
      title: result.title,
      excerpt: result.excerpt,
      content: result.content,
      url: result.url,
      score: result.score,
      terms: result.terms,
      matches: {
        title: {
          text: result.title,
          positions: findMatchPositions(result.title, result.terms),
        },
        excerpt: {
          text: result.excerpt,
          positions: findMatchPositions(result.excerpt, result.terms),
        },
        content: {
          text: result.content,
          positions: findMatchPositions(result.content, result.terms),
        }
      },
    };
  });
}

export function getSnippet(
  text: string,
  position: TokenPosition,
  context: number = 30
): string {
  const snippetStart = Math.max(0, position.start - context);
  const snippetEnd = Math.min(text.length, position.end + context);

  const prefix = snippetStart > 0 ? '...' : '';
  const suffix = snippetEnd < text.length ? '...' : '';

  const beforeMatch = text.slice(snippetStart, position.start);
  const matchedText = text.slice(position.start, position.end);
  const afterMatch = text.slice(position.end, snippetEnd);

  return (
    prefix +
    beforeMatch +
    `<mark class="bg-accent/25 light:text-secondary rounded-sm px-0.5">${matchedText}</mark>` +
    afterMatch +
    suffix
  );
}

export function blogToSearchableDocuments(
  posts: CollectionEntry<'blog'>[]
): SearchableDocument[] {
  return posts.map((post) => ({
    id: post.id,
    title: cleanText(post.data.title),
    excerpt: cleanText(post.data.excerpt || post.body.slice(0, 150) + '...'),
    content: cleanText(post.body),
    url: `/blog/${post.slug}`,
  }));
}
