// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // TODO: remplacer par le vrai nom de domaine du site une fois déployé (nécessaire pour le sitemap et le SEO).
  site: 'https://jcov-vigneux.fr',
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
    server: {
      watch: {
        ignored: ['**/.cache/**']
      }
    }
  }
});