// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// Adresse publique du site. C'est le SEUL endroit à modifier le jour où le
// nom de domaine change : liens canoniques, sitemap et aperçus de partage
// en découlent. La variable SITE_URL permet à un déploiement de préversion
// d'utiliser sa propre adresse sans toucher au fichier.
const SITE_URL = process.env.SITE_URL ?? 'https://jcov.fr';

// Sous-dossier dans lequel le site est servi. Le domaine jcov.fr sert le
// site à la racine : la valeur reste '/'.
//
// Elle a longtemps été déduite de la configuration GitHub Pages, qui
// renvoyait '/jcov-vigneux' tant que le site vivait à l'adresse
// selyan91270.github.io/jcov-vigneux. Le jour du branchement du domaine,
// cette déduction a produit une page entièrement blanche : le HTML était
// bien servi, mais il réclamait ses styles et ses scripts dans un
// sous-dossier qui n'existe plus à la racine. La valeur est donc fixée ici,
// et non plus devinée depuis un réglage distant.
const BASE_PATH = process.env.BASE_PATH?.trim() || '/';

// https://astro.build/config
export default defineConfig({
  site: SITE_URL,
  base: BASE_PATH,
  // Chaque page est publiée comme `dossier/index.html` : elle n'existe qu'à
  // l'adresse avec barre finale. On l'impose partout pour que le serveur de
  // développement se comporte comme l'hébergeur, et qu'un lien sans barre
  // soit repéré ici plutôt qu'en production.
  trailingSlash: 'always',
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
