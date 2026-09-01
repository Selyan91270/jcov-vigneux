import { coaches } from './coaches.ts';

export const club = {
  name: 'Judo Club Olympique de Vigneux',
  shortName: 'JCOV',
  foundedYear: 1968,
  email: 'jcov@free.fr',
  phone: '01 69 03 22 40',
  address: {
    venue: 'Dojo Marc Alexandre',
    street: '1 bis rue du Maréchal Leclerc',
    city: '91270 Vigneux-sur-Seine',
  },
  facebook: 'https://www.facebook.com/JCOVigneux',
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
