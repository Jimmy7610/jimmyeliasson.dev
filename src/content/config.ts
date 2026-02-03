import { defineCollection, z } from 'astro:content';

const bilingualString = z.object({
    sv: z.string(),
    en: z.string(),
});

const projectsCollection = defineCollection({
    type: 'content',
    schema: z.object({
        title: bilingualString,
        description: bilingualString,
        role: bilingualString.optional(),
        status: z.enum(['active', 'done', 'paused']),
        year: z.number(),
        tags: z.array(z.string()),
        stack: z.array(z.string()),
        links: z.object({
            repo: z.string().url().optional(),
            live: z.string().url().optional(),
        }).optional(),
        coverImage: z.string(),
        galleryImages: z.array(z.string()).optional(),
        highlightBullets: z.object({
            sv: z.array(z.string()),
            en: z.array(z.string()),
        }).optional(),
    }),
});

const updatesCollection = defineCollection({
    type: 'content',
    schema: z.object({
        title: bilingualString,
        date: z.date(),
        tags: z.array(z.string()).optional(),
    }),
});

export const collections = {
    projects: projectsCollection,
    updates: updatesCollection,
};
