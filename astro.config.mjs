import { defineConfig, envField } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import solid from '@astrojs/solid-js';
import githubReleases from './src/integrations/github-releases';
import codeStats from './src/integrations/code-stats';
import { pageIndexIntegration } from './src/integrations/page-index';

export default defineConfig({
  // Explicit build configuration
  build: {
    // Use Astro's built-in cacheDir configuration
    cacheDir: process.env.ASTRO_CACHE_DIR || '.astro/cache',
    
    // Adjust build performance
    concurrency: process.env.BUILD_CONCURRENCY 
      ? parseInt(process.env.BUILD_CONCURRENCY, 10) 
      : 1,
  },

  // Experimental environment variable handling
  experimental: {
    env: {
      schema: {
        ASTRO_CACHE_DIR: envField.string({ 
          context: 'server', 
          access: 'public', 
          optional: true,
          default: '.astro/cache'
        }),
        ASTRO_THREADS: envField.boolean({
          context: 'server',
          access: 'public',
          default: false
        }),
        BUILD_CONCURRENCY: envField.number({
          context: 'server',
          access: 'public',
          default: 1
        })
      },
      validateSecrets: true
    },
    
    // Conditionally enable content collection cache
    contentCollectionCache: process.env.ASTRO_THREADS === 'true'
  },

  // Existing integrations and other configurations
  integrations: [
    solid(),
    tailwind({
      config: { path: './tailwind.config.cjs' },
    }),
    mdx({
      extendMarkdownConfig: true,
    }),
    githubReleases(),
    codeStats(),
    pageIndexIntegration(),
  ],

  // Other existing configurations remain the same
  markdown: {
    shikiConfig: {
      theme: 'one-dark-pro',
      wrap: true,
    },
  },
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp',
      config: {
        limitInputPixels: 4758600,
      },
    },
    domains: ['placehold.co', 'via.placeholder.com', 'images.unsplash.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
    ],
  },
});
