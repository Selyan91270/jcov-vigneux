export const club = {
  name: 'Judo Club Olympique de Vigneux',
  shortName: 'JCOV',
  foundedYear: 1989,
  email: 'jcov@free.fr',
  phone: '01 69 03 22 40',
  address: {
    venue: 'Dojo Marc Alexandre',
    street: '1 bis rue du Maréchal Leclerc',
    city: '91270 Vigneux-sur-Seine',
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

export const stats = [
  { value: `${new Date().getFullYear() - club.foundedYear}+`, label: "Années d'existence" },
  { value: '450+', label: 'Licenciés par an' },
  { value: 'Encadrement', label: 'Diplômé' },
] as const;

// Photos authentiques du club (judokas, entraînements, événements du JCOV).
// À enrichir au fil du temps avec de vraies photos du club.
export const clubPhotos = [
  { key: 'photodegroupe', alt: 'Photo de groupe des judokas du JCOV sur le tatami' },
  { key: 'groupeSanguinet', alt: 'Photo de groupe des judokas du JCOV au Sanguinet Judo Club' },
] as const;
