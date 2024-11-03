/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />
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
      };
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
