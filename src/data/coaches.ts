// Équipe encadrante du JCOV.
// photo et diplomaUrl sont facultatifs : tant qu'ils ne sont pas renseignés,
// la page affiche un avatar générique et une mention "à venir".

export type Coach = {
  id: string;
  firstName: string;
  lastName: string;
  dan: number;
  role: string;
  photo?: string;
  diplomaUrl?: string;
};

export const coaches: Coach[] = [
  { id: 'marc-koeberle', firstName: 'Marc', lastName: 'Koeberle', dan: 7, role: 'Directeur technique' },
  { id: 'franck-koeberle', firstName: 'Franck', lastName: 'Koeberle', dan: 3, role: 'Professeur' },
  { id: 'christophe-simeon', firstName: 'Christophe', lastName: 'Siméon', dan: 2, role: 'Professeur' },
  { id: 'jean-philippe-bonel', firstName: 'Jean-Philippe', lastName: 'Bonel', dan: 2, role: 'Professeur' },
];
