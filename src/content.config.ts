import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'zod';

const actualites = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/actualites' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      date: z.coerce.date(),
      badge: z.string(),
      badgeColor: z.enum(['blue', 'gold']).default('blue'),
      image: image(),
      imageAlt: z.string(),
    }),
});

export const collections = { actualites };
