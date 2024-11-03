import { igApi } from 'insta-fetcher';
import fs from 'fs';
import fsPromises from 'fs/promises';
import path from 'path';
import https from 'https';
import axios from 'axios';

interface InstagramDownloaderConfig {
  sessionId: string;
  outputDir: string;
  rateLimitPerMinute?: number;
  maxPosts?: number;
}

interface InstagramError {
  response?: {
    data?: {
      message?: string;
      feedback_message?: string;
      status?: string;
    };
    status?: number;
  };
  message: string;
}

interface InstagramPost {
  id: string;
  username: string;
  image: string;
  date: Date;
  caption?: string;
}

export class InstagramDownloader {
  private ig: any;
  private outputDir: string;
  private rateLimitPerMinute: number;
  private maxPosts: number;
  private lastRequestTime: number = 0;

  constructor(config: InstagramDownloaderConfig) {
    this.ig = new igApi(config.sessionId);
    this.outputDir = config.outputDir;
    this.rateLimitPerMinute = config.rateLimitPerMinute || 20;
    this.maxPosts = config.maxPosts || 10;
  }

  private async sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private async waitForRateLimit(): Promise<void> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    const minWaitTime = (60 * 1000) / this.rateLimitPerMinute;

    if (timeSinceLastRequest < minWaitTime) {
      const waitTime = minWaitTime - timeSinceLastRequest;
      console.log(
        `Rate limiting: waiting ${Math.round(waitTime)}ms before next request`
      );
      await this.sleep(waitTime);
    }

