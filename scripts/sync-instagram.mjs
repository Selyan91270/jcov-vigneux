#!/usr/bin/env node
/**
 * Récupère les dernières publications Instagram du club pour les afficher
 * sur l'accueil.
 *
 * Passe par l'API officielle d'Instagram (« Instagram API with Instagram
 * Login ») et non par du scraping : la collecte automatisée hors API est
 * interdite par les conditions d'Instagram, ses serveurs bloquent les
 * adresses de centres de données — dont celles de GitHub Actions — et la
 * page publique change de structure sans préavis. L'API, elle, est stable.
 *
 * Ce que fait le script :
 *   1. lit le jeton dans INSTAGRAM_TOKEN (jamais écrit dans un fichier,
 *      jamais affiché) ;
 *   2. demande les publications les plus récentes ;
 *   3. télécharge chaque image, la recadre en carré et la convertit en WebP
 *      dans public/instagram/ — le site ne contacte donc jamais Instagram à
 *      l'affichage, et les liens d'image d'Instagram, qui expirent, ne
 *      cassent rien ;
 *   4. écrit src/data/instagram.generated.json, que l'accueil lit ;
 *   5. supprime les images des publications qui ne sont plus au flux : si le
 *      club retire un post, il disparaît du site à la synchronisation
 *      suivante.
 *
 * Il ne fait JAMAIS échouer la publication du site : sans jeton, ou si
 * Instagram répond par une erreur, il le signale et laisse en place le flux
 * précédent.
 *
 * Usage local :
 *   $env:INSTAGRAM_TOKEN = "…" ; npm run instagram        (PowerShell)
 *   INSTAGRAM_TOKEN="…" npm run instagram                  (bash)
 */

