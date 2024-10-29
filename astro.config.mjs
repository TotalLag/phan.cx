import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  integrations: [
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
