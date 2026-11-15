/**
 * Liens d'itinéraire vers le dojo.
 *
 * L'adresse était cliquable pour le téléphone et l'e-mail, mais pas pour le
 * lieu lui-même : sur mobile, il fallait la recopier à la main dans une
 * application de cartes.
 *
 * Ce sont de simples liens, pas une carte intégrée : intégrer Google Maps ou
 * OpenStreetMap ferait charger du contenu externe chez chaque visiteur, ce
 * que le site s'interdit désormais (voir la page de confidentialité).
 *
 * Tout est dérivé de l'adresse du club : si elle change dans `club.ts`, les
 * liens suivent. On passe l'adresse en toutes lettres plutôt que des
 * coordonnées GPS, que personne n'a relevées — une position approximative
 * enverrait les visiteurs au mauvais endroit.
 */
import { club } from '../data/club.ts';

const destination = [
  club.address.venue,
  club.address.building,
  club.address.street,
  club.address.city,
].join(', ');

const q = encodeURIComponent(destination);

export const itineraires = [
  {
    nom: 'Google Maps',
    adresse: `https://www.google.com/maps/dir/?api=1&destination=${q}`,
  },
  {
    nom: 'Waze',
    adresse: `https://www.waze.com/ul?q=${q}&navigate=yes`,
  },
  {
    // « Plans » est le nom français de l'application Apple.
    nom: 'Plans',
    adresse: `https://maps.apple.com/directions?mode=driving&destination=${q}`,
  },
] as const;

/** Lien principal, pour les endroits où un seul tient. */
export const itineraire = itineraires[0].adresse;
