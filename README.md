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

## Structure du projet

```
src/
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
├── _headers           # En-têtes de sécurité et de cache (lus par l'hébergeur)
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

Pour ajouter une image : la déposer dans `src/assets/images/`, l'importer dans `src/data/images.ts`, puis référencer sa clé.

---

# Mise en ligne

## 1. Choisir un hébergeur (gratuit)

Le site étant statique, il peut être hébergé gratuitement et sans limite de trafic réaliste pour un club.

| Hébergeur | Offre gratuite | Remarque |
| --- | --- | --- |
| **Cloudflare Pages** *(recommandé)* | Bande passante illimitée | HTTPS et CDN inclus |
| **Netlify** | 100 Go/mois | Le plus simple à prendre en main |
| **GitHub Pages** | 100 Go/mois | Nécessite une configuration supplémentaire |

Les trois lisent le fichier `public/_headers`. `netlify.toml` ne sert qu'à Netlify et est ignoré ailleurs.

**Réglages à indiquer à l'hébergeur :**

- Commande de build : `npm run build`
- Dossier à publier : `dist`
- Version de Node : `22` (déjà fixée dans `.nvmrc` et `netlify.toml`)

## 2. Envoyer le code

L'hébergeur se connecte à un dépôt Git (GitHub, GitLab). Chaque `git push` redéploie le site automatiquement.

```bash
git remote add origin <url-du-depot>
git push -u origin master
```

## 3. Nom de domaine

Un `.fr` coûte quelques euros par an chez un bureau d'enregistrement (OVH, Gandi, Infomaniak, Porkbun…). Vérifier le tarif de **renouvellement**, souvent plus élevé que la première année.

Une fois le domaine acheté :

1. Le déclarer dans l'interface de l'hébergeur (« domaine personnalisé »).
2. Suivre les instructions DNS données par l'hébergeur.
3. **Mettre à jour `SITE_URL` dans `astro.config.mjs`** avec le domaine réel.

C'est le seul endroit à changer : les liens canoniques, le sitemap, `robots.txt` et les aperçus de partage en découlent.

Le certificat HTTPS est fourni et renouvelé gratuitement par l'hébergeur.

## 4. À compléter avant la mise en ligne

- [ ] **Lien d'inscription** — les boutons « Rejoindre le club » pointent vers `aspttnancy.monclub.app`, qui est le club **ASPTT Nancy**. À remplacer par l'adresse réelle du JCOV (6 occurrences, `git grep monclub`).
- [ ] **Coordonnées** — vérifier le téléphone et l'e-mail dans `src/data/club.ts` (l'affiche du club mentionne d'autres coordonnées que celles affichées).
- [ ] **Mentions légales** — compléter les trois champs `[à compléter]` dans `src/pages/mentions-legales.astro` : numéro RNA/SIRET, directeur de publication, et **nom et adresse de l'hébergeur** (à renseigner une fois l'hébergeur choisi). Ces mentions sont une obligation légale.
- [ ] **`SITE_URL`** dans `astro.config.mjs`.

## Sécurité

Le site est statique : pas de base de données, pas de formulaire, pas d'authentification, aucun secret. La surface d'attaque est donc très réduite.

`public/_headers` ajoute par ailleurs les en-têtes de sécurité usuels, dont une politique de sécurité du contenu (CSP) stricte.

⚠️ **Cette CSP interdit les scripts écrits directement dans le HTML.** C'est pourquoi `astro.config.mjs` force les scripts en fichiers externes (`assetsInlineLimit: 0`). Si vous modifiez cette option, les scripts seraient de nouveau intégrés au HTML et **bloqués en production** — menu mobile, visionneuse et animations cesseraient de fonctionner, sans que cela se voie en développement.

Après toute modification de la configuration ou des en-têtes, tester le site **construit** (`npm run build`) et vérifier l'absence d'erreur CSP dans la console du navigateur.
