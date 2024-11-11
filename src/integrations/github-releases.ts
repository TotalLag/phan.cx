import type { AstroIntegration } from 'astro';
import { getGitHubReleases } from '../utils/github';
import { createLogger } from '../utils/logger';

// Create a module-specific logger
const githubReleasesLogger = createLogger('GitHubReleasesIntegration');

export default function githubReleases(): AstroIntegration {
  return {
    name: 'github-releases',
    hooks: {
      'astro:build:setup': async () => {
        try {
          githubReleasesLogger.debug('Fetching GitHub releases...');
          const releases = await getGitHubReleases();
          githubReleasesLogger.info(`Fetched ${releases.length} GitHub releases`);
        } catch (error) {
          githubReleasesLogger.error('Failed to fetch GitHub releases:', error);
        }
      },
    },
  };
}
