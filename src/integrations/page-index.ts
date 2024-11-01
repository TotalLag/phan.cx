import type { AstroIntegration } from 'astro'
import { cleanText } from '../utils/search'
import type { SearchableDocument } from '../types/search'
import fs from 'fs/promises'
import path from 'path'

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

          // Write page index to a file
          const outputPath = path.join(dir.pathname, '../src/data/page-index.json')
          await fs.mkdir(path.dirname(outputPath), { recursive: true })
          await fs.writeFile(outputPath, JSON.stringify(pageDocs, null, 2))
          console.log(`Generated page index with ${pageDocs.length} pages`)
          
        } catch (error) {
          console.error('Error generating page index:', error)
        }
      }
    }
  }
}
