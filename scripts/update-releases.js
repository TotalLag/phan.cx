import { getGitHubReleases } from '../src/utils/github.js';
import { writeFile } from 'fs/promises';
import { join } from 'path';

/**
 * Script to update GitHub releases data without running Astro build
 * 
 * Usage:
 * 1. From the command line:
 *    npm run update-releases
 * 
 * This will fetch the latest releases and update src/data/releases.json
 */

const RELEASES_FILE = join('src', 'data', 'releases.json');

async function updateReleases() {
  try {
    console.log('Fetching GitHub releases...');
    const releases = await getGitHubReleases();
    
    await writeFile(
      RELEASES_FILE,
      JSON.stringify(releases, null, 2),
      'utf-8'
    );
    
    console.log('✅ Successfully updated releases.json');
  } catch (error) {
    console.error('Error updating releases:', error);
    process.exit(1);
  }
}

updateReleases();
