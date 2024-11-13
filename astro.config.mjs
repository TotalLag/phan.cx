import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import solid from '@astrojs/solid-js';
import sitemap from '@astrojs/sitemap';
import githubReleases from './src/integrations/github-releases';
import codeStats from './src/integrations/code-stats';
import { pageIndexIntegration } from './src/integrations/page-index';

export default defineConfig({
  site: 'https://phan.cx',
  output: 'static',
  // Existing integrations and other configurations
  integrations: [
    solid(),
    tailwind({
      config: { path: './tailwind.config.cjs' },
    }),
    mdx({
      extendMarkdownConfig: true,
    }),
    sitemap({
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
      filter: (page) => 
        !page.includes('/private/') && 
        !page.includes('/admin/') && 
        !page.includes('/api/') &&
        page.startsWith('https://phan.cx')
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
