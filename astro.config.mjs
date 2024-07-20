import { defineConfig } from 'astro/config';
import qwikdev from '@qwikdev/astro';
import tailwind from '@astrojs/tailwind';
import githubDataIntegration from './src/integrations/github-data';
import lineCountIntegration from './src/integrations/line-count';

export default defineConfig({
  integrations: [qwikdev(), tailwind(), githubDataIntegration(), lineCountIntegration()],
  output: 'server',
});