// Données structurées schema.org.
//
// Elles décrivent le club dans un format que les moteurs lisent directement :
// nom, adresse, téléphone, horaires réels de chaque cours. C'est ce qui
// permet à une recherche « judo vigneux » d'afficher le club avec son adresse
// et ses horaires plutôt qu'un simple lien bleu.
//
// Tout est dérivé des données déjà saisies ailleurs. Rien n'est écrit deux
// fois, donc rien ne peut se désynchroniser de ce que le site affiche : le
// jour où un créneau change dans schedule.ts, il change ici aussi.

import { club } from '../data/club.ts';
import { ageGroups, complementaryCourses } from '../data/schedule.ts';

const JOURS: Record<string, string> = {
  Lundi: 'Monday',
  Mardi: 'Tuesday',
  Mercredi: 'Wednesday',
  Jeudi: 'Thursday',
  Vendredi: 'Friday',
  Samedi: 'Saturday',
  Dimanche: 'Sunday',
};

/** « 18h15 – 19h15 » → ['18:15', '19:15'], le format attendu par schema.org. */
function creneau(plage: string): [string, string] | null {
  const heures = plage.match(/\d{1,2}h\d{2}/g);
  if (!heures || heures.length < 2) return null;
  const [debut, fin] = heures.slice(0, 2).map((h) => h.replace('h', ':').padStart(5, '0'));
  return [debut, fin];
}

/**
 * Un créneau par jour et par horaire. Plusieurs groupes d'âge partagent le
 * même créneau (le mardi 18h15 par exemple) : sans dédoublonnage, le même
 * horaire serait déclaré trois fois.
 */
function horaires() {
  // Les cours complémentaires sont figés en lecture seule : on en prend une
  // copie, sans quoi `flatMap` ne sait pas quel type produire.
  const seances: { day: string; time: string }[] = [
    ...ageGroups.flatMap((groupe) => groupe.sessions),
    ...complementaryCourses.flatMap((cours) => [...cours.sessions]),
  ];

  const vus = new Set<string>();
  const specifications = [];

  for (const seance of seances) {
    const jour = JOURS[seance.day];
    const plage = creneau(seance.time);
    if (!jour || !plage) continue;

    const cle = `${jour}-${plage[0]}-${plage[1]}`;
    if (vus.has(cle)) continue;
    vus.add(cle);

    specifications.push({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: `https://schema.org/${jour}`,
      opens: plage[0],
      closes: plage[1],
    });
  }

  return specifications;
}

/** Le numéro au format international, seul accepté par schema.org. */
function telephoneInternational() {
  return `+33${club.phone.replace(/\D/g, '').replace(/^0/, '')}`;
}

/**
 * Fiche du club. `logo` et `image` doivent être des adresses absolues :
 * les moteurs les consultent hors du contexte de la page.
 */
export function ficheClub({ site, logo, image }: { site: URL; logo: string; image: string }) {
  const adressePostale = [club.address.building, club.address.street, club.address.city].join(', ');

  return {
    '@context': 'https://schema.org',
    '@type': 'SportsClub',
    name: club.name,
    alternateName: club.shortName,
    description:
      `Club de judo à Vigneux-sur-Seine depuis ${club.foundedYear}. Cours enfants, ` +
      `adolescents et adultes dès 4 ans, encadrés par des professeurs diplômés d'État.`,
    sport: 'Judo',
    foundingDate: String(club.foundedYear),
    url: site.href,
    logo,
    image,
    telephone: telephoneInternational(),
    email: club.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: `${club.address.building}, ${club.address.street}`,
      addressLocality: 'Vigneux-sur-Seine',
      postalCode: '91270',
      addressRegion: 'Essonne',
      addressCountry: 'FR',
    },
    // Pas de coordonnées GPS : je ne les ai pas relevées, et une position
    // approximative serait pire que pas de position du tout.
    hasMap: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(adressePostale)}`,
    areaServed: {
      '@type': 'City',
      name: 'Vigneux-sur-Seine',
    },
    sameAs: [club.facebook, club.instagram],
    openingHoursSpecification: horaires(),
  };
}

/**
 * Fiche schema.org d'une actualité. Elle permet aux moteurs de présenter
 * l'article avec sa date et son image, et de le rattacher au club qui le
 * publie. Comme pour la fiche du club, tout vient des données de l'article :
 * rien n'est saisi une seconde fois.
 *
 * `dateModified` est volontairement omis : le contenu des actualités n'a pas
 * de date de révision, et la remplacer par celle de publication la ferait
 * passer pour une mise à jour qui n'a jamais eu lieu.
 */
export function ficheActualite({
  adresse,
  site,
  titre,
  description,
  date,
  image,
  logo,
}: {
  adresse: URL;
  site: URL;
  titre: string;
  description: string;
  date: Date;
  image: string;
  logo: string;
}) {
  const editeur = { '@type': 'Organization', name: club.name, url: site.href };
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    // Au-delà de 110 caractères, les moteurs tronquent ou ignorent le titre.
    headline: titre.length > 110 ? `${titre.slice(0, 109).trimEnd()}…` : titre,
    description,
    datePublished: date.toISOString(),
    image: [image],
    inLanguage: 'fr-FR',
    mainEntityOfPage: { '@type': 'WebPage', '@id': adresse.href },
    author: editeur,
    publisher: { ...editeur, logo: { '@type': 'ImageObject', url: logo } },
  };
}
