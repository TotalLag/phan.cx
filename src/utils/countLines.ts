import fs from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// File extensions to count
const CODE_EXTENSIONS = new Set([
  // JavaScript/TypeScript
  '.js', '.jsx', '.ts', '.tsx',
  // Web
  '.html', '.css', '.scss', '.sass',
  // Template files
  '.astro', '.svelte', '.vue',
  // Config files
  '.json', '.yml', '.yaml',
  // Documentation
  '.md', '.mdx'
]);

// Directories to ignore
const IGNORE_DIRS = new Set([
  'node_modules',
  'dist',
  'build',
  '.git',
  '.cache',
  'public',
  'data',
  '.astro',
  '.vscode'
]);

export interface CodeStats {
  totalLines: number;
  formattedLines: string;
  fileCount: number;
  byExtension: { [key: string]: { files: number; lines: number } };
  lastUpdated: string;
}

const CACHE_FILE = path.join('src', 'data', 'code-stats.json');
const CACHE_DURATION = 360000; // 6mins in milliseconds

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'm';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k';
  }
  return num.toString();
}

async function getLastModifiedTime(): Promise<number> {
  try {
    const stats = await fs.stat(CACHE_FILE);
    return stats ? stats.mtimeMs : 0;
  } catch {
    return 0;
  }
}

async function getCachedStats(): Promise<CodeStats | null> {
  try {
    if (!existsSync(CACHE_FILE)) {
      return null;
    }
    const lastModified = await getLastModifiedTime();
    const now = new Date().getTime();
    
    if (now - lastModified > CACHE_DURATION) {
      return null;
    }

    const data = await fs.readFile(CACHE_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading cache:', error);
    return null;
  }
}

async function processFile(filePath: string): Promise<{ lines: number; ext: string } | null> {
  const ext = path.extname(filePath).toLowerCase();
  if (!CODE_EXTENSIONS.has(ext)) return null;

  try {
    const content = await fs.readFile(filePath, 'utf-8');
    const lines = content.split('\n').length;
    return { lines, ext };
  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error);
    return null;
  }
}

async function scanDirectory(dir: string): Promise<Map<string, { files: number; lines: number }>> {
  const stats = new Map<string, { files: number; lines: number }>();
  
  async function scan(currentDir: string) {
    try {
      const entries = await fs.readdir(currentDir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(currentDir, entry.name);
        
        if (entry.isDirectory()) {
          if (!IGNORE_DIRS.has(entry.name)) {
            await scan(fullPath);
          }
        } else if (entry.isFile()) {
          const result = await processFile(fullPath);
          if (result) {
            const current = stats.get(result.ext) || { files: 0, lines: 0 };
            stats.set(result.ext, {
              files: current.files + 1,
              lines: current.lines + result.lines
            });
          }
        }
      }
    } catch (error) {
      console.error(`Error scanning directory ${currentDir}:`, error);
    }
  }

  await scan(dir);
  return stats;
}

async function generateStats(): Promise<CodeStats> {
  // Get project root directory
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const rootDir = path.resolve(__dirname, '../..');

  const statsByExt = await scanDirectory(rootDir);
  
  // Calculate totals
  let totalLines = 0;
  let totalFiles = 0;
  const byExtension: { [key: string]: { files: number; lines: number } } = {};

  statsByExt.forEach((value, key) => {
    totalLines += value.lines;
    totalFiles += value.files;
    byExtension[key] = value;
  });

  return {
    totalLines,
    formattedLines: formatNumber(totalLines),
    fileCount: totalFiles,
    byExtension,
    lastUpdated: new Date().toISOString()
  };
}

export async function getCodeStats(): Promise<CodeStats> {
  try {
    console.log('Checking code stats...');
    
    // Try to get cached stats first
    const cachedStats = await getCachedStats();
    if (cachedStats) {
      console.log('✅ Using cached code stats');
      return cachedStats;
    }

    console.log('Generating fresh code stats...');
    const stats = await generateStats();
    
    // Cache the results
    await fs.writeFile(
      CACHE_FILE,
      JSON.stringify(stats, null, 2),
      'utf-8'
    );
    
    console.log('✅ Successfully generated code stats');
    return stats;
  } catch (error) {
    console.error('Error handling code stats:', error);
    
    // If we have cached stats and encounter an error, use the cached stats
    const cachedStats = await getCachedStats();
    if (cachedStats) {
      console.log('✅ Using cached code stats due to error');
      return cachedStats;
    }
    
    // Return fallback data if we don't have cached stats
    const fallbackData: CodeStats = {
      totalLines: 0,
      formattedLines: '0',
      fileCount: 0,
      byExtension: {},
      lastUpdated: new Date().toISOString()
    };

    await fs.writeFile(
      CACHE_FILE,
      JSON.stringify(fallbackData, null, 2),
      'utf-8'
    );
    
    console.log('✅ Using fallback code stats');
    return fallbackData;
  }
}
