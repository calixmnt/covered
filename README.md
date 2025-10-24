# 🎵 Covered - Music Art Gallery

Une application web moderne pour découvrir, explorer et collectionner des pochettes d'albums musicaux via l'API Spotify.

![React](https://img.shields.io/badge/React-18.3-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue) ![Vite](https://img.shields.io/badge/Vite-5.4-purple)

## ✨ Fonctionnalités

- 🔍 **Recherche avancée** : Recherchez des albums, artistes et pistes avec filtres
- ❤️ **Système de favoris** : Sauvegardez vos albums préférés localement
- 🎁 **Gift of the Day** : Découvrez un album aléatoire chaque jour avec préférences personnalisables
- 🖼️ **Galerie immersive** : Visualisez vos covers préférées en plein écran
- 📱 **Responsive** : Interface adaptée mobile, tablette et desktop
- 🎨 **Design moderne** : Interface minimaliste et élégante
- 🚀 **Performances optimisées** : Cache API, lazy loading, React Query

## 🛠️ Technologies

- **Frontend** : React 18.3 + TypeScript
- **Build** : Vite 5.4
- **Routing** : React Router DOM v6
- **State Management** : React Query (@tanstack/react-query)
- **API** : Spotify Web API
- **Icons** : React Icons
- **Styling** : CSS moderne avec variables

## 📋 Prérequis

- Node.js 18+ et npm
- Compte Spotify Developer (gratuit)

## 🚀 Installation

1. **Cloner le projet**
```bash
git clone <votre-repo>
cd covered
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configurer les variables d'environnement**

Créez un fichier `.env` à la racine du projet :
```bash
cp .env.example .env
```

Obtenez vos credentials Spotify :
- Allez sur [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
- Créez une nouvelle application
- Copiez le Client ID et Client Secret
- Remplissez le fichier `.env` :

```env
VITE_SPOTIFY_CLIENT_ID=votre_client_id
VITE_SPOTIFY_SECRET_ID=votre_client_secret
```

4. **Lancer en développement**
```bash
npm run dev
```

L'application sera accessible sur `http://localhost:5173`

## 📦 Build de production

```bash
npm run build
```

Les fichiers optimisés seront dans le dossier `dist/`

## 🎯 Structure du projet

```
src/
├── api/              # Appels API Spotify
├── components/       # Composants réutilisables
├── hooks/           # Hooks personnalisés
├── pages/           # Pages de l'application
├── providers/       # Providers React (Query)
├── service/         # Services (authentification Spotify)
├── styles/          # Fichiers CSS
├── utils/           # Fonctions utilitaires
└── interfaces/      # Types TypeScript
```

## 🌐 Pages disponibles

- `/` - Page d'accueil avec recherche
- `/covers` - Recherche avancée d'albums
- `/favorites` - Vos albums favoris
- `/gallery` - Galerie immersive
- `/gift-of-the-day` - Découverte quotidienne
- `/covers/:id` - Détails d'un album

## 🔧 Scripts disponibles

```bash
npm run dev      # Lancer en développement
npm run build    # Build de production
npm run preview  # Prévisualiser le build
npm run lint     # Linter le code
```

## 🎨 Fonctionnalités détaillées

### Gift of the Day
- Album aléatoire quotidien persistant
- Préférences personnalisables (genres, nombre de pistes)
- Historique des 50 derniers gifts
- Design minimaliste moderne

### Système de favoris
- Sauvegarde locale (localStorage)
- Export/Import JSON
- Filtres par type (album/track/artist)
- Tri personnalisable

### Recherche avancée
- Filtres multiples (année, genre, artiste)
- Recherche par type (albums, tracks, artists)
- Cache intelligent (5 min)
- Retry automatique en cas d'erreur

## 📱 Responsive Design

L'application est entièrement responsive et optimisée pour :
- 📱 Mobile (320px+)
- 📱 Tablette (768px+)
- 💻 Desktop (1024px+)

## ⚡ Performances

- ✅ Lazy loading des images
- ✅ Cache API (5-60 min selon les données)
- ✅ Skeleton loaders
- ✅ Code splitting automatique
- ✅ Build optimisé (~356KB JS gzippé)

## 🔒 Sécurité

- ✅ Variables d'environnement pour les credentials
- ✅ Pas de secrets exposés côté client
- ✅ Authentification via Client Credentials Flow

## 🐛 Résolution de problèmes

### L'API Spotify ne répond pas
- Vérifiez vos credentials dans `.env`
- Assurez-vous que l'app Spotify est active sur le dashboard

### Erreur de build
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

## 📄 Licence

MIT

## 👤 Auteur

Covered - Music Art Gallery
