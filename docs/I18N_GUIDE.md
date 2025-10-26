# Guide d'Implémentation du Multilingue (EN/FR)

## 📚 Vue d'ensemble

Le système de multilingue de Covered utilise React Context API pour gérer les traductions sans dépendances externes. Il supporte actuellement l'anglais (EN) et le français (FR).

## 🏗️ Architecture

### Fichiers créés

```
src/
├── i18n/
│   └── translations.ts          # Toutes les traductions EN/FR
├── contexts/
│   └── LanguageContext.tsx      # Context et Provider pour la langue
├── components/
│   └── LanguageToggle.tsx       # Composant de sélection de langue
└── styles/
    └── language-toggle.css      # Styles du sélecteur
```

## 🚀 Utilisation

### 1. Dans un composant

```tsx
import { useLanguage } from '../contexts/LanguageContext';

function MyComponent() {
    const { t, language, setLanguage } = useLanguage();
    
    return (
        <div>
            <h1>{t.common.loading}</h1>
            <p>{t.header.home}</p>
            <button onClick={() => setLanguage('fr')}>
                Français
            </button>
        </div>
    );
}
```

### 2. Ajouter de nouvelles traductions

Éditez `src/i18n/translations.ts` :

```typescript
export const translations: Record<Language, Translations> = {
    en: {
        myNewSection: {
            title: 'My Title',
            description: 'My description'
        }
    },
    fr: {
        myNewSection: {
            title: 'Mon Titre',
            description: 'Ma description'
        }
    }
};
```

N'oubliez pas de mettre à jour l'interface `Translations` :

```typescript
export interface Translations {
    // ... autres sections
    myNewSection: {
        title: string;
        description: string;
    };
}
```

## 🎨 Composant LanguageToggle

Le composant `LanguageToggle` est déjà intégré dans le Header. Il affiche :
- Un drapeau (🇬🇧 ou 🇫🇷)
- Le code de langue (EN ou FR)
- Un tooltip au survol

### Personnalisation

Vous pouvez modifier les styles dans `src/styles/language-toggle.css`.

## 📦 Sections traduites

### ✅ Déjà traduites

- **Header** : Navigation, recherche, thème
- **Common** : Messages communs (loading, error, etc.)
- **Gift Page** : Tous les textes de la page cadeau
- **Favorites** : Page des favoris
- **Gallery** : Galerie de pochettes
- **Search** : Recherche et filtres

### 🔄 À traduire

Pour traduire une nouvelle page ou composant :

1. Ajoutez les clés de traduction dans `translations.ts`
2. Importez `useLanguage` dans votre composant
3. Remplacez les textes statiques par `t.section.key`

## 🌍 Détection automatique de la langue

Le système détecte automatiquement la langue du navigateur :
- Si le navigateur est en français → FR
- Sinon → EN par défaut

La préférence est sauvegardée dans `localStorage`.

## 📝 Exemple complet : Migrer un composant

**Avant :**
```tsx
function MyComponent() {
    return (
        <div>
            <h1>Welcome</h1>
            <button>Click me</button>
        </div>
    );
}
```

**Après :**
```tsx
import { useLanguage } from '../contexts/LanguageContext';

function MyComponent() {
    const { t } = useLanguage();
    
    return (
        <div>
            <h1>{t.mySection.welcome}</h1>
            <button>{t.mySection.clickMe}</button>
        </div>
    );
}
```

**Traductions à ajouter :**
```typescript
// Dans translations.ts
export interface Translations {
    mySection: {
        welcome: string;
        clickMe: string;
    };
}

export const translations = {
    en: {
        mySection: {
            welcome: 'Welcome',
            clickMe: 'Click me'
        }
    },
    fr: {
        mySection: {
            welcome: 'Bienvenue',
            clickMe: 'Cliquez-moi'
        }
    }
};
```

## 🎯 Bonnes pratiques

1. **Nommage des clés** : Utilisez des noms descriptifs et hiérarchiques
   ```typescript
   t.gift.preferences.title  // ✅ Bon
   t.title                   // ❌ Trop vague
   ```

2. **Pluriels et nombres** : Gérez les cas spéciaux
   ```typescript
   `${count} ${count > 1 ? t.items.plural : t.items.singular}`
   ```

3. **Dates** : Utilisez la locale appropriée
   ```typescript
   new Date().toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US')
   ```

4. **Interpolation** : Combinez texte et variables
   ```typescript
   `${t.common.welcome} ${userName}!`
   ```

## 🔧 Configuration avancée

### Ajouter une nouvelle langue

1. Ajoutez le code langue dans le type :
   ```typescript
   export type Language = 'en' | 'fr' | 'es';
   ```

2. Ajoutez les traductions complètes pour cette langue

3. Mettez à jour le LanguageToggle pour supporter la nouvelle langue

## 📱 Responsive

Le LanguageToggle s'adapte automatiquement :
- **Desktop** : Drapeau + texte
- **Mobile** : Drapeau uniquement

## ♿ Accessibilité

- Support du clavier (focus-visible)
- ARIA labels appropriés
- Support du mode contraste élevé
- Respect de `prefers-reduced-motion`

## 🐛 Dépannage

### La langue ne change pas
- Vérifiez que le LanguageProvider enveloppe votre application
- Vérifiez la console pour les erreurs

### Texte manquant
- Vérifiez que la clé existe dans `translations.ts`
- Vérifiez l'interface `Translations`

### LocalStorage
- Les préférences sont dans `localStorage.getItem('language')`
- Effacez le localStorage pour réinitialiser

## 📊 Statistiques

- **Lignes de traduction** : ~200+ clés
- **Fichiers modifiés** : 5
- **Dépendances ajoutées** : 0
- **Performance** : Aucun impact (Context API natif)
