import MiniSearch from 'minisearch';
import type { CollectionEntry } from 'astro:content';
import type {
  SearchableDocument,
  SearchResult,
  TokenPosition,
  SearchManifest,
} from '../types/search';
import { makePersisted } from '@solid-primitives/storage';
import { createSignal } from 'solid-js';
import { isServer } from 'solid-js/web';
import localforage from 'localforage';

let searchIndex: MiniSearch<SearchableDocument>;
let searchManifest: SearchManifest | null = null;

// Create persisted storage for chunks and version
const [chunks, setChunks] = makePersisted(
  createSignal<Record<string, SearchableDocument[]>>({}),
  {
    name: 'search-chunks',
    storage: !isServer ? localforage : undefined,
  }
);

const [cachedVersion, setCachedVersion] = makePersisted(
  createSignal<string>(''),
  {
    name: 'search-version',
    storage: !isServer ? localforage : undefined,
  }
);

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

async function fetchWithRetry(url: string, retries = 3): Promise<Response> {
  let lastError: Error | null = null;

  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response;
    } catch (error) {
      lastError = error as Error;
      console.warn(`Attempt ${i + 1} failed for ${url}:`, error);
      // Wait before retrying, with exponential backoff
      if (i < retries - 1) {
        await new Promise((resolve) =>
          setTimeout(resolve, Math.pow(2, i) * 1000)
        );
      }
    }
  }

  throw lastError;
}

// Keep track of added document IDs to prevent duplicates
const addedDocuments = new Set<string>();

function addDocumentsToIndex(docs: SearchableDocument[]) {
  const newDocs = docs.filter((doc) => {
    // Skip documents with no ID or already added
    if (!doc.id || addedDocuments.has(doc.id)) {
      console.warn(
        `Skipping document with ${!doc.id ? 'missing' : 'duplicate'} ID:`,
        doc.id
      );
      return false;
    }
    addedDocuments.add(doc.id);
    return true;
  });

  if (newDocs.length > 0) {
    searchIndex.addAll(newDocs);
    console.log(`Added ${newDocs.length} new documents to search index`);
  }
}

export async function initializeSearch() {
  if (isServer) return;

  try {
    console.log('Loading search manifest...');
    const manifestResponse = await fetchWithRetry('/search/manifest.json');
    const manifest = await manifestResponse.json();
    searchManifest = manifest;
    console.log('Search manifest loaded:', manifest);

    // Check if version has changed
    if (manifest.version !== cachedVersion()) {
      console.log('Search index version changed, clearing cache...');
      await localforage.clear();
      setChunks({});
      setCachedVersion(manifest.version);
    }

    // Clear the set of added documents when initializing
    addedDocuments.clear();

    searchIndex = new MiniSearch({
      fields: ['title', 'excerpt', 'content'],
      storeFields: ['title', 'excerpt', 'content', 'url'],
      tokenize: (text) => text.split(/\s+/).map((t) => t.toLowerCase()),
      processTerm: (term) => term.toLowerCase(),
      searchOptions: {
        boost: { title: 2, excerpt: 1.5, content: 1 },
        fuzzy: 0.2,
        prefix: true,
      },
    });

    console.log('Loading initial chunk...');
    const initialResponse = await fetchWithRetry('/search/initial.json.gz');
    const initialDocs = await initialResponse.json();
    console.log('Initial chunk loaded, documents:', initialDocs.length);

    const cleanedDocs = initialDocs.map(cleanDocument);
    addDocumentsToIndex(cleanedDocs);

    // Start loading other chunks in the background
    loadChunksInBackground();

    return true;
  } catch (error) {
    console.error('Failed to initialize search:', error);
    throw error;
  }
}

function cleanDocument(doc: SearchableDocument): SearchableDocument {
  return {
    ...doc,
    id: doc.id || doc.url, // Use URL as fallback ID if ID is missing
    title: cleanText(doc.title),
    excerpt: cleanText(doc.excerpt),
    content: cleanText(doc.content),
  };
}

async function loadChunksInBackground() {
  if (!searchManifest || isServer) return;

  const cachedChunks = chunks();

  for (const chunk of searchManifest.chunks) {
    try {
      console.log(`Processing chunk ${chunk.id}...`);

      if (
        cachedChunks[chunk.id] &&
        isChunkValid(chunk.id, cachedChunks[chunk.id])
      ) {
        console.log(`Using cached chunk ${chunk.id}`);
        const cleanedDocs = cachedChunks[chunk.id].map(cleanDocument);
        addDocumentsToIndex(cleanedDocs);
      } else {
        console.log(`Loading chunk ${chunk.id} from network...`);
        const chunkResponse = await fetchWithRetry(
          `/search/${chunk.id}.json.gz`
        );
        const chunkData = await chunkResponse.json();
        console.log(`Chunk ${chunk.id} loaded, documents:`, chunkData.length);

        const cleanedDocs = chunkData.map(cleanDocument);
        addDocumentsToIndex(cleanedDocs);

        setChunks({
          ...cachedChunks,
          [chunk.id]: chunkData,
        });
      }
    } catch (error) {
      console.error(`Failed to load chunk ${chunk.id}:`, error);
      // Continue with other chunks even if one fails
    }
  }
}

function isChunkValid(chunkId: string, chunk: SearchableDocument[]): boolean {
  if (!searchManifest) return false;

  const manifestChunk = searchManifest.chunks.find((c) => c.id === chunkId);
  if (!manifestChunk) {
    console.warn(`Chunk ${chunkId} not found in manifest`);
    return false;
  }

  if (chunk.length !== manifestChunk.size) {
    console.warn(
      `Chunk ${chunkId} size mismatch: ${chunk.length} vs ${manifestChunk.size}`
    );
    return false;
  }

  return true;
}

export function blogToSearchableDocuments(
  posts: CollectionEntry<'blog'>[]
): SearchableDocument[] {
  return posts.map((post) => ({
    id: post.id,
    title: cleanText(post.data.title),
    excerpt: cleanText(post.data.excerpt || ''),
    content: cleanText(post.body),
    url: `/blog/${post.slug}`,
  }));
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
        },
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
