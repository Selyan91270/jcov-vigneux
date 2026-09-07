/**
 * Règle d'archivage des événements.
 *
 * Un rendez-vous ne bascule pas en « passé » au coup de minuit : il reste
 * annoncé trois jours de plus. Quelqu'un qui découvre le club le lendemain
 * d'un forum doit encore voir qu'il a eu lieu, et un cours de reprise reste
 * une information utile les jours qui suivent — c'est même le moment où l'on
 * cherche le club après en avoir entendu parler.
 *
 * La règle vit ici et nulle part ailleurs : elle est appliquée à la
 * construction du site (tri initial) et rejouée dans le navigateur (qui,
 * lui, connaît la date du jour). Deux copies finiraient par diverger, et
 * l'écart ne se verrait qu'un jour précis, des semaines plus tard.
 */

export const JOURS_DE_GRACE = 3;

const MS_PAR_JOUR = 24 * 60 * 60 * 1000;

/**
 * Un événement reste « à venir » jusqu'à la fin de son délai de grâce.
 * Daté du 5, il s'affiche donc les 5, 6 et 7, et s'archive le 8.
 */
export function estAVenir(date: Date | string | number, maintenant: number = Date.now()): boolean {
  const jour = date instanceof Date ? date.getTime() : new Date(date).getTime();
  if (!Number.isFinite(jour)) return false;
  return jour + JOURS_DE_GRACE * MS_PAR_JOUR >= maintenant;
}
