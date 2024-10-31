import type { AstroIntegration } from 'astro';
import { getCodeStats } from '../utils/countLines';

export default function codeStats(): AstroIntegration {
  return {
    name: 'code-stats',
    hooks: {
      'astro:build:setup': async () => {
        await getCodeStats();
      }
    }
  };
}
