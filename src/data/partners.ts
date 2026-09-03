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
//
// `logoShape` corrige l'équilibre optique de la rangée : à hauteur égale,
// un logo carré occupe deux fois moins de surface qu'un logo large et
// paraît écrasé — on lui en donne davantage.

import type { ImageMetadata } from 'astro';
import logoVigneux from '../assets/images/logo-vigneux.png';
import logoFfjudo from '../assets/images/logo-ffjudo.png';
import logoComiteEssonne from '../assets/images/logo-comite-essonne-judo.png';
import logoEssonne from '../assets/images/logo-essonne.png';

export type Partner = {
  name: string;
  url: string;
  logo?: ImageMetadata;
  logoBackdrop?: 'light' | 'dark';
  logoShape?: 'wide' | 'square';
};

// Rangés du plus proche au plus lointain : la ville, le département, le
// comité départemental de judo, puis la fédération.
export const partners: Partner[] = [
  {
    name: 'Ville de Vigneux-sur-Seine',
    url: 'https://www.vigneux-sur-seine.fr',
    logo: logoVigneux,
    logoBackdrop: 'light',
  },
  {
    name: "Département de l'Essonne",
    url: 'https://www.essonne.fr',
    logo: logoEssonne,
    logoBackdrop: 'dark',
  },
  {
    name: "Comité de l'Essonne de Judo",
    url: 'https://judo91.com',
    logo: logoComiteEssonne,
    logoBackdrop: 'light',
    logoShape: 'square',
  },
  {
    name: 'Fédération Française de Judo',
    url: 'https://www.ffjudo.com',
    logo: logoFfjudo,
    logoBackdrop: 'dark',
  },
];
