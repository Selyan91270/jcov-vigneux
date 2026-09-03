import { coaches } from './coaches.ts';

export const club = {
  name: 'Judo Club Olympique de Vigneux',
  shortName: 'JCOV',
  foundedYear: 1968,
  // Coordonnées de l'affiche officielle de la saison 2026-2027.
  email: 'judoclubolympiquevigneux@outlook.com',
  phone: '06 81 30 86 56',
  // Adresse du lieu de pratique. `building` situe le dojo dans le complexe
  // municipal : c'est le nom qu'on lit sur place et sur l'affiche du club,
  // alors que le nom du dojo seul ne suffit pas à le trouver.
  address: {
    venue: 'Dojo Marc Alexandre',
    building: 'Complexe sportif Georges Brassens',
    street: '1 bis rue du Maréchal Leclerc',
    city: '91270 Vigneux-sur-Seine',
  },
  facebook: 'https://www.facebook.com/JCOVigneux',
} as const;

// Informations légales obligatoires (LCEN, art. 6-III). Regroupées ici pour
// que la page « Mentions légales » ne soit qu'une mise en forme.
//
// `headOffice` reprend l'adresse telle qu'elle est déclarée au registre des
// associations : c'est le même lieu que le dojo, mais l'intitulé officiel
// diffère de celui qu'on affiche au public, et une mention légale doit
// citer la déclaration.
export const legal = {
  rna: 'W912003608',
  siren: '399 261 387',
  siret: '399 261 387 00027',
  ape: '93.12Z',
  apeLabel: 'Activités de clubs de sports',
  form: 'Association déclarée (loi du 1er juillet 1901)',
  headOffice: 'Espace Georges Brassens, rue du Maréchal Leclerc, 91270 Vigneux-sur-Seine',
  publicationDirector: 'Selyan Abadou',
  // Le site est un ensemble de fichiers statiques servis par GitHub Pages.
  host: {
    name: 'GitHub, Inc.',
    address: '88 Colin P. Kelly Jr. Street, San Francisco, CA 94107, États-Unis',
    url: 'https://github.com',
  },
} as const;

export const navLinks = [
  { label: 'Accueil', href: '/' },
  { label: 'Le Club', href: '#about' },
  { label: 'Professeurs', href: '/professeurs' },
  { label: 'Horaires', href: '/horaires' },
  { label: 'Événements', href: '/evenements' },
  { label: 'Galerie', href: '/galerie' },
  { label: 'Contact', href: '#contact' },
] as const;

// Trois nombres, pour garder le rythme de la bande de chiffres clés.
// Le nombre de professeurs est dérivé de la liste réelle : il reste juste
// si l'équipe change.
export const stats = [
  { value: `${new Date().getFullYear() - club.foundedYear}`, label: "Années d'histoire" },
  { value: '450+', label: 'Licenciés par an' },
  { value: `${coaches.length}`, label: 'Professeurs diplômés' },
] as const;

// Photos authentiques du club (judokas, entraînements, événements du JCOV).
// À enrichir au fil du temps avec de vraies photos du club.
export const clubPhotos = [
  { key: 'photodegroupe', alt: 'Photo de groupe des judokas du JCOV sur le tatami' },
  { key: 'groupeSanguinet', alt: 'Photo de groupe des judokas du JCOV au Sanguinet Judo Club' },
] as const;
