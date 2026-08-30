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
  { label: 'Galerie', href: '/galerie' },
  { label: 'Horaires', href: '#classes' },
  { label: 'Contact', href: '#contact' },
] as const;

export const schedules = [
  { day: 'Lundi', time: '18h30 - 20h30', group: 'Adultes & Avancés' },
  { day: 'Mercredi', time: '17h30 - 19h30', group: 'Enfants & Débutants' },
  { day: 'Vendredi', time: '18h00 - 20h00', group: 'Tous niveaux' },
] as const;

export const stats = [
  { value: `${new Date().getFullYear() - club.foundedYear}+`, label: "Années d'existence" },
  { value: '450+', label: 'Licenciés par an' },
  { value: 'Encadrement', label: 'Diplômé' },
] as const;

export const galleryImages = [
  { src: '/images/gallery-1.jpg', alt: 'Galerie photo 1' },
  { src: '/images/gallery-2.jpg', alt: 'Galerie photo 2' },
  { src: '/images/gallery-3.jpg', alt: 'Galerie photo 3' },
] as const;