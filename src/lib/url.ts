/**
 * Construit un lien interne en tenant compte du sous-dossier de publication
 * et de la forme exacte sous laquelle l'hébergeur sert les pages.
 *
 * Le site vit à la racine avec un domaine personnalisé, mais dans un
 * sous-dossier sur GitHub Pages (`user.github.io/nom-du-depot/`). Écrire
 * `href="/horaires"` en dur y mènerait vers une page inexistante.
 *
 * La barre finale n'est pas cosmétique : chaque page est publiée comme
 * `horaires/index.html` et n'existe donc qu'à l'adresse `/horaires/`.
 * Un lien vers `/horaires` provoque une redirection 301 — invisible pour un
 * visiteur, mais coûteuse pour un robot d'indexation, qui doit faire deux
 * requêtes par lien et voit deux adresses pour une seule page. C'est
 * exactement le « gaspillage d'exploration » que Bing sanctionne, et ça
 * désaccordait nos liens du plan du site et des balises canoniques, qui
 * portent la barre finale.
 *
 * Les fichiers en sont exclus : `/favicon.ico/` n'existe pas.
 *
 *   url('/horaires')     → '/horaires/'
 *   url('/#contact')     → '/#contact'
 *   url('#about')        → '#about'      (ancre de la page courante)
 *   url('/favicon.ico')  → '/favicon.ico'
 */
export function url(path: string): string {
  if (path.startsWith('#')) return path;

  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return `${base}${withTrailingSlash(path)}`;
}

function withTrailingSlash(path: string): string {
  // L'ancre et la chaîne de requête se replacent après la barre finale.
  const separateur = path.search(/[#?]/);
  const chemin = separateur === -1 ? path : path.slice(0, separateur);
  const suffixe = separateur === -1 ? '' : path.slice(separateur);

  const estRacine = chemin === '' || chemin === '/';
  const estFichier = /\.[a-z0-9]+$/i.test(chemin);
  const dejaTermine = chemin.endsWith('/');

  if (estRacine || estFichier || dejaTermine) return path;
  return `${chemin}/${suffixe}`;
}
