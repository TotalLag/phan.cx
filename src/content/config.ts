import { defineCollection, z } from 'astro:content';

// Define schemas
const blogSchema = z.object({
  title: z.string(),
  date: z.coerce.date(),
  topic: z.string(),
  cover: z.string().optional(),
});

const instagramSchema = z.object({
  id: z.string(),
  username: z.string(),
  image: z.string(),
  date: z.coerce.date(),
  caption: z.string().optional(),
});

// Define collections
export const collections = {
  blog: defineCollection({
    type: 'content',
    schema: blogSchema,
  }),
  instagram: defineCollection({
    type: 'data',
    schema: instagramSchema,
  }),
};

// Export schema types
export type BlogCollection = z.infer<typeof blogSchema>;
export type InstagramCollection = z.infer<typeof instagramSchema>;
