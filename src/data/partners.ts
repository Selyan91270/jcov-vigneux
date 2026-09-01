// Partenaires et affiliations affichés dans le footer.
//
// Pour ajouter un partenaire : déposer le logo dans src/assets/images/,
// l'importer ci-dessous et le passer en `logo`. Tant que `logo` est absent,
// le nom du partenaire s'affiche dans un cadre.
//
// `logoBackdrop` indique ce dont le logo a besoin pour rester lisible :
//   'light' → logo coloré ou sombre, posé sur une pastille blanche
//   'dark'  → logo blanc, posé directement sur le bleu du footer
// Sans cette distinction, un logo blanc disparaîtrait sur fond blanc.

import type { ImageMetadata } from 'astro';
import logoVigneux from '../assets/images/logo-vigneux.png';
import logoFfjudo from '../assets/images/logo-ffjudo.png';

export type Partner = {
  name: string;
  url: string;
  logo?: ImageMetadata;
  logoBackdrop?: 'light' | 'dark';
};

export const partners: Partner[] = [
  {
    name: 'Ville de Vigneux-sur-Seine',
    url: 'https://www.vigneux-sur-seine.fr',
    logo: logoVigneux,
    logoBackdrop: 'light',
  },
  {
    name: 'Fédération Française de Judo',
    url: 'https://www.ffjudo.com',
    logo: logoFfjudo,
    logoBackdrop: 'dark',
  },
];
