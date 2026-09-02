// Comité de direction du club.
//
// `photo` est facultatif : tant qu'aucune image n'est fournie, la page
// affiche un avatar générique, comme pour les professeurs. Pour en ajouter
// une, déposer le fichier dans src/assets/images/, l'importer ici et le
// passer en `photo`.
//
// Pas de grade ni de diplôme ici : ce sont des fonctions associatives,
// pas des qualifications d'enseignement.

import type { ImageMetadata } from 'astro';

export type CommitteeMember = {
  id: string;
  firstName: string;
  /** Facultatif tant que le nom de famille n'a pas été communiqué. */
  lastName?: string;
  role: string;
  photo?: ImageMetadata;
};

export const committee: CommitteeMember[] = [
  {
    id: 'rachid',
    firstName: 'Rachid',
    role: "Président de l'association",
  },
];
