import type { AstroIntegration } from 'astro';
import { writeFile, readFile } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

interface GitHubRelease {
  id: number;
  name: string | null;
  tag_name: string;
  published_at: string;
  body: string | null;
}

interface Release {
  id: string;
  name: string;
  tag: string;
  date: string;
  body: string;
}

const CACHE_FILE = join('src', 'data', 'releases.json');
const CACHE_DURATION = 3600000; // 1 hour in milliseconds

async function getLastModifiedTime(): Promise<number> {
  try {
    const stats = await readFile(CACHE_FILE);
    return stats ? new Date().getTime() : 0;
  } catch {
    return 0;
  }
}

async function getCachedReleases(): Promise<Release[] | null> {
  try {
    if (!existsSync(CACHE_FILE)) {
      return null;
    }
    const lastModified = await getLastModifiedTime();
    const now = new Date().getTime();
    
    // Return null if cache is older than CACHE_DURATION
    if (now - lastModified > CACHE_DURATION) {
      return null;
    }

    const data = await readFile(CACHE_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading cache:', error);
    return null;
  }
}

export default function githubReleases(): AstroIntegration {
  return {
    name: 'github-releases',
    hooks: {
      'astro:build:setup': async () => {
        try {
          console.log('Checking GitHub releases...');
          
          // Try to get cached releases first
          const cachedReleases = await getCachedReleases();
          if (cachedReleases) {
            console.log('✅ Using cached releases data');
            return;
          }

          console.log('Fetching fresh releases data from GitHub...');
          
          const response = await fetch(
            'https://api.github.com/repos/TotalLag/phan.cx/releases',
            {
              headers: {
                'Accept': 'application/vnd.github.v3+json',
                'User-Agent': 'astro-github-releases'
              }
            }
          );

          if (!response.ok) {
            if (response.status === 403) {
              console.warn('⚠️ GitHub API rate limit exceeded');
              // If we have cached data and hit rate limit, use the cached data
              if (cachedReleases) {
                console.log('✅ Using cached releases data due to rate limit');
                return;
              }
            }
            throw new Error(`GitHub API responded with ${response.status}: ${await response.text()}`);
          }

          const releases: GitHubRelease[] = await response.json();
          
          if (!Array.isArray(releases)) {
            throw new Error('Invalid response format from GitHub API');
          }

          // Transform the data
          const transformedReleases: Release[] = releases
            .sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime())
            .map(release => ({
              id: release.id.toString(),
              name: release.name || release.tag_name,
              tag: release.tag_name,
              date: release.published_at,
              body: release.body || ''
            }));

          // Write releases data
          await writeFile(
            CACHE_FILE,
            JSON.stringify(transformedReleases, null, 2),
            'utf-8'
          );

          console.log('✅ Successfully updated releases data');
        } catch (error) {
          console.error('Error handling releases:', error);
          
          // If we have cached data and encounter an error, use the cached data
          const cachedReleases = await getCachedReleases();
          if (cachedReleases) {
            console.log('✅ Using cached releases data due to error');
            return;
          }
          
          // Write fallback data only if we don't have cached data
          const fallbackData: Release[] = [{
            id: "1",
            name: "Initial Release",
            tag: "v1.0.0",
            date: new Date().toISOString(),
            body: "First release"
          }];

          await writeFile(
            CACHE_FILE,
            JSON.stringify(fallbackData, null, 2),
            'utf-8'
          );
          
          console.log('✅ Using fallback release data');
        }
      }
    }
  };
}
