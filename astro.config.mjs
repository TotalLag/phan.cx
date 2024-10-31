import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import solid from '@astrojs/solid-js';
import githubReleases from './src/integrations/github-releases';

// https://astro.build/config
export default defineConfig({
  integrations: [
    solid(),
    tailwind({
      config: { path: './tailwind.config.cjs' },
    }),
    mdx({
      extendMarkdownConfig: true,
    }),
    githubReleases(),
  ],
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
      wrap: true,
    }
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
        hostname: '*.unsplash.com'
      },
      {
        protocol: 'https',
        hostname: 'placehold.co'
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com'
      }
    ],
  },
});
