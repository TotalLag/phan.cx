import MiniSearch from 'minisearch';
import type { CollectionEntry } from 'astro:content';
import type {
  SearchableDocument,
  SearchResult,
  TokenPosition,
  SearchManifest,
} from '../types/search';
import { isServer } from 'solid-js/web';
import localforage from 'localforage';
import { createLogger } from './logger';

// Create a module-specific logger
const searchLogger = createLogger('SearchUtility');

let searchIndex: MiniSearch<SearchableDocument>;
let searchManifest: SearchManifest | null = null;

// Single localforage instance with a clear namespace
const storage = localforage.createInstance({
  name: 'search-storage',
  storeName: 'search-chunks',
  description: 'Search chunks storage'
});

// Function to safely handle unknown errors
function handleError(error: unknown, context: string): void {
  if (error instanceof Error) {
    searchLogger.error(`${context}:`, {
      message: error.message,
      name: error.name,
      stack: error.stack
    });
  } else {
    searchLogger.error(`${context}: Unknown error`, error);
  }
}

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

// Enhanced decompression function
async function decompressResponse(response: Response): Promise<any> {
  try {
    searchLogger.debug('Attempting to decompress response');
    
    // Try native streaming decompression
    if ('DecompressionStream' in window) {
      const decompressedStream = response.body?.pipeThrough(
        new DecompressionStream('gzip')
      );
      const decompressedText = await new Response(decompressedStream).text();
      searchLogger.debug('Native decompression successful');
      return JSON.parse(decompressedText);
    }
    
    // Fallback: manual decompression
    const arrayBuffer = await response.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    
    searchLogger.debug('Attempting manual decompression');
    
    // Temporary fallback if no decompression library
    const rawText = new TextDecoder().decode(uint8Array);
    return JSON.parse(rawText);
  } catch (error) {
    handleError(error, 'Decompression failed');
    throw error;
  }
}

// Modify fetchWithRetry to use the new decompression method
async function fetchWithRetry(url: string, decompress = false, retries = 3): Promise<any> {
  let lastError: unknown = null;

  for (let i = 0; i < retries; i++) {
    try {
      searchLogger.debug(`Fetching URL: ${url}, Attempt: ${i + 1}`);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (decompress) {
        return await decompressResponse(response);
      }

      return await response.json();
    } catch (error) {
      lastError = error;
      searchLogger.warn(`Attempt ${i + 1} failed for ${url}:`, error);
      
      if (i < retries - 1) {
        await new Promise((resolve) =>
          setTimeout(resolve, Math.pow(2, i) * 1000)
        );
      }
    }
  }

  searchLogger.error('All fetch attempts failed');
  handleError(lastError, 'Fetch with retry failed');
  throw lastError;
}

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

async function storeChunk(chunkId: string, docs: SearchableDocument[]) {
  try {
    await storage.setItem(`chunk-${chunkId}`, docs);
  } catch (storageError) {
    try {
      await removeOldestChunk();
      await storage.setItem(`chunk-${chunkId}`, docs);
    } catch (retryError) {
      handleError(retryError, 'Storage failed, falling back to memory-only');
    }
  }
}

async function removeOldestChunk() {
  const keys = await storage.keys();
  const chunkKeys = keys.filter(key => key.startsWith('chunk-'));
  if (chunkKeys.length > 0) {
    await storage.removeItem(chunkKeys[0]);
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
      const chunkData = await fetchWithRetry(`/search/${chunk.id}.json.gz`, true);
      
      // Process chunk before storage
      const processedChunk = processChunkForStorage(chunkData);
      
      // Try to store, fallback to memory if storage fails
      try {
        await storeChunk(chunk.id.replace('chunk-', ''), processedChunk);
      } catch (error) {
        handleError(error, `Storage failed for ${chunk.id}, keeping in memory`);
      }
      
      addDocumentsToIndex(processedChunk);
    } catch (error) {
      handleError(error, `Failed to load chunk ${chunk.id}`);
    }
  }
}

export async function initializeSearch() {
  if (isServer) return;

  try {
    searchLogger.debug('Initializing search...');
    
    // Fetch manifest with decompression
    const manifest = await fetchWithRetry('/search/manifest.json');
    searchManifest = manifest;

    searchLogger.debug('Manifest loaded:', JSON.stringify(manifest, null, 2));

    // Version checking
    const cachedVersion = await storage.getItem<string>('version');
    searchLogger.debug('Manifest Version:', manifest.version);
    searchLogger.debug('Cached Version:', cachedVersion);

    if (manifest.version !== cachedVersion) {
      searchLogger.debug('🔄 Search index version changed, clearing cache...');
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

    // Load initial chunk with explicit decompression
    searchLogger.debug('Loading initial search chunk...');
    const initialDocs = await fetchWithRetry('/search/chunk-0.json.gz', true);
    
    searchLogger.debug('Initial chunk loaded. Documents:', initialDocs.length);
    
    const processedDocs = processChunkForStorage(initialDocs);
    addDocumentsToIndex(processedDocs);

    // Try to store initial chunk
    try {
      await storeChunk('0', processedDocs);
    } catch (error) {
      handleError(error, 'Failed to store initial chunk');
    }

    // Background chunk loading
    requestIdleCallback(() => {
      loadChunksInBackground().catch(error => {
        handleError(error, 'Background chunk loading failed');
      });
    });

    return true;
  } catch (error) {
    handleError(error, 'Comprehensive Search Initialization Error');
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
