import type { AstroIntegration } from 'astro';
import { getGitHubReleases } from '../utils/github';

export default function githubReleases(): AstroIntegration {
  return {
    name: 'github-releases',
    hooks: {
      'astro:build:setup': async () => {
        try {
          console.log('Checking GitHub releases...');
          await getGitHubReleases();
        } catch (error) {
          console.error('Error in github-releases integration:', error);
        }
      }
    }
  };
}
