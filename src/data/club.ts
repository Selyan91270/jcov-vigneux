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

// Photos d'illustration (compétitions internationales, ambiance du judo).
// Ce ne sont pas des photos du club — utilisées en attendant davantage de photos maison.
export const judoUniversePhotos = [
  { key: 'gallery1', alt: 'Champion olympique de judo, bras levé en signe de victoire' },
  { key: 'gallery2', alt: 'Combat de judo, saisie au judogi lors d\'une compétition' },
  { key: 'gallery3', alt: 'Projection de judo lors d\'une compétition internationale' },
  { key: 'aboutJudoka', alt: 'Projection de judo en noir et blanc' },
] as const;