import { mkdir, readdir, rm, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const RACINE = fileURLToPath(new URL('..', import.meta.url));
const DOSSIER_IMAGES = `${RACINE}public/instagram`;
const FICHIER_FLUX = `${RACINE}src/data/instagram.generated.json`;

// `INSTAGRAM_API_BASE` ne sert qu'aux essais : il permet de brancher le
// script sur un faux serveur sans toucher au vrai compte.
const API = (process.env.INSTAGRAM_API_BASE ?? 'https://graph.instagram.com').replace(/\/$/, '');
const JETON = process.env.INSTAGRAM_TOKEN?.trim();

const PUBLICATIONS_MAX = 6;
const TAILLE_IMAGE = 720;
const POIDS_IMAGE_MAX = 15 * 1024 * 1024;
const JOURS_AVANT_AVERTISSEMENT = 14;

/** Efface le jeton de tout texte destiné à un journal public. */
function masquer(texte) {
  let propre = String(texte);
  if (JETON) propre = propre.split(JETON).join('[jeton masqué]');
  return propre.replace(/(access_token=)[^&\s"']+/gi, '$1[jeton masqué]');
}

const info = (message) => console.log(masquer(message));

/** Annotation visible dans l'onglet « Actions » de GitHub, sans faire échouer le travail. */
const avertir = (message) => console.log(`::warning title=Instagram::${masquer(message)}`);

async function appeler(adresse) {
  const reponse = await fetch(adresse, { signal: AbortSignal.timeout(20_000) });
  const corps = await reponse.json().catch(() => ({}));
  if (!reponse.ok) {
    const detail = corps?.error?.message ?? `HTTP ${reponse.status}`;
    const erreur = new Error(detail);
    erreur.statut = reponse.status;
    throw erreur;
  }
  return corps;
}

/**
 * Prolonge la validité du jeton (60 jours à chaque renouvellement) et
 * prévient s'il approche de son terme. Un échec ici n'empêche pas la suite :
 * le jeton peut rester valable.
 */
async function renouvelerJeton() {
  try {
    const r = await appeler(
      `${API}/refresh_access_token?grant_type=ig_refresh_token&access_token=${encodeURIComponent(JETON)}`,
    );
    if (typeof r.expires_in === 'number') {
      const jours = Math.floor(r.expires_in / 86_400);
      info(`Jeton Instagram valable encore ${jours} jours.`);
      if (jours < JOURS_AVANT_AVERTISSEMENT) {
        avertir(`Le jeton Instagram expire dans ${jours} jours : pensez à en générer un nouveau.`);
      }
    }
  } catch (e) {
    info(`Renouvellement du jeton ignoré (${e.message}).`);
  }
}

async function listerPublications() {
  const champs = 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp';
  const r = await appeler(
    `${API}/me/media?fields=${champs}&limit=20&access_token=${encodeURIComponent(JETON)}`,
  );
  return Array.isArray(r.data) ? r.data : [];
}

/**
 * Une publication n'est retenue que si on sait la montrer : image présente,
 * identifiant numérique (il sert de nom de fichier), lien vers instagram.com.
 */
function exploitable(p) {
  const image = p.media_type === 'VIDEO' ? p.thumbnail_url : p.media_url;
  return (
    /^\d+$/.test(String(p.id)) &&
    typeof image === 'string' &&
    image.startsWith('http') &&
    typeof p.permalink === 'string' &&
    /^https:\/\/(www\.)?instagram\.com\//.test(p.permalink)
  );
}

async function telechargerImage(adresse) {
  const reponse = await fetch(adresse, { signal: AbortSignal.timeout(30_000) });
  if (!reponse.ok) throw new Error(`image HTTP ${reponse.status}`);
  const type = reponse.headers.get('content-type') ?? '';
  if (!type.startsWith('image/')) throw new Error(`type inattendu « ${type} »`);
  const octets = Buffer.from(await reponse.arrayBuffer());
  if (octets.length > POIDS_IMAGE_MAX) throw new Error('image trop lourde');
  return octets;
}

/** Carré recadré en WebP ; sans `sharp`, l'image d'origine est conservée telle quelle. */
async function preparerImage(octets) {
  try {
    const { default: sharp } = await import('sharp');
    const sortie = await sharp(octets)
      .rotate() // applique l'orientation, puis les métadonnées EXIF sont abandonnées
      .resize(TAILLE_IMAGE, TAILLE_IMAGE, { fit: 'cover', position: 'attention' })
      .webp({ quality: 78 })
      .toBuffer();
    return { octets: sortie, extension: 'webp' };
  } catch {
    return { octets, extension: 'jpg' };
  }
}

/** L'API renvoie « +0000 » sans deux-points, que certains navigateurs refusent. */
const versIso = (horodatage) => new Date(String(horodatage).replace(/([+-]\d{2})(\d{2})$/, '$1:$2')).toISOString();

async function nettoyer(identifiantsGardes) {
  let fichiers = [];
  try {
    fichiers = await readdir(DOSSIER_IMAGES);
  } catch {
    return;
  }
  for (const f of fichiers) {
    if (!identifiantsGardes.has(f.replace(/\.[a-z]+$/, ''))) {
      await rm(`${DOSSIER_IMAGES}/${f}`, { force: true });
      info(`Image retirée : ${f}`);
    }
  }
}

async function principal() {
  if (!JETON) {
    info("INSTAGRAM_TOKEN absent : le flux Instagram n'est pas mis à jour.");
    return;
  }

  await renouvelerJeton();

  const brutes = await listerPublications();
  const candidates = brutes.filter(exploitable);
  info(`${brutes.length} publication(s) reçue(s), ${candidates.length} exploitable(s).`);

  await mkdir(DOSSIER_IMAGES, { recursive: true });

  // On parcourt les candidates jusqu'à en avoir assez : si l'image de l'une
  // d'elles est introuvable, la suivante prend sa place au lieu de laisser
  // un trou dans la grille.
  const publications = [];
  for (const p of candidates) {
    if (publications.length >= PUBLICATIONS_MAX) break;
    try {
      const source = p.media_type === 'VIDEO' ? p.thumbnail_url : p.media_url;
      const { octets, extension } = await preparerImage(await telechargerImage(source));
      await writeFile(`${DOSSIER_IMAGES}/${p.id}.${extension}`, octets);
      publications.push({
        id: String(p.id),
        permalink: p.permalink,
        type: p.media_type,
        date: versIso(p.timestamp),
        legende: typeof p.caption === 'string' ? p.caption : '',
        image: `/instagram/${p.id}.${extension}`,
      });
    } catch (e) {
      info(`Publication ${p.id} ignorée : ${e.message}`);
    }
  }

  await nettoyer(new Set(publications.map((p) => p.id)));

  await writeFile(
    FICHIER_FLUX,
    `${JSON.stringify({ miseAJour: new Date().toISOString(), publications }, null, 2)}\n`,
  );
  info(`Flux écrit : ${publications.length} publication(s).`);
}

try {
  await principal();
} catch (e) {
  // Jeton expiré, panne d'Instagram, réseau coupé… Le flux précédent reste en
  // place et le site se publie normalement.
  avertir(`Synchronisation Instagram impossible, flux conservé : ${e.message}`);
}
