/**
 * Construit un lien interne en tenant compte du sous-dossier de publication.
 *
 * Le site vit à la racine avec un domaine personnalisé, mais dans un
 * sous-dossier sur GitHub Pages (`user.github.io/nom-du-depot/`). Écrire
 * `href="/horaires"` en dur y mènerait vers une page inexistante.
 *
 *   url('/horaires')  → '/horaires'  ou  '/nom-du-depot/horaires'
 *   url('/#contact')  → '/#contact'  ou  '/nom-du-depot/#contact'
 *   url('#about')     → '#about'     (ancre de la page courante, inchangée)
 */
export function url(path: string): string {
  if (path.startsWith('#')) return path;

  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return `${base}${path}`;
}
