import type { AstroIntegration } from 'astro';
import { getCodeStats } from '../utils/countLines';
import { createLogger } from '../utils/logger';

// Create a module-specific logger
const codeStatsLogger = createLogger('CodeStatsIntegration');

export default function codeStats(): AstroIntegration {
  return {
    name: 'code-stats',
    hooks: {
      'astro:build:setup': async () => {
        try {
          codeStatsLogger.debug('Generating code statistics...');
          const stats = await getCodeStats();
          codeStatsLogger.info(`Code statistics generated: ${JSON.stringify(stats)}`);
        } catch (error) {
          codeStatsLogger.error('Failed to generate code statistics:', error);
        }
      },
    },
  };
}
