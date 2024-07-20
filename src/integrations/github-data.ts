// src/integrations/github-data.ts
import type { AstroIntegration } from 'astro';
import { getGitHubData } from '../lib/github';

export default function githubDataIntegration(): AstroIntegration {
  return {
    name: 'github-data-integration',
    hooks: {
      'astro:config:setup': async ({ updateConfig }) => {
        const GHData = await getGitHubData();
        updateConfig({
          vite: {
            define: {
              'import.meta.env.GH_DATA': JSON.stringify(GHData),
            },
          },
        });
      },
    },
  };
}