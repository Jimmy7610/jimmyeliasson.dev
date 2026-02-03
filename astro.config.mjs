import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
    site: 'https://jimmyeliasson.dev',
    integrations: [
        mdx(),
        react(),
        tailwind({
            applyBaseStyles: false,
        }),
        sitemap(),
    ],
});
