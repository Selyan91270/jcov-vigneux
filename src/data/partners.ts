// Partenaires et affiliations affichés dans le footer.
//
// Pour ajouter un logo : déposer le fichier dans src/assets/images/,
// l'importer ci-dessous et le passer en `logo`. Tant que `logo` est
// absent, le nom du partenaire s'affiche dans un cadre — la section
// reste présentable en attendant.

import type { ImageMetadata } from 'astro';

export type Partner = {
  name: string;
  url: string;
  logo?: ImageMetadata;
};

export const partners: Partner[] = [
  {
    name: 'Ville de Vigneux-sur-Seine',
    url: 'https://www.vigneux-sur-seine.fr',
  },
  {
    name: 'Fédération Française de Judo',
    url: 'https://www.ffjudo.com',
  },
];
