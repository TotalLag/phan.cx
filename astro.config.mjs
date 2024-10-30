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
      // Explicitly set config path
      config: { path: './tailwind.config.cjs' },
    }),
    mdx({
      // Enable MDX support
      extendMarkdownConfig: true,
      // Configure MDX options
      remarkPlugins: [],
      rehypePlugins: [],
      // Enable remark/rehype plugins
      gfm: true,
    }),
    githubReleases(),
  ],
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
      wrap: true,
    },
    remarkPlugins: [],
    rehypePlugins: [],
  },
});
