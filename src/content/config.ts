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

const resumeSchema = z.object({
  info: z.object({
    name: z.string(),
    address: z.string(),
    phone: z.string(),
    email: z.string()
  }),
  summary: z.array(z.object({
    item: z.string()
  })),
  qualifications: z.array(z.object({
    item: z.string()
  })),
  experience: z.array(z.object({
    title: z.string(),
    company: z.string(),
    location: z.string(),
    dateFrom: z.string(),
    dateTo: z.string(),
    work: z.array(z.object({
      item: z.string()
    }))
  })),
  education: z.array(z.object({
    degree: z.string(),
    name: z.string(),
    location: z.string(),
    dateFrom: z.string(),
    dateTo: z.string()
  })).optional(),
  type: z.enum(['strategic', 'technical'])
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
  resume: defineCollection({
    type: 'data',
    schema: resumeSchema,
  }),
};

// Export schema types
export type BlogCollection = z.infer<typeof blogSchema>;
export type InstagramCollection = z.infer<typeof instagramSchema>;
export type ResumeCollection = z.infer<typeof resumeSchema>;
