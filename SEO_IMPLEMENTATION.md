# SEO/OG Implementation - Covered

## ✅ Implémenté

### 1. Métadonnées HTML (index.html)
- ✅ Title optimisé
- ✅ Meta description
- ✅ Meta keywords
- ✅ Meta author (LaVibe Agency)
- ✅ Theme color (#8b5cf6)
- ✅ Open Graph tags (Facebook)
- ✅ Twitter Cards
- ✅ Canonical URL
- ✅ Robots meta
- ✅ Language meta
- ✅ Favicons (multiple formats)

### 2. Composant SEO dynamique
**Fichier** : `src/components/SEO.tsx`

Composant React qui met à jour dynamiquement les métadonnées selon la page active.

**Utilisation** :
```tsx
import { SEO } from './components/SEO';
import { seoConfig } from './utils/seoConfig';

<SEO {...seoConfig.home} />
```

### 3. Configuration SEO par page
**Fichier** : `src/utils/seoConfig.ts`

Configuration centralisée pour chaque page :
- Home
- Covers (explore)
- Favorites
- Gift of the day
- Privacy
- Album details (dynamique)

### 4. Fichiers SEO
- ✅ `robots.txt` - Configuration pour les crawlers
- ✅ `sitemap.xml` - Plan du site avec priorités

## 📋 À faire

### Images à créer

#### 1. OG Image principale
**Fichier** : `public/og-image.jpg`
- Dimensions : 1200 × 630 px
- Format : JPG (< 1 MB)
- Contenu suggéré :
  - Logo "Covered" centré
  - Tagline : "Discover & Explore Album Artwork"
  - Fond dégradé violet/rose
  - Quelques covers d'albums en arrière-plan

#### 2. Favicons
- `public/favicon-32x32.png` (32×32)
- `public/favicon-16x16.png` (16×16)
- `public/apple-touch-icon.png` (180×180)

**Note** : `favicon.svg` existe déjà

### Outils recommandés
- **OG Image** : Canva, Figma, Photoshop
- **Favicons** : https://realfavicongenerator.net/

## 🧪 Tests à effectuer

### 1. Open Graph
- https://www.opengraph.xyz/
- https://developers.facebook.com/tools/debug/

### 2. Twitter Cards
- https://cards-dev.twitter.com/validator

### 3. SEO général
- Google Search Console
- https://search.google.com/test/rich-results
- Lighthouse (Chrome DevTools)

### 4. Favicons
- Tester sur différents navigateurs
- Tester sur mobile (iOS/Android)

## 📊 Métadonnées par page

### Homepage (/)
- **Title** : Covered - Discover & Explore Album Artwork
- **Description** : Explore, zoom, and discover album covers like never before...
- **Priority** : 1.0

### Covers (/covers)
- **Title** : Explore Album Covers | Covered
- **Description** : Search and explore thousands of album covers...
- **Priority** : 0.9

### Gift (/gift-of-the-day)
- **Title** : Daily Musical Gift | Covered
- **Description** : Discover your daily musical gift...
- **Priority** : 0.8

### Favorites (/favorites)
- **Title** : My Favorites | Covered
- **Description** : Your personal collection of favorite album covers...
- **Priority** : 0.7

### Privacy (/privacy)
- **Title** : Privacy & Analytics | Covered
- **Description** : Learn about our privacy-friendly analytics...
- **Priority** : 0.5

## 🎨 Brand Colors

```css
--primary-color: #0f62fe    /* Bleu */
--secondary-color: #ec4899  /* Rose */
--background-dark: #1e1f22
--background-light: #ffffff
```

## 📱 Exemple d'utilisation dans une page

```tsx
import { SEO } from '../components/SEO';
import { seoConfig } from '../utils/seoConfig';

export default function CoversPage() {
    return (
        <>
            <SEO {...seoConfig.covers} />
            {/* Contenu de la page */}
        </>
    );
}
```

## 🔗 URLs importantes

- **Site** : https://covered.lavibeagency.com/
- **Sitemap** : https://covered.lavibeagency.com/sitemap.xml
- **Robots** : https://covered.lavibeagency.com/robots.txt

## 📝 Notes

- Les métadonnées sont mises à jour dynamiquement via le composant SEO
- Le sitemap doit être mis à jour manuellement lors de l'ajout de nouvelles pages
- Les images OG doivent être optimisées pour le web (< 1 MB)
- Tester régulièrement avec les outils de validation
