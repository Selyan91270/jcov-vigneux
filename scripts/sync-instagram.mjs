#!/usr/bin/env node
/**
 * Récupère les dernières publications Instagram du club pour les afficher
 * sur l'accueil.
 *
 * Ni l'une ni l'autre des deux sources ne fait de scraping : la collecte
 * automatisée hors API est interdite par les conditions d'Instagram, ses
 * serveurs bloquent les adresses de centres de données — dont celles de
 * GitHub Actions — et la page publique n'est qu'une coquille JavaScript vide.
 * Les deux sources s'appuient donc sur l'accès autorisé par le titulaire du
 * compte :
 *
 *   • INSTAGRAM_FEED_URL — l'adresse JSON d'un flux Behold (feeds.behold.so).
 *     Behold se connecte au compte, renouvelle lui-même les autorisations et
 *     publie les dernières publications ; il n'y a aucun jeton à surveiller.
 *     Prioritaire si elle est renseignée.
 *   • INSTAGRAM_TOKEN — un jeton de l'API officielle d'Instagram (« Instagram
 *     API with Instagram Login »), valable 60 jours.
 *
 * Ce que fait le script :
 *   1. lit la source dans l'environnement (jamais écrite dans un fichier,
 *      jamais affichée) ;
 *   2. demande les publications les plus récentes ;
 *   3. télécharge chaque image, la recadre en carré et la convertit en WebP
 *      dans public/instagram/ — le site ne contacte donc jamais Instagram ni
 *      Behold à l'affichage, et les liens d'image, qui expirent, ne cassent
 *      rien ;
 *   4. écrit src/data/instagram.generated.json, que l'accueil lit ;
 *   5. supprime les images des publications qui ne sont plus au flux : si le
 *      club retire un post, il disparaît du site à la synchronisation
 *      suivante.
 *
 * Il ne fait JAMAIS échouer la publication du site : sans source, ou si
 * elle répond par une erreur, il le signale et laisse en place le flux
 * précédent.
 *
 * Usage local :
 *   $env:INSTAGRAM_FEED_URL = "https://feeds.behold.so/…" ; npm run instagram   (PowerShell)
 *   INSTAGRAM_TOKEN="…" npm run instagram                                        (bash)
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
const ADRESSE_FLUX = process.env.INSTAGRAM_FEED_URL?.trim();

const PUBLICATIONS_MAX = 6;
const TAILLE_IMAGE = 720;
const POIDS_IMAGE_MAX = 15 * 1024 * 1024;
const JOURS_AVANT_AVERTISSEMENT = 14;

/** Efface jetons et adresse du flux de tout texte destiné à un journal public. */
function masquer(texte) {
  let propre = String(texte);
  if (JETON) propre = propre.split(JETON).join('[jeton masqué]');
  if (ADRESSE_FLUX) propre = propre.split(ADRESSE_FLUX).join('[adresse du flux]');
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

/** Une publication, quelle que soit la source, dans une forme unique. */
function normaliser({ id, permalink, type, horodatage, legende, image }) {
  return {
    id: String(id ?? ''),
    permalink,
    type: ['VIDEO', 'CAROUSEL_ALBUM'].includes(type) ? type : 'IMAGE',
    horodatage,
    legende: typeof legende === 'string' ? legende : '',
    image,
  };
}

/**
 * Une publication n'est retenue que si on sait la montrer : image présente,
 * identifiant sans caractère spécial (il sert de nom de fichier), lien vers
 * instagram.com, date lisible.
 */
function exploitable(p) {
  return (
    /^[\w-]{1,40}$/.test(p.id) &&
    typeof p.image === 'string' &&
    /^https?:\/\//.test(p.image) &&
    typeof p.permalink === 'string' &&
    /^https:\/\/(www\.)?instagram\.com\//.test(p.permalink) &&
    Number.isFinite(new Date(corrigerHorodatage(p.horodatage)).getTime())
  );
}

/** L'API officielle renvoie « +0000 » sans deux-points, que certains navigateurs refusent. */
const corrigerHorodatage = (h) => String(h).replace(/([+-]\d{2})(\d{2})$/, '$1:$2');
const versIso = (h) => new Date(corrigerHorodatage(h)).toISOString();

// ── Source 1 : flux Behold ──────────────────────────────────────────────────

/** Seules les adresses de Behold sont acceptées — et la machine locale, pour les essais. */
function adresseFluxAutorisee(adresse) {
  try {
    const u = new URL(adresse);
    return (
      (u.protocol === 'https:' && u.hostname === 'feeds.behold.so') ||
      (u.protocol === 'http:' && ['127.0.0.1', 'localhost'].includes(u.hostname))
    );
  } catch {
    return false;
  }
}

async function depuisFluxBehold() {
  if (!adresseFluxAutorisee(ADRESSE_FLUX)) {
    throw new Error("INSTAGRAM_FEED_URL doit être une adresse https://feeds.behold.so/…");
  }
  const flux = await appeler(ADRESSE_FLUX);
  if (!Array.isArray(flux.posts)) throw new Error("réponse du flux inattendue : pas de liste « posts »");

  return flux.posts.map((p) =>
    normaliser({
      id: p.id,
      permalink: p.permalink,
      type: p.mediaType,
      horodatage: p.timestamp,
      legende: p.caption,
      // Behold publie des versions déjà optimisées ; pour une vidéo, l'image
      // est sa vignette, jamais le fichier vidéo.
      image:
        p.sizes?.large?.mediaUrl ??
        p.sizes?.medium?.mediaUrl ??
        (p.mediaType === 'VIDEO' ? p.thumbnailUrl : p.mediaUrl),
    }),
  );
}

// ── Source 2 : API officielle d'Instagram ───────────────────────────────────

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

async function depuisApiOfficielle() {
  await renouvelerJeton();
  const champs = 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp';
  const r = await appeler(
    `${API}/me/media?fields=${champs}&limit=20&access_token=${encodeURIComponent(JETON)}`,
  );
  const brutes = Array.isArray(r.data) ? r.data : [];
  return brutes.map((p) =>
    normaliser({
      // L'API officielle ne produit que des identifiants numériques : tout
      // autre aspect est un signe de réponse anormale, on l'écarte.
      id: /^\d+$/.test(String(p.id)) ? p.id : '',
      permalink: p.permalink,
      type: p.media_type,
      horodatage: p.timestamp,
      legende: p.caption,
      image: p.media_type === 'VIDEO' ? p.thumbnail_url : p.media_url,
    }),
  );
}

// ── Images ──────────────────────────────────────────────────────────────────

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

// ── Déroulement ─────────────────────────────────────────────────────────────

async function principal() {
  let source;
  let brutes;
  if (ADRESSE_FLUX) {
    source = 'flux Behold';
    brutes = await depuisFluxBehold();
  } else if (JETON) {
    source = 'API officielle Instagram';
    brutes = await depuisApiOfficielle();
  } else {
    info('Ni INSTAGRAM_FEED_URL ni INSTAGRAM_TOKEN : le flux Instagram n\'est pas mis à jour.');
    return;
  }

  // Les plus récentes d'abord, quel que soit l'ordre de la source.
  const candidates = brutes
    .filter(exploitable)
    .sort((a, b) => new Date(corrigerHorodatage(b.horodatage)) - new Date(corrigerHorodatage(a.horodatage)));
  info(`Source : ${source}. ${brutes.length} publication(s) reçue(s), ${candidates.length} exploitable(s).`);

  await mkdir(DOSSIER_IMAGES, { recursive: true });

  // On parcourt les candidates jusqu'à en avoir assez : si l'image de l'une
  // d'elles est introuvable, la suivante prend sa place au lieu de laisser
  // un trou dans la grille.
  const publications = [];
  for (const p of candidates) {
    if (publications.length >= PUBLICATIONS_MAX) break;
    try {
      const { octets, extension } = await preparerImage(await telechargerImage(p.image));
      await writeFile(`${DOSSIER_IMAGES}/${p.id}.${extension}`, octets);
      publications.push({
        id: p.id,
        permalink: p.permalink,
        type: p.type,
        date: versIso(p.horodatage),
        legende: p.legende,
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
  // Jeton expiré, panne d'Instagram ou de Behold, réseau coupé… Le flux
  // précédent reste en place et le site se publie normalement.
  avertir(`Synchronisation Instagram impossible, flux conservé : ${e.message}`);
}
