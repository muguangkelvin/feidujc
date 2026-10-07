import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blogCollection = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    updated: z.coerce.date(),
    category: z.enum(['airports', 'reviews', 'comparisons', 'guides', 'clients', 'faq', 'general']),
    tags: z.array(z.string()).default([]),
    author: z.string().default('飞渡机场'),
    cover: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = {
  blog: blogCollection,
};
