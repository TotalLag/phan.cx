import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    topic: z.string(),
    excerpt: z.string().optional(),
    cover: z.string().optional(),
    draft: z.boolean().optional().default(false),
  })
});

export const collections = {
  blog
};
