// Comité de direction du club.
//
// `photo` est facultatif : tant qu'aucune image n'est fournie, la page
// affiche un avatar générique, comme pour les professeurs. Pour en ajouter
// une, déposer le fichier dans src/assets/images/, l'importer ici et le
// passer en `photo`.
//
// `dan` est facultatif aussi : certains membres du bureau sont gradés, mais
// c'est indépendant de leur fonction associative.

import type { ImageMetadata } from 'astro';

export type CommitteeMember = {
  id: string;
  firstName: string;
  lastName: string;
  role: string;
  dan?: number;
  photo?: ImageMetadata;
};

export const committee: CommitteeMember[] = [
  {
    id: 'rachid-zahzouh',
    firstName: 'Rachid',
    lastName: 'Zahzouh',
    role: "Président de l'association",
    dan: 1,
  },
  {
    id: 'collette-koeberle',
    firstName: 'Collette',
    lastName: 'Koeberle',
    role: 'Trésorière',
  },
];
