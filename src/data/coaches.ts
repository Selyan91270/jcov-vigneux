// Équipe encadrante du JCOV.
// photo et diplomaUrl sont facultatifs : tant qu'ils ne sont pas renseignés,
// la page affiche un avatar générique et une mention "à venir".
//
// Pour ajouter une photo : déposer le fichier dans src/assets/images/,
// l'importer ici et le passer en `photo` — comme pour le comité de
// direction. L'import (plutôt qu'un chemin en texte) est ce qui permet à
// Astro d'optimiser l'image : 48 Ko de JPEG deviennent ainsi quelques
// kilo-octets de WebP à la taille exacte d'affichage.

import type { ImageMetadata } from 'astro';
import christopheSimeon from '../assets/images/christophe-simeon.jpg';

export type Coach = {
  id: string;
  firstName: string;
  lastName: string;
  dan: number;
  role: string;
  photo?: ImageMetadata;
  diplomaUrl?: string;
};

export const coaches: Coach[] = [
  { id: 'marc-koeberle', firstName: 'Marc', lastName: 'Koeberle', dan: 7, role: 'Directeur technique' },
  { id: 'franck-koeberle', firstName: 'Franck', lastName: 'Koeberle', dan: 3, role: 'Professeur' },
  { id: 'christophe-simeon', firstName: 'Christophe', lastName: 'Siméon', dan: 2, role: 'Professeur', photo: christopheSimeon },
  { id: 'jean-philippe-bonel', firstName: 'Jean-Philippe', lastName: 'Bonel', dan: 2, role: 'Professeur' },
];
