// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// Adresse publique du site. C'est le SEUL endroit à modifier le jour où le
// nom de domaine change : liens canoniques, sitemap et aperçus de partage
// en découlent. L'hébergeur peut aussi la fournir via la variable SITE_URL,
// ce qui permet aux déploiements de préversion d'utiliser leur propre URL.
const SITE_URL = process.env.SITE_URL ?? 'https://jcov-vigneux.fr';

// Sous-dossier dans lequel le site est servi. Vaut '/' pour un domaine
// personnalisé, mais '/nom-du-depot/' sur GitHub Pages quand le dépôt n'est
// pas un site utilisateur. Renseigné par le workflow de déploiement.
// GitHub Pages fournit '' pour un site à la racine et '/nom-du-depot' sinon,
// d'où la normalisation.
const BASE_PATH = process.env.BASE_PATH?.trim() || '/';

// https://astro.build/config
export default defineConfig({
  site: SITE_URL,
  base: BASE_PATH,
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
