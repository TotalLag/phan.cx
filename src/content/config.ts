import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    topic: z.string().optional(),
    title: z.string(),
    excerpt: z.string(),
    keywords: z.string(),
    date: z.coerce.date(),
    cover: z.string().optional(),
    top: z.boolean().optional(),
    caption: z.string().optional(),
    updated: z.coerce.date().optional(),
  }),
});

export const collections = {
  blog,
};
