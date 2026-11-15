/**
 * Extrait de présentation d'une actualité.
 *
 * Les cartes affichaient l'article entier : 764 px de haut chacune, et une
 * grille irrégulière puisque les textes vont du simple au triple. Une carte
 * annonce, elle ne raconte pas — l'article a désormais sa propre page.
 *
 * Le résumé est dérivé du premier paragraphe plutôt que saisi à la main :
 * une actualité publiée demain n'aura rien à renseigner de plus, et le
 * résumé ne pourra jamais contredire le texte.
 */

const LONGUEUR_MAX = 165;

/** Un paragraphe Markdown ramené à du texte brut sur une ligne. */
function enTexte(paragraphe: string): string {
  return paragraphe
    .replace(/\r?\n/g, ' ')
    // Balisage Markdown : gras, italique, liens, titres.
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/^#+\s*/, '')
    .trim();
}

/** Coupe au dernier mot entier pour ne pas trancher au milieu d'un mot. */
function tronquer(texte: string, longueurMax: number): string {
  if (texte.length <= longueurMax) return texte;
  const coupe = texte.slice(0, longueurMax);
  const dernierEspace = coupe.lastIndexOf(' ');
  return `${coupe.slice(0, dernierEspace > 0 ? dernierEspace : longueurMax).trimEnd()}…`;
}

const paragraphes = (markdown: string) => markdown.trim().split(/\r?\n\s*\r?\n/);

export function excerpt(markdown: string, longueurMax = LONGUEUR_MAX): string {
  const premier = enTexte(paragraphes(markdown)[0] ?? '');
  return tronquer(premier, longueurMax);
}

/**
 * Description destinée aux moteurs de recherche (balise meta).
 *
 * L'extrait d'une carte se contente du premier paragraphe, ce qui donnait
 * des descriptions de 60 caractères quand une actualité s'ouvre sur une
 * phrase courte : Google, jugeant cela trop pauvre, la remplace alors par un
 * passage de son choix. On complète donc avec les paragraphes suivants,
 * jusqu'à une longueur utile.
 */
export function resume(markdown: string, longueurMax = 155, longueurUtile = 110): string {
  let texte = '';
  for (const paragraphe of paragraphes(markdown)) {
    const suite = enTexte(paragraphe);
    if (!suite) continue;
    texte = texte ? `${texte} ${suite}` : suite;
    if (texte.length >= longueurUtile) break;
  }
  return tronquer(texte, longueurMax);
}
