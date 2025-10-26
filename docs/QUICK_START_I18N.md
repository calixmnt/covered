# Quick Start - Multilingue EN/FR

## 🎯 Objectif

Système de traduction EN/FR léger, sans dépendances externes, utilisant React Context API.

## ✅ Déjà fait

- ✅ Infrastructure complète (Context, Provider, Hook)
- ✅ 200+ traductions EN/FR
- ✅ Sélecteur de langue dans le Header
- ✅ Header entièrement traduit
- ✅ Documentation complète

## 🚀 Tester maintenant

```bash
npm run dev
```

Cliquez sur le sélecteur 🇬🇧/🇫🇷 dans le Header → Les textes changent !

## 📝 Utilisation dans un composant

```tsx
import { useLanguage } from '../contexts/LanguageContext';

function MyComponent() {
    const { t } = useLanguage();
    
    return <h1>{t.header.home}</h1>;
}
```

## 🔑 Clés disponibles

```typescript
t.common.loading          // "Loading..." / "Chargement..."
t.header.home            // "Home" / "Accueil"
t.gift.title             // "Your Musical Gift..." / "Votre Cadeau..."
t.favorites.title        // "My Favorites" / "Mes Favoris"
t.gallery.title          // "Cover Gallery" / "Galerie de Pochettes"
t.search.placeholder     // "Search for..." / "Rechercher..."
```

Voir `src/i18n/translations.ts` pour la liste complète.

## 📚 Documentation

- **Guide complet** : `docs/I18N_GUIDE.md`
- **Exemple migration** : `docs/GIFTPAGE_I18N_EXAMPLE.md`
- **Résumé** : `docs/I18N_IMPLEMENTATION_SUMMARY.md`

## 🎨 Ajouter une traduction

1. Ouvrir `src/i18n/translations.ts`
2. Ajouter dans l'interface `Translations`
3. Ajouter dans `en` et `fr`
4. Utiliser avec `t.section.key`

## 💡 Exemple rapide

**Avant :**
```tsx
<h1>Welcome</h1>
```

**Après :**
```tsx
const { t } = useLanguage();
<h1>{t.common.welcome}</h1>
```

## 🎉 C'est tout !

Le système est prêt à l'emploi. Suivez les exemples dans la documentation pour traduire le reste de l'application.
