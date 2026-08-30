# Site vitrine — JCOV (Judo Club Olympique de Vigneux)

Site vitrine statique du JCOV : présentation du club, horaires, galerie photo, code moral du judo, actualités du club et actualités fédérales (France Judo).

Ce site **ne gère pas** les adhérents, les cours, les présences ou les paiements : l'inscription et la gestion des licenciés se font sur la plateforme tierce [monclub.app](https://aspttnancy.monclub.app/login), vers laquelle le site renvoie (bouton « Rejoindre le club »).

## Stack technique

- [Astro 6](https://astro.build) — génération de site statique
- [Tailwind CSS 4](https://tailwindcss.com)
- [Cheerio](https://cheerio.js.org) — extraction des actualités France Judo (voir `src/services/ffjudoNews.ts`)

## Commandes

| Commande | Action |
| --- | --- |
| `npm install` | Installe les dépendances |
| `npm run dev` | Lance le serveur de développement sur `localhost:4321` |
| `npm run build` | Génère le site de production dans `./dist/` |
| `npm run preview` | Prévisualise le build de production en local |

## Structure du projet

```
src/
├── assets/images/     # Images sources, optimisées automatiquement par Astro (<Image>)
├── components/        # Navbar, Hero, Stats, MoralCode, Footer, FranceJudoNews...
├── content/
│   └── actualites/     # Actualités du club (voir "Ajouter une actualité" ci-dessous)
├── data/               # Contenu éditable : club.ts (horaires, contact, galerie), images.ts
├── layouts/            # Layout principal (MainLayout.astro)
├── pages/              # Routes du site (index, galerie, mentions-legales, confidentialite, 404)
├── services/           # Récupération des actualités France Judo (scraping + cache 1h)
└── styles/global.css   # Palette de couleurs, styles globaux, animations au scroll
```

## Ajouter une actualité du club

Créer un fichier `.md` dans `src/content/actualites/`, par exemple `src/content/actualites/mon-actu.md` :

```markdown
---
title: "Titre de l'actualité"
date: 2026-09-01
badge: "Résultat"
badgeColor: "blue" # "gold" pour une distinction (ex. passage de ceinture noire)
image: "./mon-image.png"
imageAlt: "Description de l'image pour l'accessibilité"
---

Le texte de l'actualité, en Markdown.
```

Placer l'image (`mon-image.png`) dans le même dossier. L'actualité apparaît automatiquement sur la page d'accueil, triée par date décroissante — aucune autre modification de code n'est nécessaire. Le champ `badgeColor` est facultatif (par défaut `blue`).

## Modifier les horaires, la galerie ou les coordonnées

Tout se trouve dans `src/data/club.ts` :
- `schedules` — horaires d'entraînement
- `clubPhotos` — vraies photos du club (à enrichir au fil du temps)
- `judoUniversePhotos` — photos d'illustration (compétitions, ambiance judo), clairement distinguées des photos du club
- `stats` — chiffres clés affichés sous le hero

Pour ajouter une image, la déposer dans `src/assets/images/`, l'importer dans `src/data/images.ts`, puis référencer sa clé dans `club.ts`.

## Avant mise en production

- Remplacer le domaine placeholder `https://jcov-vigneux.fr` dans `astro.config.mjs` (champ `site`) et `public/robots.txt` par le vrai nom de domaine.
- Compléter les informations manquantes dans `src/pages/mentions-legales.astro` (numéro RNA/SIRET de l'association, directeur de publication, hébergeur).
- Remplacer progressivement les photos d'illustration (`judoUniversePhotos`) par de vraies photos du club à mesure qu'elles sont disponibles.
