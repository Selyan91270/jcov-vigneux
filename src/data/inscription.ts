// Fiche d'inscription à télécharger.
//
// Le fichier vit dans public/ : il est servi tel quel, sans passer par
// l'optimisation d'Astro. Pour le remplacer, écraser le PDF en gardant le
// même nom — aucun autre changement n'est alors nécessaire.
//
// Laisser `ficheUrl` vide masque le bouton de téléchargement et invite à
// retirer la fiche au club : mieux vaut cela qu'un bouton qui ne mène nulle
// part.
export const inscription = {
  ficheUrl: '/fiche-inscription-jcov.pdf',
  ficheInfo: 'PDF · 86 Ko',
};
