/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly ANTHROPIC_API_KEY: string;
  readonly INSTAGRAM_USERNAME: string;
  readonly INSTAGRAM_SESSION_ID: string;
  readonly ASTRO_CACHE_DIR: string;
  readonly ASTRO_THREADS: string;
  readonly PARALLEL_COUNT: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Astro content collection types
declare module 'astro:content' {
  interface Render {
    '.md': Promise<{
      Content: import('astro').MarkdownInstance<{}>['Content'];
      headings: import('astro').MarkdownHeading[];
      remarkPluginFrontmatter: Record<string, any>;
    }>;
  }
}

declare module 'astro:content' {
  export interface CollectionEntry {
    blog: {
      data: {
        title: string;
        date: Date;
        topic: string;
        cover?: string;
        excerpt?: string; // Added to match SearchableDocument
      };
      id: string; // Added to match SearchableDocument
      slug: string; // For URL generation
      body: string; // Added to match SearchableDocument content
    };
    instagram: {
      data: {
        id: string;
        username: string;
        image: string;
        date: Date;
        caption?: string;
      };
    };
  }
}
