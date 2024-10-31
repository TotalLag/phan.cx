import type { AstroIntegration } from 'astro';
import { getGitHubReleases } from '../utils/github';

export default function githubReleases(): AstroIntegration {
  return {
    name: 'github-releases',
    hooks: {
      'astro:build:setup': async () => {
        await getGitHubReleases();
      }
    }
  };
}
