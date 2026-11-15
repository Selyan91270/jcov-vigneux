# Site vitrine — JCOV (Judo Club Olympique de Vigneux)

Site vitrine statique du JCOV : présentation du club, horaires et tarifs, professeurs, événements, galerie photo, code moral du judo et actualités du club.

Ce site **ne gère pas** les adhérents, les cours, les présences ou les paiements : l'inscription et la gestion des licenciés se font sur une plateforme tierce vers laquelle le site renvoie (bouton « Rejoindre le club »).

## Stack technique

- [Astro 7](https://astro.build) — génération de site statique
- [Tailwind CSS 4](https://tailwindcss.com)

Aucune base de données, aucun serveur applicatif : le site est un ensemble de fichiers HTML, CSS et images. C'est ce qui permet de l'héberger gratuitement.

## Commandes

| Commande | Action |
| --- | --- |
| `npm install` | Installe les dépendances |
| `npm run dev` | Lance le serveur de développement sur `localhost:4321` |
| `npm run build` | Génère le site de production dans `./dist/` |
| `npm run preview` | Prévisualise le build de production en local |
| `npm run instagram` | Récupère les dernières publications Instagram (voir « Flux Instagram ») |
| `npx astro check` | Vérifie les types et le contenu — lancé aussi à chaque publication |

**Mettre à jour les dépendances.** `astro` et `zod` doivent évoluer **ensemble** : chaque version d'Astro exige une version précise de `zod`, que `package.json` fixe donc exactement. Lancer `npm audit fix` seul laisserait `zod` en retard et produirait des dizaines d'erreurs de types. Après toute mise à jour, vérifier avec `npx astro check` puis `npm run build` avant de publier.

## Structure du projet

```
src/
├── assets/fonts/      # Polices Inter et Oswald, hébergées avec le site
├── assets/images/     # Images sources, optimisées automatiquement par Astro
├── components/        # Navbar, Hero, Stats, MoralCode, Lightbox, Footer...
├── content/
│   ├── actualites/    # Actualités du club (fichiers Markdown)
│   └── evenements/    # Événements du club (fichiers Markdown)
├── data/              # Contenu éditable : club, horaires, professeurs, partenaires
├── layouts/           # Layout principal (MainLayout.astro)
├── pages/             # Routes du site
└── styles/global.css  # Palette, styles globaux, animations
public/
└── favicon.*
```

## Modifier le contenu au quotidien

### Ajouter une actualité

Créer un fichier `.md` dans `src/content/actualites/` :

```markdown
---
title: "Titre de l'actualité"
date: 2026-09-01
badge: "Résultat"
badgeColor: "blue" # "gold" pour une distinction (ex. ceinture noire)
image: "./mon-image.png"
imageAlt: "Description de l'image pour l'accessibilité"
---

Le texte de l'actualité, en Markdown.
```

Placer l'image dans le même dossier. L'actualité apparaît automatiquement sur la page d'accueil, triée par date décroissante.

### Ajouter un événement

Créer un fichier `.md` dans `src/content/evenements/` :

```markdown
---
title: "Nom de l'événement"
date: 2026-09-05
location: "Lieu de l'événement"
category: "Forum"
summary: "Une phrase de présentation."
---

Le détail de l'événement, en Markdown.
```

Les événements passés basculent automatiquement dans « Événements passés ».

### Autres contenus

| Quoi | Où |
| --- | --- |
| Coordonnées, année de fondation, chiffres clés, menu | `src/data/club.ts` |
| Horaires et tarifs | `src/data/schedule.ts` |
| Professeurs (nom, grade, photo, diplôme) | `src/data/coaches.ts` |
| Logos partenaires | `src/data/partners.ts` |
| Photos de la galerie | `src/data/club.ts` + `src/data/images.ts` |

### Flux Instagram

La section « Allez nous suivre là-bas » de l'accueil renvoie vers [@jcovigneux](https://www.instagram.com/jcovigneux/) et, quand une source est branchée, affiche les six dernières publications du compte, mises à jour **automatiquement chaque nuit**.

**Sans rien configurer**, la section existe déjà : elle présente le compte et le bouton. Rien ne casse, rien n'est vide.

Le site ne fait pas de *scraping* : la collecte automatisée hors API est interdite par Instagram, bloquée sur les serveurs de GitHub, et la page publique du compte est une coquille JavaScript vide. Il faut donc que le titulaire du compte **autorise un accès, une seule fois**. Deux façons, au choix (le script `scripts/sync-instagram.mjs` gère les deux) :

**Option A — flux Behold (la plus simple, aucun jeton à surveiller)**

1. Créer un compte sur [behold.so](https://behold.so) et y connecter le compte Instagram du club.
2. Créer un flux **JSON** limité à 6 publications. Laisser vide la liste des domaines autorisés (« domain whitelist »), sinon la récupération depuis GitHub serait refusée.
3. Copier l'adresse du flux (`https://feeds.behold.so/…`).
4. Dans le dépôt GitHub : *Settings → Secrets and variables → Actions → New repository secret*, nom **`INSTAGRAM_FEED_URL`**, valeur : cette adresse.

Behold renouvelle lui-même les autorisations. En contrepartie, le site dépend d'un service tiers et de son offre gratuite (à la date de rédaction : un flux, 6 publications, mise à jour quotidienne, 1 200 vues par mois — le site en consomme une trentaine). À vérifier sur leur page de tarifs.

**Option B — jeton officiel d'Instagram (aucun tiers)**

1. Passer le compte Instagram en **compte professionnel** (gratuit : Paramètres → Type de compte et outils).
2. Sur [developers.facebook.com](https://developers.facebook.com), créer une application, y ajouter le produit **Instagram** (« API avec connexion Instagram »), ajouter le compte du club et **générer un jeton d'accès**.
3. Dans le dépôt GitHub, même emplacement que ci-dessus : secret **`INSTAGRAM_TOKEN`**.

Le jeton dure 60 jours. Le script tente de le renouveler à chaque passage et affiche un avertissement dans l'onglet *Actions* quand il approche de son terme ; si les publications se figent un jour, c'est probablement qu'il a expiré : en générer un nouveau et remplacer le secret.

Les écrans de Meta et de Behold changent souvent : si un libellé diffère, leur documentation fait foi. Si les deux secrets sont renseignés, le flux Behold est prioritaire.

Dans tous les cas :

- **Une panne ne casse jamais le site.** Adresse invalide, jeton expiré, service indisponible : le script le signale (annotation dans l'onglet *Actions*) et le dernier flux valide reste affiché.
- **Une publication supprimée sur Instagram disparaît du site** à la synchronisation suivante, images comprises.
- **Les images sont copiées sur le site** (recadrées en carré, converties en WebP) : le navigateur du visiteur ne contacte ni Instagram ni Behold, sauf s'il clique sur un lien. Le flux n'est pas versionné (`src/data/instagram.generated.json` et `public/instagram/` sont ignorés par Git).
- **Voir le résultat sans attendre la nuit** : *Actions → Déploiement sur GitHub Pages → Run workflow*.
- **Essai en local** : `INSTAGRAM_FEED_URL="…" npm run instagram` (ou `INSTAGRAM_TOKEN`), puis `npm run dev`.

### Typographie et couleurs

Tout est piloté par des **tokens** en tête de `src/styles/global.css` : on n'écrit plus de taille, d'interlettrage, d'interligne ni de gris à la main.

| Besoin | À utiliser |
| --- | --- |
| Taille de texte | `var(--fs-12)` … `var(--fs-26)` (le nombre est la taille en pixels : `--fs-14` = 14 px) |
| Interlettrage des capitales | `--ls-button` (0,04 em), `--ls-label` (0,08), `--ls-eyebrow` (0,14), `--ls-eyebrow-wide` (0,18) ; `--ls-display` pour les grands titres |
| Interligne | `--lh-ui` (1,6) pour l'interface, `--lh-reading` (1,75) pour le texte à lire |
| Couleur de texte | `--ink` (titres), `--text-body`, `--text-soft`, `--text-muted` (le plus clair lisible) |
| Titre principal d'une page | classe `page-title` |
| Titre de section d'une page intérieure | classe `heading-2` ; dans un panneau : `heading-panel` |

Deux règles qui évitent les régressions :

- **`--text-faint` n'est pas pour du texte** : à 2,56:1 de contraste sur blanc, il est illisible pour beaucoup de visiteurs (seuil : 4,5:1). Il sert aux filets et aux pictogrammes.
- Les gris de Tailwind (`text-gray-900`, `bg-gray-50`…) sont redéfinis dans `@theme` sur la même famille que les tokens : les deux s'accordent.

Les polices (Inter, Oswald) sont dans `src/assets/fonts/` ; voir « Sécurité » pour la raison de ce choix.

### Icônes du navigateur

`public/favicon.ico` (16/32/48/64), `public/apple-touch-icon.png` et `public/icon-512.png` sont **générés à partir de `src/assets/images/logo-jcov.png`** : le logo est détouré puis posé sur un carré bleu nuit, pour rester lisible dans un onglet.

Si le logo du club change, régénérez-les avec le script indiqué dans l'historique Git (commit « Remplace le favicon Astro par le logo du club »), plutôt que de les remplacer à la main.

Pour ajouter une image : la déposer dans `src/assets/images/`, l'importer dans `src/data/images.ts`, puis référencer sa clé.

---

# Mise en ligne

Le site est configuré pour **GitHub Pages**, gratuit et sans limite de trafic réaliste pour un club.

## 1. Créer le dépôt et envoyer le code

```bash
git remote add origin https://github.com/<votre-compte>/<nom-du-depot>.git
git push -u origin master
```

## 2. Activer GitHub Pages

Dans le dépôt sur GitHub : **Settings → Pages → Build and deployment → Source : GitHub Actions**.

C'est tout. Le workflow `.github/workflows/deploy.yml` prend le relais : à chaque `git push`, il installe les dépendances, construit le site et le publie. L'adresse s'affiche ensuite dans l'onglet **Actions** puis dans **Settings → Pages**.

Aucune configuration de chemin n'est nécessaire : le workflow récupère l'adresse et le sous-dossier auprès de GitHub et les transmet au build. Le site fonctionne donc aussi bien à la racine (`compte.github.io`) que dans un sous-dossier (`compte.github.io/nom-du-depot/`).

## 3. Nom de domaine

Un `.fr` coûte quelques euros par an chez un bureau d'enregistrement (OVH, Gandi, Infomaniak, Porkbun…). Vérifier le tarif de **renouvellement**, souvent plus élevé que la première année.

Une fois le domaine acheté :

1. Le déclarer dans **Settings → Pages → Custom domain** sur GitHub.
2. Suivre les instructions DNS affichées (enregistrements chez le bureau d'enregistrement).
3. Cocher **Enforce HTTPS** une fois le certificat émis (quelques minutes).

Le site passe alors à la racine du domaine : le workflow s'en aperçoit et ajuste les liens tout seul, il n'y a rien à modifier dans le code.

Le certificat HTTPS est fourni et renouvelé gratuitement par GitHub.

### Changer d'hébergeur plus tard

Le site est du HTML statique : il se déploie tel quel sur Netlify ou Cloudflare Pages en connectant le dépôt, avec `npm run build` pour commande et `dist` pour dossier de publication. Ces hébergeurs acceptent des en-têtes HTTP personnalisés, ce que GitHub Pages ne permet pas : ce serait l'occasion d'obtenir HSTS et la protection contre l'affichage en iframe (voir « Sécurité »).

## Sécurité

Le site est statique : pas de base de données, pas de formulaire, pas d'authentification, aucun secret. La surface d'attaque est donc très réduite.

La politique de sécurité du contenu (CSP) est déclarée dans une balise `<meta>` de `MainLayout.astro`. Elle n'autorise que le site lui-même : ni scripts, ni polices, ni images venus d'ailleurs. Les polices sont hébergées avec le site (`src/assets/fonts/`) pour cette raison, et pour ne pas transmettre l'adresse IP des visiteurs à un tiers.

⚠️ **GitHub Pages n'accepte aucun en-tête HTTP personnalisé.** Deux protections manquent donc, car une balise `<meta>` ne sait pas les porter : **HSTS** (forcer le HTTPS aux visites suivantes) et **`frame-ancestors`** (empêcher l'affichage du site dans la page d'un autre). Pour un site vitrine sans formulaire ni compte utilisateur, l'écart est faible. Sur un hébergeur qui accepte les en-têtes — ou derrière Cloudflare — on les obtiendrait avec :

```
/*
  Strict-Transport-Security: max-age=63072000; includeSubDomains
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
/_astro/*
  Cache-Control: public, max-age=31536000, immutable
```

(Format du fichier `public/_headers` de Netlify et Cloudflare Pages ; l'option `preload` de HSTS est à n'ajouter qu'en connaissance de cause, elle est difficile à retirer.)

⚠️ **Cette CSP interdit les scripts écrits directement dans le HTML.** C'est pourquoi `astro.config.mjs` force les scripts en fichiers externes (`assetsInlineLimit: 0`). Si vous modifiez cette option, les scripts seraient de nouveau intégrés au HTML et **bloqués en production** — menu mobile, visionneuse et animations cesseraient de fonctionner, sans que cela se voie en développement.

Après toute modification de la configuration ou des en-têtes, tester le site **construit** (`npm run build`) et vérifier l'absence d'erreur CSP dans la console du navigateur.
