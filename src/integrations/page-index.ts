import type { AstroIntegration } from 'astro'
import { cleanText } from '../utils/search'
import type { SearchableDocument, SearchManifest } from '../types/search'
import fs from 'fs/promises'
import path from 'path'
import zlib from 'zlib'
import { promisify } from 'util'

const gzip = promisify(zlib.gzip)
const CHUNK_SIZE = 2 // Number of documents per chunk
const VERSION = '1.0.0'

export function pageIndexIntegration(): AstroIntegration {
  return {
    name: 'page-index',
    hooks: {
      'astro:build:done': async ({ dir }) => {
        try {
          // Read the dist directory
          const distPath = dir.pathname
          const pages = await fs.readdir(distPath, { recursive: true })
          
          // Filter and process HTML files
          const pageDocs = await Promise.all(
            pages
              .filter(filePath => {
                // Only process HTML files
                if (typeof filePath !== 'string' || !filePath.endsWith('.html')) {
                  return false
                }
                
                // Convert path to URL format for consistent checking
                const urlPath = '/' + filePath
                  .replace(/\.html$/, '')
                  .replace(/index$/, '')
                
                // Exclude specific paths
                const excludedPaths = [
                  '/404',
                  '/api/',
                  '/_',
                  '/blog/'  // Only exclude the blog index page
                ]
                
                // Check for exact matches only
                return !excludedPaths.includes(urlPath)
              })
              .map(async (filePath) => {
                // Read the HTML file
                const fullPath = path.join(distPath, filePath as string)
                const html = await fs.readFile(fullPath, 'utf-8')

                // Get URL from file path
                const url = '/' + (filePath as string)
                  .replace(/\.html$/, '')
                  .replace(/index$/, '')
                  // Remove trailing slash except for root
                  .replace(/(.+)\/$/, '$1')

                // Extract title from HTML
                const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/)
                const title = titleMatch ? titleMatch[1] : 'Untitled Page'

                // Extract main content if available
                const mainMatch = html.match(/<main[^>]*>([\s\S]*?)<\/main>/)
                const content = mainMatch ? mainMatch[1] : html

                // Clean content for searching
                const cleanedContent = cleanText(content)

                // Create excerpt
                const excerpt = cleanedContent.split(' ').slice(0, 30).join(' ') + '...'

                return {
                  id: url || '/',  // Use '/' for root path
                  title: cleanText(title),
                  excerpt: cleanText(excerpt),
                  content: cleanedContent,
                  url: url || '/'   // Use '/' for root path
                }
              })
          )

          // Create search directory in public
          const searchDir = path.join(process.cwd(), 'public', 'search')
          await fs.mkdir(searchDir, { recursive: true })

          // Split documents into chunks
          const chunks: SearchableDocument[][] = []
          for (let i = 0; i < pageDocs.length; i += CHUNK_SIZE) {
            chunks.push(pageDocs.slice(i, i + CHUNK_SIZE))
          }

          // Create manifest
          const manifest: SearchManifest = {
            version: VERSION,
            totalDocuments: pageDocs.length,
            chunks: chunks.map((_, index) => ({
              id: `chunk-${index}`,
              size: chunks[index].length
            })),
            initial: chunks[0]?.[0] ? [chunks[0][0].id] : []
          }

          // Write manifest
          await fs.writeFile(
            path.join(searchDir, 'manifest.json'),
            JSON.stringify(manifest, null, 2)
          )

          // Write and compress initial chunk
          if (chunks[0]) {
            const initialData = JSON.stringify(chunks[0])
            const compressedInitial = await gzip(initialData)
            await fs.writeFile(
              path.join(searchDir, 'initial.json.gz'),
              compressedInitial
            )
          }

          // Write and compress remaining chunks
          await Promise.all(
            chunks.map(async (chunk, index) => {
              const chunkData = JSON.stringify(chunk)
              const compressed = await gzip(chunkData)
              await fs.writeFile(
                path.join(searchDir, `chunk-${index}.json.gz`),
                compressed
              )
            })
          )

          console.log(`Generated search index with ${chunks.length} chunks`)
          
        } catch (error) {
          console.error('Error generating search index:', error)
        }
      }
    }
  }
}
