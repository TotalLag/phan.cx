import { InstagramDownloader } from '../src/utils/instagram';
import path from 'path';
import { config } from 'dotenv';

// Load environment variables from .env file
config();

// Configuration
const CONFIG = {
  sessionId: process.env.INSTAGRAM_SESSION_ID || '',
  outputDir: path.join(process.cwd(), 'src', 'assets', 'instagram'),
  targetUsername: process.env.INSTAGRAM_USERNAME || '',
  rateLimitPerMinute: 20,
  maxPosts: 10,
};

async function main() {
  if (!CONFIG.sessionId) {
    console.error('Error: Instagram session ID is required.');
    process.exit(1);
  }

  if (!CONFIG.targetUsername) {
    console.error(
      'Error: Target username is required. Set INSTAGRAM_USERNAME environment variable.'
    );
    process.exit(1);
  }

  try {
    console.log('=== Instagram Image Downloader ===');
    console.log('Target Username:', CONFIG.targetUsername);
    console.log('Output Directory:', CONFIG.outputDir);
    console.log('Max Posts:', CONFIG.maxPosts);
    console.log(
      'Rate Limit:',
      CONFIG.rateLimitPerMinute,
      'requests per minute'
    );
    console.log('================================');

    const downloader = new InstagramDownloader({
      sessionId: CONFIG.sessionId,
      outputDir: CONFIG.outputDir,
      rateLimitPerMinute: CONFIG.rateLimitPerMinute,
      maxPosts: CONFIG.maxPosts,
    });

    // First verify login
    console.log('\n1. Verifying Instagram login...');
    const isLoggedIn = await downloader.verifyLogin();

    if (!isLoggedIn) {
      console.error('\nLogin verification failed!');
      console.error('Please check your session ID and try again.');
      process.exit(1);
    }

    console.log('\n2. Starting image download process...');
    const downloadedFiles = await downloader.downloadProfileImages(
      CONFIG.targetUsername
    );

    if (downloadedFiles.length === 0) {
      console.log('\nNo images were downloaded. This could mean:');
      console.log('- The profile has no posts');
      console.log('- The profile is private');
      console.log('- The session ID does not have access to view the profile');
    } else {
      console.log('\nDownload completed successfully!');
      console.log(
        `Downloaded ${downloadedFiles.length} files to ${CONFIG.outputDir}:`
      );
      downloadedFiles.forEach((file) => console.log(`- ${file}`));
      console.log('\nMetadata saved to: src/content/instagram/');
    }
  } catch (error) {
    console.error('\nError occurred during execution:');
    if (error instanceof Error) {
      console.error('- Message:', error.message);
      console.error('- Stack:', error.stack);
    } else {
      console.error('- Unknown error:', error);
    }
    process.exit(1);
  }
}

main();
