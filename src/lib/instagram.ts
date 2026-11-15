/**
 * Flux Instagram du club, tel que l'écrit `scripts/sync-instagram.mjs`.
 *
 * Le fichier généré est volontairement hors du dépôt (voir .gitignore) : il
 * change à chaque publication du club et n'a pas sa place dans l'historique.
 * Il peut donc ne pas exister — premier clone, jeton absent — et le site doit
 * alors se construire quand même, sur la carte « Suivez-nous ».
 */

export interface PublicationInstagram {
  id: string;
  permalink: string;
  type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  /** Date ISO 8601. */
  date: string;
  legende: string;
  /** Chemin public de l'image copiée sur le site, ex. `/instagram/178….webp`. */
  image: string;
}

export interface FluxInstagram {
  miseAJour: string | null;
  publications: PublicationInstagram[];
}

const VIDE: FluxInstagram = { miseAJour: null, publications: [] };

const modules = import.meta.glob<unknown>('../data/instagram.generated.json', {
  eager: true,
  import: 'default',
});

/**
 * Ne rend que des publications sûres à afficher. Le fichier est produit par
 * notre script, mais il est lu comme n'importe quelle donnée externe : un
 * lien qui ne mène pas à instagram.com, ou une image hors de /instagram/,
 * est écarté plutôt que rendu.
 */
function valide(p: unknown): p is PublicationInstagram {
  if (typeof p !== 'object' || p === null) return false;
  const x = p as Record<string, unknown>;
  return (
    typeof x.id === 'string' &&
    typeof x.permalink === 'string' &&
    /^https:\/\/(www\.)?instagram\.com\//.test(x.permalink) &&
    typeof x.image === 'string' &&
    /^\/instagram\/[\w-]+\.(webp|jpg)$/.test(x.image) &&
    typeof x.date === 'string' &&
    Number.isFinite(new Date(x.date).getTime()) &&
    typeof x.legende === 'string'
  );
}

export function chargerFlux(): FluxInstagram {
  const brut = Object.values(modules)[0] as Partial<FluxInstagram> | undefined;
  if (!brut || !Array.isArray(brut.publications)) return VIDE;
  return {
    miseAJour: typeof brut.miseAJour === 'string' ? brut.miseAJour : null,
    publications: brut.publications.filter(valide),
  };
}

/** « https://www.instagram.com/jcovigneux/ » → « jcovigneux ». */
export function identifiantCompte(adresse: string): string {
  return new URL(adresse).pathname.replace(/\//g, '');
}

/**
 * Légende prête à afficher sur une vignette : sans les hashtags de fin
 * (ils sont faits pour l'algorithme d'Instagram, pas pour la lecture), sur
 * une seule ligne, tronquée au dernier mot entier.
 */
export function legendeCourte(legende: string, longueurMax = 110): string {
  const texte = legende
    .replace(/(\s*#[\p{L}\p{N}_]+)+\s*$/u, '')
    .replace(/\s+/g, ' ')
    .trim();
  if (texte.length <= longueurMax) return texte;
  const coupe = texte.slice(0, longueurMax);
  const espace = coupe.lastIndexOf(' ');
  return `${coupe.slice(0, espace > 0 ? espace : longueurMax).trimEnd()}…`;
}
