# Notre Demain — Site web

Site statique de [Notre Demain](mailto:notredemainhaiti@gmail.com), projet haïtien d'éducation des jeunes.

## Démarrage rapide

```bash
npm install
npm run dev     # http://localhost:8080
npm run build   # génère _site/
```

## Ajouter une activité

1. Créer `src/activites/<slug>.md` :

```yaml
---
title: "Nom de l'activité"
date: 2026-07-01
summary: "Résumé en une phrase (≤ 155 caractères)."
location: "Quartier, Ville"
featured: true
cover: "./photos/<slug>/cover.jpg"
coverAlt: "Description de l'image (sans nom d'enfant)."
stats: [{label: "enfants", value: 50}, {label: "bénévoles", value: 10}]
partners: [{name: "Partenaire", url: "https://..."}]
gallery: [{src: "./photos/<slug>/01.jpg", alt: "Description."}]
---

Contenu de la page en Markdown...
```

2. Copier les photos originales dans `assets-source/photos/<slug>/`.
3. Retirer les métadonnées EXIF : `exiftool -all= -overwrite_original assets-source/photos/<slug>/*`
4. L'activité apparaît automatiquement sur `/activites/`. Si `featured: true`, elle s'affiche aussi sur la page d'accueil.

## Stack

- [Eleventy v3](https://www.11ty.dev/) — générateur de site statique
- Nunjucks (templates), Markdown (contenu)
- CSS vanilla + Lightning CSS (minification)
- Netlify (hébergement + formulaire de contact)
