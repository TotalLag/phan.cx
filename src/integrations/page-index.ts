import type { AstroIntegration } from 'astro';
import { cleanText } from '../utils/search';
import type { SearchableDocument, SearchManifest } from '../types/search';
import fs from 'fs/promises';
import path from 'path';
import zlib from 'zlib';
import { promisify } from 'util';
import { v4 as uuidv4 } from 'uuid';

const gzip = promisify(zlib.gzip);
const CHUNK_SIZE = 3; // Number of documents per chunk

export function pageIndexIntegration(): AstroIntegration {
  return {
    name: 'page-index',
    hooks: {
      'astro:build:done': async ({ dir }) => {
        try {
          // Generate new UUID for this build
          const buildVersion = uuidv4();
          console.log('Generating search index with version:', buildVersion);

          // Read the dist directory
          const distPath = dir.pathname;
          const pages = await fs.readdir(distPath, { recursive: true });

          // Keep track of processed URLs to avoid duplicates
          const processedUrls = new Set<string>();

          // Filter and process HTML files
          const pageDocs = (await Promise.all(
            pages
              .filter((filePath) => {
                // Only process HTML files
                if (
                  typeof filePath !== 'string' ||
                  !filePath.endsWith('.html')
                ) {
                  return false;
                }

                // Convert path to URL format for consistent checking
                const urlPath =
                  '/' + filePath.replace(/\.html$/, '').replace(/index$/, '');

                // Exclude specific paths
                const excludedPaths = [
                  '/404',
                  '/api/',
                  '/_',
                  '/blog/', // Only exclude the blog index page
                ];

                // Check for exact matches only
                return !excludedPaths.includes(urlPath);
              })
              .map(async (filePath) => {
                // Read the HTML file
                const fullPath = path.join(distPath, filePath as string);
                const html = await fs.readFile(fullPath, 'utf-8');

                // Get URL from file path
                const url =
                  '/' +
                  (filePath as string)
                    .replace(/\.html$/, '')
                    .replace(/index$/, '')
                    // Remove trailing slash except for root
                    .replace(/(.+)\/$/, '$1');

                // Skip if we've already processed this URL
                if (processedUrls.has(url)) {
                  return null;
                }
                processedUrls.add(url);

                // Extract title from HTML
                const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/);
                const title = titleMatch ? titleMatch[1] : 'Untitled Page';

                // Extract main content if available
                const mainMatch = html.match(/<main[^>]*>([\s\S]*?)<\/main>/);
                const content = mainMatch ? mainMatch[1] : html;

                // Clean content for searching
                const cleanedContent = cleanText(content);

                // Create excerpt
                const excerpt =
                  cleanedContent.split(' ').slice(0, 30).join(' ') + '...';

                return {
                  id: url || '/', // Use '/' for root path
                  title: cleanText(title),
                  excerpt: cleanText(excerpt),
                  content: cleanedContent,
                  url: url || '/', // Use '/' for root path
                };
              })
          )).filter((doc): doc is SearchableDocument => doc !== null);

          // Create search directory in public
          const searchDir = path.join(process.cwd(), 'public', 'search');
          await fs.mkdir(searchDir, { recursive: true });

          // Split documents into chunks
          const chunks: SearchableDocument[][] = [];
          for (let i = 0; i < pageDocs.length; i += CHUNK_SIZE) {
            chunks.push(pageDocs.slice(i, i + CHUNK_SIZE));
          }

          // Create manifest with build version
          const manifest: SearchManifest = {
            version: buildVersion,
            totalDocuments: pageDocs.length,
            chunks: chunks.map((chunk, index) => ({
              id: `chunk-${index}`,
              size: chunk.length,
            }))
          };

          // Write manifest
          await fs.writeFile(
            path.join(searchDir, 'manifest.json'),
            JSON.stringify(manifest, null, 2)
          );

          // Write and compress chunks
          await Promise.all(
            chunks.map(async (chunk, index) => {
              const chunkData = JSON.stringify(chunk);
              const compressed = await gzip(chunkData);
              await fs.writeFile(
                path.join(searchDir, `chunk-${index}.json.gz`),
                compressed
              );
            })
          );

          console.log(`Generated search index with ${chunks.length} chunks`);
          console.log(`Total unique documents: ${pageDocs.length}`);
          console.log(`Processed URLs: ${Array.from(processedUrls).join(', ')}`);
        } catch (error) {
          console.error('Error generating search index:', error);
        }
      },
    },
  };
}
