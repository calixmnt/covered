# Exemple de Migration : GiftPage

## Modifications à apporter dans GiftPage.tsx

Voici les principales modifications pour traduire la GiftPage :

### 1. Messages de chargement

**Avant :**
```tsx
<LoadingSpinner size="large" message="Unwrapping your musical gift..." />
```

**Après :**
```tsx
<LoadingSpinner size="large" message={t.gift.loading} />
```

### 2. Messages d'erreur

**Avant :**
```tsx
<h2>Gift Unavailable</h2>
<p>We couldn't unwrap your musical gift right now</p>
<button>Try Again</button>
```

**Après :**
```tsx
<h2>{t.gift.error}</h2>
<p>{t.gift.errorMessage}</p>
<button>{t.common.retry}</button>
```

### 3. Boutons d'action

**Avant :**
```tsx
<span>Exit Gift</span>
<button title="Refresh gift">
    <FaDiceSix />
    <span>New Gift</span>
</button>
<button title="Show details">
    <FaMusic />
    <span>Details</span>
</button>
```

**Après :**
```tsx
<span>{t.common.back}</span>
<button title={t.gift.refresh}>
    <FaDiceSix />
    <span>{t.gift.refresh}</span>
</button>
<button title={t.gift.showDetails}>
    <FaMusic />
    <span>{showDetails ? t.gift.hideDetails : t.gift.showDetails}</span>
</button>
```

### 4. Détails de l'album

**Avant :**
```tsx
<div className="gift-detail-item">
    <span className="gift-detail-label">Release Date</span>
    <span className="gift-detail-value">{formatReleaseDate(giftAlbum.release_date)}</span>
</div>
<div className="gift-detail-item">
    <span className="gift-detail-label">Total Tracks</span>
    <span className="gift-detail-value">{giftAlbum.total_tracks}</span>
</div>
```

**Après :**
```tsx
<div className="gift-detail-item">
    <span className="gift-detail-label">{t.gift.releaseDate}</span>
    <span className="gift-detail-value">{formatReleaseDate(giftAlbum.release_date)}</span>
</div>
<div className="gift-detail-item">
    <span className="gift-detail-label">{t.gift.totalTracks}</span>
    <span className="gift-detail-value">{giftAlbum.total_tracks}</span>
</div>
```

### 5. Modal Historique

**Avant :**
```tsx
<h2>Gift History</h2>
<p>No gift history yet</p>
<button>Clear History</button>
```

**Après :**
```tsx
<h2>{t.gift.historyTitle}</h2>
<p>{t.gift.historyEmpty}</p>
<button>{t.favorites.clear}</button>
```

### 6. Modal Préférences

**Avant :**
```tsx
<h2>Gift Preferences</h2>
<label>Preferred Genres</label>
<label>Minimum Tracks: {preferences.minTracks}</label>
<label>
    <input type="checkbox" />
    Avoid recently discovered albums
</label>
```

**Après :**
```tsx
<h2>{t.gift.preferencesTitle}</h2>
<label>{t.gift.preferredGenres}</label>
<label>{t.gift.minTracks}: {preferences.minTracks}</label>
<label>
    <input type="checkbox" />
    {t.gift.avoidRecent}
</label>
```

### 7. Genres

**Avant :**
```tsx
const allGenres = [
    'rock', 'pop', 'jazz', 'electronic', 'hip-hop', 'classical'
];

// Affichage
{allGenres.map(genre => (
    <button key={genre}>{genre}</button>
))}
```

**Après :**
```tsx
const allGenres = [
    'rock', 'pop', 'jazz', 'electronic', 'hip-hop', 'classical'
] as const;

// Affichage avec traduction
{allGenres.map(genre => (
    <button key={genre}>
        {t.gift.genres[genre]}
    </button>
))}
```

### 8. Formatage des dates

**Avant :**
```tsx
const loadHistoryItem = (historyItem: GiftHistory) => {
    setGiftDate(new Date(historyItem.date).toLocaleDateString('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }));
};
```

**Après :**
```tsx
const loadHistoryItem = (historyItem: GiftHistory) => {
    const locale = language === 'fr' ? 'fr-FR' : 'en-US';
    setGiftDate(new Date(historyItem.date).toLocaleDateString(locale, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }));
};
```

### 9. Message du jour

**Avant :**
```tsx
<div className="gift-message">
    <FaGift className="gift-icon-animated" />
    <p>Votre découverte musicale du jour</p>
</div>
```

**Après :**
```tsx
<div className="gift-message">
    <FaGift className="gift-icon-animated" />
    <p>{t.gift.dailyDiscovery}</p>
</div>
```

## Résumé des changements

### Imports à ajouter
```tsx
import { useLanguage } from '../contexts/LanguageContext';
```

### Hook à utiliser
```tsx
const { t, language } = useLanguage();
```

### Sections à traduire
- ✅ Messages de chargement et d'erreur
- ✅ Boutons et actions
- ✅ Détails de l'album
- ✅ Modal historique
- ✅ Modal préférences
- ✅ Noms des genres
- ✅ Formatage des dates
- ✅ Messages informatifs

## Test

Pour tester la traduction :
1. Cliquez sur le sélecteur de langue dans le Header
2. Vérifiez que tous les textes changent
3. Testez les modales (historique, préférences)
4. Vérifiez le formatage des dates

## Notes importantes

- Les traductions sont déjà définies dans `src/i18n/translations.ts`
- Aucune modification de la logique métier n'est nécessaire
- Seuls les textes affichés sont remplacés
- Le système est type-safe grâce à TypeScript
