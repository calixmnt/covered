# Assets nécessaires pour Covered

## Images OG/SEO à créer

### 1. OG Image (Open Graph)
**Fichier** : `og-image.jpg`
- **Dimensions** : 1200 × 630 px
- **Format** : JPG ou PNG
- **Poids** : < 1 MB
- **Contenu suggéré** :
  - Logo "Covered" centré
  - Tagline : "Discover & Explore Album Artwork"
  - Fond dégradé violet/rose (brand colors)
  - Quelques covers d'albums en arrière-plan (floutés)

### 2. Favicons

#### favicon.svg (déjà existant)
- **Format** : SVG
- **Utilisation** : Navigateurs modernes

#### favicon-32x32.png
- **Dimensions** : 32 × 32 px
- **Format** : PNG
- **Utilisation** : Navigateurs desktop

#### favicon-16x16.png
- **Dimensions** : 16 × 16 px
- **Format** : PNG
- **Utilisation** : Onglets navigateurs

#### apple-touch-icon.png
- **Dimensions** : 180 × 180 px
- **Format** : PNG
- **Utilisation** : iOS home screen

## Outils recommandés

### Pour créer l'OG Image
- **Figma** : Template OG image
- **Canva** : Template "Facebook Post" (1200×630)
- **Photoshop** : Nouveau document 1200×630px

### Pour générer les favicons
- **RealFaviconGenerator** : https://realfavicongenerator.net/
- **Favicon.io** : https://favicon.io/
- Partir du logo SVG existant

## Brand Colors (pour référence)

```css
--primary-color: #8b5cf6 (violet)
--secondary-color: #ec4899 (rose)
--background-dark: #1e1f22
--background-light: #ffffff
```

## Checklist

- [ ] Créer og-image.jpg (1200×630)
- [ ] Générer favicon-32x32.png
- [ ] Générer favicon-16x16.png
- [ ] Générer apple-touch-icon.png
- [ ] Placer tous les fichiers dans `/public`
- [ ] Tester avec https://www.opengraph.xyz/
- [ ] Tester avec https://cards-dev.twitter.com/validator

## Emplacement des fichiers

Tous les fichiers doivent être placés dans le dossier `/public` :

```
/public
  ├── og-image.jpg
  ├── favicon.svg (existant)
  ├── favicon-32x32.png
  ├── favicon-16x16.png
  └── apple-touch-icon.png
```
