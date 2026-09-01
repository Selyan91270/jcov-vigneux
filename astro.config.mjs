// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// Adresse publique du site. C'est le SEUL endroit à modifier le jour où le
// nom de domaine change : liens canoniques, sitemap et aperçus de partage
// en découlent. L'hébergeur peut aussi la fournir via la variable SITE_URL,
// ce qui permet aux déploiements de préversion d'utiliser leur propre URL.
const SITE_URL = process.env.SITE_URL ?? 'https://jcov-vigneux.fr';

// https://astro.build/config
export default defineConfig({
  site: SITE_URL,
  integrations: [sitemap()],
  build: {
    // Sort les scripts et les styles dans des fichiers externes au lieu de les
    // écrire dans le HTML. Sans cela, la politique de sécurité du contenu
    // (public/_headers) devrait autoriser 'unsafe-inline', ce qui la viderait
    // de son intérêt.
    inlineStylesheets: 'never',
  },
  vite: {
    plugins: [tailwindcss()],
    build: {
      // 0 = ne jamais convertir un fichier en donnée intégrée au HTML.
      assetsInlineLimit: 0,
    },
  },
});
