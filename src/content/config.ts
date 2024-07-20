import { defineCollection, z } from 'astro:content';

const settingsCollection = defineCollection({
  type: 'data',
  schema: z.object({
    sitename: z.string(),
    origin: z.string(),
    // Add other settings fields as needed
  }),
});

export const collections = {
  config: settingsCollection,
};