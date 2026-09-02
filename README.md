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

`netlify.toml` et `public/_headers` sont conservés : basculer vers Netlify ou Cloudflare Pages ne demande que de connecter le dépôt, sans toucher au code. Ces deux hébergeurs appliqueront en plus les en-têtes de sécurité (voir ci-dessous).

## 4. À compléter avant la mise en ligne

- [ ] **Lien d'inscription** — les boutons « Rejoindre le club » pointent vers `aspttnancy.monclub.app`, qui est le club **ASPTT Nancy**. À remplacer par l'adresse réelle du JCOV (6 occurrences, `git grep monclub`).
- [ ] **Coordonnées** — vérifier le téléphone et l'e-mail dans `src/data/club.ts` (l'affiche du club mentionne d'autres coordonnées que celles affichées).
- [ ] **Mentions légales** — compléter les trois champs `[à compléter]` dans `src/pages/mentions-legales.astro` : numéro RNA/SIRET, directeur de publication, et l'hébergeur, soit :
      `GitHub, Inc., 88 Colin P. Kelly Jr. Street, San Francisco, CA 94107, États-Unis`.
      Ces mentions sont une obligation légale.

## Sécurité

Le site est statique : pas de base de données, pas de formulaire, pas d'authentification, aucun secret. La surface d'attaque est donc très réduite.

La politique de sécurité du contenu (CSP) est déclarée à deux endroits :

- **en balise `<meta>`** dans `MainLayout.astro` — la seule qui s'applique sur GitHub Pages ;
- **dans `public/_headers`** — utilisé par Netlify et Cloudflare Pages, avec en plus HSTS, `X-Frame-Options` et la mise en cache longue des fichiers versionnés.

⚠️ **GitHub Pages n'accepte aucun en-tête HTTP personnalisé.** `public/_headers` y est donc ignoré : le site n'y bénéficie que de la CSP en balise meta. Il manque alors la protection contre l'affichage en iframe (`frame-ancestors`) et HSTS, que les balises meta ne savent pas porter. Pour un site vitrine sans formulaire ni compte utilisateur, l'écart est faible — mais il existe, et Cloudflare Pages le comblerait.

Toute modification de la CSP doit être répercutée **aux deux endroits**.

⚠️ **Cette CSP interdit les scripts écrits directement dans le HTML.** C'est pourquoi `astro.config.mjs` force les scripts en fichiers externes (`assetsInlineLimit: 0`). Si vous modifiez cette option, les scripts seraient de nouveau intégrés au HTML et **bloqués en production** — menu mobile, visionneuse et animations cesseraient de fonctionner, sans que cela se voie en développement.

Après toute modification de la configuration ou des en-têtes, tester le site **construit** (`npm run build`) et vérifier l'absence d'erreur CSP dans la console du navigateur.
