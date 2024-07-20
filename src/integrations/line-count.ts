// src/integrations/line-count.ts
import type { AstroIntegration } from 'astro';
import { getLineCount } from '../lib/linecount';

export default function lineCountIntegration(): AstroIntegration {
  return {
    name: 'line-count-integration',
    hooks: {
      'astro:config:setup': ({ updateConfig }) => {
        const lineCount = getLineCount();
        updateConfig({
          vite: {
            define: {
              'import.meta.env.LINE_COUNT': JSON.stringify(lineCount),
            },
          },
        });
      },
    },
  };
}