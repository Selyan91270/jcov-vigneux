/**
 * Date de dernière modification de chaque page, pour le plan du site.
 *
 * Bing demande un `lastmod` fiable : c'est ce qui lui dit quelles pages
 * valent un nouveau passage, et lesquelles n'ont pas bougé. Google l'ignore
 * dès qu'il a constaté qu'il est inexact. La date du jour sur toutes les
 * pages serait donc pire que pas de date du tout.
 *
 * La date d'une page est celle du dernier commit qui touche ses fichiers
 * propres — la page, et les données qu'elle affiche. Une retouche de style
 * partagée ne compte pas : le contenu n'a pas changé.
 *
 * Fichier .mjs et non .ts : il est lu par `astro.config.mjs`, avant que le
 * reste du projet ne soit compilé.
 */
import { execFileSync } from 'node:child_process';

/** Fichiers (ou dossiers) dont la modification change le contenu de la page. */
const DEPENDANCES = {
  '/': [
    'src/pages/index.astro',
    'src/components/Hero.astro',
    'src/components/Stats.astro',
    'src/components/MoralCodeStrip.astro',
    'src/components/InstagramSection.astro',
    'src/data/club.ts',
    'src/content/actualites',
    'src/content/evenements',
  ],
  '/horaires/': ['src/pages/horaires.astro', 'src/data/schedule.ts'],
  '/professeurs/': ['src/pages/professeurs.astro', 'src/data/coaches.ts', 'src/data/committee.ts'],
  '/evenements/': ['src/pages/evenements.astro', 'src/content/evenements'],
  '/galerie/': ['src/pages/galerie.astro', 'src/data/club.ts', 'src/data/images.ts'],
  '/inscription/': ['src/pages/inscription.astro', 'src/data/inscription.ts', 'src/data/schedule.ts'],
  '/code-moral/': ['src/pages/code-moral.astro', 'src/components/MoralCode.astro'],
  '/mentions-legales/': ['src/pages/mentions-legales.astro', 'src/data/club.ts'],
  '/confidentialite/': ['src/pages/confidentialite.astro'],
};

function git(args) {
  try {
    return execFileSync('git', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch {
    return '';
  }
}

/**
 * Sur GitHub Actions, `checkout` ne récupère par défaut que le dernier
 * commit : `git log` répondrait alors la même date pour chaque page. Mieux
 * vaut n'en donner aucune. Le workflow demande l'historique complet
 * (`fetch-depth: 0`) précisément pour cela.
 */
const HISTORIQUE_COMPLET = git(['rev-parse', '--is-shallow-repository']) === 'false';

function fichiersDe(chemin) {
  if (DEPENDANCES[chemin]) return DEPENDANCES[chemin];
  // Une actualité = son fichier Markdown.
  const actualite = chemin.match(/^\/actualites\/([^/]+)\/$/);
  if (actualite) return [`src/content/actualites/${actualite[1]}.md`];
  return [];
}

/** « /horaires/ » → « 2026-11-15T19:42:10+01:00 », ou undefined si on ne sait pas. */
export function dateModification(chemin) {
  if (!HISTORIQUE_COMPLET) return undefined;
  const fichiers = fichiersDe(chemin);
  if (fichiers.length === 0) return undefined;
  const date = git(['log', '-1', '--format=%cI', '--', ...fichiers]);
  return date ? new Date(date).toISOString() : undefined;
}
