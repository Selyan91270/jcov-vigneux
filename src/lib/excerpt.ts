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

export function excerpt(markdown: string, longueurMax = LONGUEUR_MAX): string {
  const premierParagraphe = markdown
    .trim()
    .split(/\r?\n\s*\r?\n/)[0]
    ?.replace(/\r?\n/g, ' ')
    // Balisage Markdown : gras, italique, liens, titres.
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/^#+\s*/, '')
    .trim();

  if (!premierParagraphe) return '';
  if (premierParagraphe.length <= longueurMax) return premierParagraphe;

  // Coupe au dernier mot entier pour ne pas trancher au milieu d'un mot.
  const tronque = premierParagraphe.slice(0, longueurMax);
  const dernierEspace = tronque.lastIndexOf(' ');
  return `${tronque.slice(0, dernierEspace > 0 ? dernierEspace : longueurMax).trimEnd()}…`;
}