    this.lastRequestTime = Date.now();
  }

  private async downloadFile(url: string, filename: string): Promise<void> {
    await this.waitForRateLimit();

    return new Promise((resolve, reject) => {
      const fullPath = path.join(this.outputDir, filename);

      https
        .get(
          url,
          {
            headers: {
              'user-agent':
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            },
          },
          (response) => {
            if (response.statusCode !== 200) {
              reject(new Error(`Failed to download: ${response.statusCode}`));
              return;
            }

            const fileStream = fs.createWriteStream(fullPath);
            response.pipe(fileStream);

            fileStream.on('finish', () => {
              fileStream.close();
              resolve();
            });

            fileStream.on('error', (err: Error) => {
              fsPromises.unlink(fullPath).catch(() => {});
              reject(err);
            });
          }
        )
        .on('error', (err: Error) => reject(err));
    });
  }

  private async saveMetadata(posts: InstagramPost[]): Promise<void> {
    const contentDir = path.join(process.cwd(), 'src', 'content', 'instagram');
    await fsPromises.mkdir(contentDir, { recursive: true });

    for (const post of posts) {
      const filename = `${post.id}.json`;
      const filePath = path.join(contentDir, filename);
      await fsPromises.writeFile(filePath, JSON.stringify(post, null, 2));
    }
  }

  private isInstagramError(error: unknown): error is InstagramError {
    return (
      typeof error === 'object' &&
      error !== null &&
      'message' in error &&
      typeof (error as InstagramError).message === 'string'
    );
  }

  async verifyLogin(): Promise<boolean> {
    try {
      await this.waitForRateLimit();
      const response = await this.ig.accountInfo();

      if (response?.user?.username) {
        console.log('Successfully logged in as:', response.user.username);
        return true;
      }

      console.log(
        'Login verification failed. Response:',
        JSON.stringify(response?.user || response, null, 2)
      );
      return false;
    } catch (error) {
      if (this.isInstagramError(error)) {
        console.error('Login verification failed:', error.message);
        if (error.response?.data?.message) {
          console.error('Instagram message:', error.response.data.message);
        }
      } else {
        console.error('Unknown login verification error:', error);
      }
      return false;
    }
  }

  async downloadProfileImages(username: string): Promise<string[]> {
    try {
      // First verify login
      const isLoggedIn = await this.verifyLogin();
      if (!isLoggedIn) {
        throw new Error(
          'Instagram login failed. Please check your session ID.'
        );
      }

      // Ensure output directory exists
      await fsPromises.mkdir(this.outputDir, { recursive: true });

      console.log(`Fetching profile for: ${username}`);
      await this.waitForRateLimit();

      try {
        // Get user info first
        const userInfo = await this.ig.fetchUser(username);
        console.log(`Found profile: ${userInfo.username}`);
        console.log(`Total posts: ${userInfo.post_count}`);
        console.log(`Will download up to ${this.maxPosts} most recent posts`);

        const downloadedFiles: string[] = [];
        const posts: InstagramPost[] = [];

        // Use Instagram's GraphQL API
        const userId = userInfo.id;
        const queryHash = '69cba40317214236af40e7efa697781d';
        let hasNextPage = true;
        let endCursor = '';
        let totalDownloaded = 0;

        while (hasNextPage && totalDownloaded < this.maxPosts) {
          await this.waitForRateLimit();

          const variables = {
            id: userId,
            first: Math.min(12, this.maxPosts - totalDownloaded),
            after: endCursor,
          };

          const url = `https://www.instagram.com/graphql/query/?query_hash=${queryHash}&variables=${encodeURIComponent(JSON.stringify(variables))}`;

          console.log(
            `Fetching posts${endCursor ? ` after ${endCursor}` : ''}`
          );

          const response = await axios.get(url, {
            headers: {
              Cookie: `sessionid=${this.ig.sessionId}`,
              'User-Agent':
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
              'X-IG-App-ID': '936619743392459',
            },
          });

          const edges =
            response.data?.data?.user?.edge_owner_to_timeline_media?.edges;
          if (!edges || !Array.isArray(edges)) {
            console.log('No posts found in response:', response.data);
            break;
          }

          console.log(`Found ${edges.length} posts in current page`);

          for (const edge of edges) {
            if (totalDownloaded >= this.maxPosts) break;

            const node = edge.node;
            if (!node.display_url) continue;

            const filename = `${username}_${node.id}.jpg`;
            console.log(`Downloading: ${filename}`);

            try {
              await this.downloadFile(node.display_url, filename);
              downloadedFiles.push(filename);

              posts.push({
                id: node.id,
                username,
                image: `/instagram/${filename}`,
                date: new Date(parseInt(node.taken_at_timestamp) * 1000),
                caption: node.edge_media_to_caption?.edges[0]?.node?.text,
              });

              totalDownloaded++;
              console.log(
                `Successfully downloaded: ${filename} (${totalDownloaded}/${this.maxPosts})`
              );
              await this.sleep(1000);
            } catch (error) {
              console.error(`Failed to download ${filename}:`, error);
              continue;
            }
          }

          if (totalDownloaded >= this.maxPosts) {
            console.log(`Reached maximum posts limit (${this.maxPosts})`);
            break;
          }

          const pageInfo =
            response.data?.data?.user?.edge_owner_to_timeline_media?.page_info;
          hasNextPage = pageInfo?.has_next_page;
          endCursor = pageInfo?.end_cursor;

          if (hasNextPage) {
            console.log('Waiting before fetching next page...');
            await this.sleep(2000);
          }
        }

        if (posts.length > 0) {
          console.log('Saving metadata to collection...');
          await this.saveMetadata(posts);
        }

        console.log(`\nDownload summary:`);
        console.log(`Total files downloaded: ${downloadedFiles.length}`);
        return downloadedFiles;
      } catch (error) {
        if (this.isInstagramError(error)) {
          if (error.response?.data?.message === 'feedback_required') {
            console.error(
              'Rate limit reached:',
              error.response.data.feedback_message || 'Please try again later.'
            );
            throw new Error(
              'Instagram rate limit reached. Please wait and try again.'
            );
          }
          console.error(
            'Instagram API error:',
            error.response?.data || error.message
          );
        }
        throw error;
      }
    } catch (error) {
      if (this.isInstagramError(error)) {
        console.error('Error downloading Instagram images:', error.message);
        throw new Error(error.message);
      }
      console.error('Unknown error downloading Instagram images:', error);
      throw new Error('Failed to download Instagram images');
    }
  }
}
