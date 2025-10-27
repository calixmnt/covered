export type Language = 'en' | 'fr';

export interface Translations {
    // Common
    common: {
        loading: string;
        error: string;
        retry: string;
        close: string;
        save: string;
        cancel: string;
        back: string;
        next: string;
        previous: string;
        search: string;
        noResults: string;
        pageNotFound: string;
        pageNotFoundDesc: string;
        backToHome: string;
    };
    
    // Header
    header: {
        home: string;
        homeDesc: string;
        explore: string;
        exploreDesc: string;
        yourGift: string;
        yourGiftDesc: string;
        gallery: string;
        galleryDesc: string;
        favorites: string;
        navigation: string;
        quickSearch: string;
        quickSearchPlaceholder: string;
        switchTheme: string;
        lightMode: string;
        darkMode: string;
    };
    
    // Gift Page
    gift: {
        title: string;
        subtitle: string;
        dailyDiscovery: string;
        loading: string;
        error: string;
        errorMessage: string;
        refresh: string;
        showDetails: string;
        hideDetails: string;
        history: string;
        preferences: string;
        share: string;
        openSpotify: string;
        viewDetails: string;
        
        // Details
        detailsTitle: string;
        releaseDate: string;
        totalTracks: string;
        popularity: string;
        artists: string;
        
        // History
        historyTitle: string;
        historyEmpty: string;
        historyEmptyDesc: string;
        historyItemDate: string;
        historyItemLiked: string;
        clearHistory: string;
        
        // Preferences
        preferencesTitle: string;
        preferredGenres: string;
        preferredGenresDesc: string;
        excludedGenres: string;
        minTracks: string;
        minTracksDesc: string;
        albumTypes: string;
        albumTypesAll: string;
        albumTypesAlbum: string;
        albumTypesSingle: string;
        avoidRecent: string;
        
        // Additional
        noGiftTitle: string;
        noGiftDesc: string;
        unwrapGift: string;
        like: string;
        liked: string;
        shareTitle: string;
        type: string;
        unknownArtist: string;
        
        // Genres
        genres: {
            rock: string;
            pop: string;
            jazz: string;
            electronic: string;
            'hip-hop': string;
            classical: string;
            blues: string;
            country: string;
            reggae: string;
            folk: string;
            indie: string;
            alternative: string;
            soul: string;
            funk: string;
            disco: string;
            punk: string;
            metal: string;
            ambient: string;
            'r&b': string;
            latin: string;
            world: string;
            'new age': string;
            gospel: string;
            ska: string;
            grunge: string;
        };
    };
    
    // Favorites
    favorites: {
        title: string;
        empty: string;
        emptyDesc: string;
        albums: string;
        tracks: string;
        artists: string;
        export: string;
        import: string;
        clear: string;
        clearConfirm: string;
        clearWarning: string;
        galleryView: string;
        backToList: string;
        filterByType: string;
        all: string;
        alphabetical: string;
        byType: string;
        random: string;
        noMatch: string;
    };
    
    // Gallery
    gallery: {
        title: string;
        exit: string;
        sortBy: string;
        sortRecent: string;
        sortOldest: string;
        sortName: string;
        empty: string;
        emptyDesc: string;
        loading: string;
        emptyTitle: string;
        switchToRandom: string;
        switchToRecent: string;
        play: string;
    };
    
    // Search
    search: {
        placeholder: string;
        filters: string;
        advancedSearch: string;
        results: string;
        noResults: string;
        searchFor: string;
        recentSearches: string;
        popularSearches: string;
        quickDiscoveries: string;
        clearAll: string;
        voiceSearch: string;
        randomSearch: string;
        clearSearch: string;
    };
    
    // Covers Page
    covers: {
        searchPlaceholder: string;
        filtersTitle: string;
        searchingMessage: string;
        searchResults: string;
        resultCount: string;
        resultCountPlural: string;
        noResultsTitle: string;
        noResultsDesc: string;
        welcomeTitle: string;
        welcomeDesc: string;
        unknownArtist: string;
    };
    
    // Cover Details Page
    coverDetails: {
        loadingMessage: string;
        back: string;
        clickToExplore: string;
        addToFavorites: string;
        removeFromFavorites: string;
        share: string;
        shareTitle: string;
        openInSpotify: string;
        released: string;
        tracks: string;
        duration: string;
        trackListing: string;
        moreFrom: string;
        noSurpriseTitle: string;
        noSurpriseDesc: string;
        tryAgain: string;
        goHome: string;
        albumNotFoundTitle: string;
        albumNotFoundDesc: string;
        albumNotFoundDescRandom: string;
        tryAnotherRandom: string;
        browseAlbums: string;
        goBack: string;
        unknownArtist: string;
    };
    
    // Hero
    hero: {
        title: string;
        description: string;
        btnStartExploring: string;
        btnSurpriseMe: string;
        btnMyCollection: string;
        titleAccent: string;
        urCollection: string;
        highQuality: string;
        toDiscover: string;
    };
    
    // Privacy
    privacy: {
        title: string;
        whatWeCollect: string;
        anonymousDescription: string;
        noPersonalData: string;
        noCookies: string;
        noTracking: string;
        gdprCompliant: string;
        eventsTracked: string;
        eventsDescription: string;
        eventSearch: string;
        eventClick: string;
        eventFavorite: string;
        eventGift: string;
        optOutTitle: string;
        optOutDescription: string;
        optedOut: string;
        optIn: string;
        statusOptedOut: string;
        statusOptedIn: string;
        learnMore: string;
        plausibleInfo: string;
    };
}

export const translations: Record<Language, Translations> = {
    en: {
        common: {
            loading: 'Loading...',
            error: 'An error occurred',
            retry: 'Retry',
            close: 'Close',
            save: 'Save',
            cancel: 'Cancel',
            back: 'Back',
            next: 'Next',
            previous: 'Previous',
            search: 'Search',
            noResults: 'No results found',
            pageNotFound: 'Page Not Found',
            pageNotFoundDesc: 'The page you are looking for does not exist or has been moved.',
            backToHome: 'Back to Home',
        },
        
        header: {
            home: 'Home',
            homeDesc: 'Discover music',
            explore: 'explore',
            exploreDesc: 'Search albums',
            yourGift: 'your gift',
            yourGiftDesc: 'Daily discovery',
            gallery: 'Gallery',
            galleryDesc: 'Your cover collection',
            favorites: 'favorites',
            navigation: 'Navigation',
            quickSearch: 'Toggle search',
            quickSearchPlaceholder: 'Quick search for albums, artists...',
            switchTheme: 'Switch to',
            lightMode: 'Light Mode',
            darkMode: 'Dark Mode',
        },
        
        gift: {
            title: 'Your Musical Gift of the Day',
            subtitle: 'Discover a new album every day',
            dailyDiscovery: 'Your daily musical discovery',
            loading: 'Unwrapping your gift...',
            error: 'Oops!',
            errorMessage: 'Unable to fetch your gift. Please try again.',
            refresh: 'Get a new gift',
            showDetails: 'Show details',
            hideDetails: 'Hide details',
            history: 'History',
            preferences: 'Preferences',
            share: 'Share',
            openSpotify: 'Open in Spotify',
            viewDetails: 'View details',
            
            detailsTitle: 'Album Details',
            releaseDate: 'Release Date',
            totalTracks: 'Total Tracks',
            popularity: 'Popularity',
            artists: 'Artists',
            
            historyTitle: 'Gift History',
            historyEmpty: 'No gift history yet',
            historyEmptyDesc: 'Your discovered albums will appear here',
            historyItemDate: 'Discovered on',
            historyItemLiked: 'Liked',
            clearHistory: 'Clear History',
            
            preferencesTitle: 'Gift Preferences',
            preferredGenres: 'Preferred Genres',
            preferredGenresDesc: 'Select genres you\'d like to discover more often',
            excludedGenres: 'Excluded Genres',
            minTracks: 'Minimum Tracks',
            minTracksDesc: 'Albums should have at least this many tracks',
            albumTypes: 'Album Types',
            albumTypesAll: 'All types',
            albumTypesAlbum: 'Full Albums',
            albumTypesSingle: 'Singles & EPs',
            avoidRecent: 'Avoid recently discovered albums',
            
            noGiftTitle: 'No Gift Found',
            noGiftDesc: 'Let\'s try to find you something special',
            unwrapGift: 'Unwrap Gift',
            like: 'Like',
            liked: 'Liked',
            shareTitle: 'Share this gift',
            type: 'Type',
            unknownArtist: 'Unknown Artist',
            
            genres: {
                rock: 'Rock',
                pop: 'Pop',
                jazz: 'Jazz',
                electronic: 'Electronic',
                'hip-hop': 'Hip-Hop',
                classical: 'Classical',
                blues: 'Blues',
                country: 'Country',
                reggae: 'Reggae',
                folk: 'Folk',
                indie: 'Indie',
                alternative: 'Alternative',
                soul: 'Soul',
                funk: 'Funk',
                disco: 'Disco',
                punk: 'Punk',
                metal: 'Metal',
                ambient: 'Ambient',
                'r&b': 'R&B',
                latin: 'Latin',
                world: 'World',
                'new age': 'New Age',
                gospel: 'Gospel',
                ska: 'Ska',
                grunge: 'Grunge',
            },
        },
        
        favorites: {
            title: 'My Favorites',
            empty: 'No favorites yet',
            emptyDesc: 'Start liking albums and tracks to build your collection',
            albums: 'Albums',
            tracks: 'Tracks',
            artists: 'Artists',
            export: 'Export',
            import: 'Import',
            clear: 'Clear All',
            clearConfirm: 'Clear All Favorites?',
            clearWarning: 'This action cannot be undone. All your favorite items will be permanently removed.',
            galleryView: 'Gallery View',
            backToList: 'Back to List',
            filterByType: 'Filter by type',
            all: 'All',
            alphabetical: 'Alphabetical',
            byType: 'By Type',
            random: 'Random',
            noMatch: 'No favorites match the current filter.',
        },
        
        gallery: {
            title: 'Cover Gallery',
            exit: 'Exit Gallery',
            sortBy: 'Sort by',
            sortRecent: 'Most Recent',
            sortOldest: 'Oldest First',
            sortName: 'Name',
            empty: 'No covers in gallery',
            emptyDesc: 'Add albums and tracks to your favorites to see them here',
            loading: 'Opening your gallery...',
            emptyTitle: 'Your Gallery Awaits',
            switchToRandom: 'Switch to random order',
            switchToRecent: 'Switch to recent order',
            play: 'Play',
        },
        
        search: {
            placeholder: 'Search for albums, artists, tracks...',
            filters: 'Filters',
            advancedSearch: 'Advanced Search',
            results: 'Results',
            noResults: 'No results found',
            searchFor: 'Search for',
            recentSearches: 'Recent Searches',
            popularSearches: 'Popular Searches',
            quickDiscoveries: 'Quick Discoveries',
            clearAll: 'Clear',
            voiceSearch: 'Voice search',
            randomSearch: 'Random search',
            clearSearch: 'Clear search',
        },
        
        covers: {
            searchPlaceholder: 'Search for albums, tracks, or artists...',
            filtersTitle: 'Filters',
            searchingMessage: 'Searching for music...',
            searchResults: 'Search Results',
            resultCount: 'result',
            resultCountPlural: 'results',
            noResultsTitle: 'No Results Found',
            noResultsDesc: 'Try adjusting your search terms or filters.',
            welcomeTitle: 'Discover Amazing Music',
            welcomeDesc: 'Use the search above to find your favorite albums, tracks, and artists.',
            unknownArtist: 'Unknown Artist',
        },
        
        coverDetails: {
            loadingMessage: 'Loading album details...',
            back: 'Back',
            clickToExplore: 'Click to explore',
            addToFavorites: 'Add to Favorites',
            removeFromFavorites: 'Remove from Favorites',
            share: 'Share',
            shareTitle: 'Share this album',
            openInSpotify: 'Open in Spotify',
            released: 'Released',
            tracks: 'tracks',
            duration: 'Duration',
            trackListing: 'Track Listing',
            moreFrom: 'More from',
            noSurpriseTitle: 'No Surprise Available',
            noSurpriseDesc: 'We couldn\'t find a random album for today\'s surprise. Please try again later.',
            tryAgain: 'Try Again',
            goHome: 'Go Home',
            albumNotFoundTitle: 'Album Not Found',
            albumNotFoundDesc: 'The requested album could not be found.',
            albumNotFoundDescRandom: 'The random album we found is not available in your region or has been removed.',
            tryAnotherRandom: 'Try Another Random Album',
            browseAlbums: 'Browse Albums',
            goBack: 'Go Back',
            unknownArtist: 'Unknown Artist',
        },
        
        hero: {
            title: 'Explore Your Favorite',
            description: 'Discover, zoom, and explore album artwork like never before. Your personal gallery of music art awaits.',
            btnStartExploring: 'Start Exploring',
            btnSurpriseMe: 'Surprise Me',
            btnMyCollection: 'My Collection',
            titleAccent: 'Albums Covers',
            urCollection: 'In your collection',
            highQuality: 'High Quality',
            toDiscover: 'To Discover',
        },
        
        privacy: {
            title: 'Privacy & Analytics',
            whatWeCollect: 'What We Collect',
            anonymousDescription: 'We use Plausible Analytics, a privacy-friendly and open-source analytics service. All data is collected anonymously and aggregated.',
            noPersonalData: 'No personal data or identifiable information',
            noCookies: 'No cookies stored on your device',
            noTracking: 'No cross-site or cross-device tracking',
            gdprCompliant: 'GDPR, CCPA and PECR compliant',
            eventsTracked: 'Events We Track',
            eventsDescription: 'We track the following anonymous events to improve the user experience:',
            eventSearch: 'When you perform a search',
            eventClick: 'When you click on a search result',
            eventFavorite: 'When you add an album to favorites',
            eventGift: 'When you view the gift of the day',
            optOutTitle: 'Opt-Out of Analytics',
            optOutDescription: 'You can opt-out of analytics tracking at any time. Your preference will be saved locally on your device.',
            optedOut: 'Analytics Disabled',
            optIn: 'Disable Analytics',
            statusOptedOut: 'Analytics tracking is currently disabled for your visits.',
            statusOptedIn: 'Analytics tracking is currently enabled to help us improve the experience.',
            learnMore: 'Learn More',
            plausibleInfo: 'Learn more about privacy-friendly analytics at',
        },
    },
    
    fr: {
        common: {
            loading: 'Chargement...',
            error: 'Une erreur est survenue',
            retry: 'Réessayer',
            close: 'Fermer',
            save: 'Enregistrer',
            cancel: 'Annuler',
            back: 'Retour',
            next: 'Suivant',
            previous: 'Précédent',
            search: 'Rechercher',
            noResults: 'Aucun résultat trouvé',
            pageNotFound: 'Page non trouvée',
            pageNotFoundDesc: 'La page que vous recherchez n\'existe pas ou a été déplacée.',
            backToHome: 'Retour à l\'accueil',
        },
        
        header: {
            home: 'Accueil',
            homeDesc: 'Découvrir la musique',
            explore: 'explorer',
            exploreDesc: 'Rechercher des albums',
            yourGift: 'votre cadeau',
            yourGiftDesc: 'Découverte quotidienne',
            gallery: 'Galerie',
            galleryDesc: 'Votre collection de pochettes',
            favorites: 'favoris',
            navigation: 'Navigation',
            quickSearch: 'Basculer la recherche',
            quickSearchPlaceholder: 'Recherche rapide d\'albums, artistes...',
            switchTheme: 'Passer en mode',
            lightMode: 'Mode Clair',
            darkMode: 'Mode Sombre',
        },
        
        gift: {
            title: 'Votre Cadeau Musical du Jour',
            subtitle: 'Découvrez un nouvel album chaque jour',
            dailyDiscovery: 'Votre découverte musicale du jour',
            loading: 'Déballage de votre cadeau...',
            error: 'Oups !',
            errorMessage: 'Impossible de récupérer votre cadeau. Veuillez réessayer.',
            refresh: 'Obtenir un nouveau cadeau',
            showDetails: 'Afficher les détails',
            hideDetails: 'Masquer les détails',
            history: 'Historique',
            preferences: 'Préférences',
            share: 'Partager',
            openSpotify: 'Ouvrir dans Spotify',
            viewDetails: 'Voir les détails',
            
            detailsTitle: 'Détails de l\'album',
            releaseDate: 'Date de sortie',
            totalTracks: 'Nombre de pistes',
            popularity: 'Popularité',
            artists: 'Artistes',
            
            historyTitle: 'Historique des cadeaux',
            historyEmpty: 'Aucun historique de cadeaux',
            historyEmptyDesc: 'Vos albums découverts apparaîtront ici',
            historyItemDate: 'Découvert le',
            historyItemLiked: 'Aimé',
            clearHistory: 'Effacer l\'historique',
            
            preferencesTitle: 'Préférences de cadeaux',
            preferredGenres: 'Genres préférés',
            preferredGenresDesc: 'Sélectionnez les genres que vous aimeriez découvrir plus souvent',
            excludedGenres: 'Genres exclus',
            minTracks: 'Nombre minimum de pistes',
            minTracksDesc: 'Les albums doivent avoir au moins ce nombre de pistes',
            albumTypes: 'Types d\'albums',
            albumTypesAll: 'Tous les types',
            albumTypesAlbum: 'Albums complets',
            albumTypesSingle: 'Singles & EPs',
            avoidRecent: 'Éviter les albums récemment découverts',
            
            noGiftTitle: 'Aucun cadeau trouvé',
            noGiftDesc: 'Essayons de vous trouver quelque chose de spécial',
            unwrapGift: 'Déballer le cadeau',
            like: 'J\'aime',
            liked: 'Aimé',
            shareTitle: 'Partager ce cadeau',
            type: 'Type',
            unknownArtist: 'Artiste inconnu',
            
            genres: {
                rock: 'Rock',
                pop: 'Pop',
                jazz: 'Jazz',
                electronic: 'Électronique',
                'hip-hop': 'Hip-Hop',
                classical: 'Classique',
                blues: 'Blues',
                country: 'Country',
                reggae: 'Reggae',
                folk: 'Folk',
                indie: 'Indie',
                alternative: 'Alternatif',
                soul: 'Soul',
                funk: 'Funk',
                disco: 'Disco',
                punk: 'Punk',
                metal: 'Metal',
                ambient: 'Ambient',
                'r&b': 'R&B',
                latin: 'Latin',
                world: 'Musique du monde',
                'new age': 'New Age',
                gospel: 'Gospel',
                ska: 'Ska',
                grunge: 'Grunge',
            },
        },
        
        favorites: {
            title: 'Mes Favoris',
            empty: 'Aucun favori',
            emptyDesc: 'Commencez à aimer des albums et morceaux pour construire votre collection',
            albums: 'Albums',
            tracks: 'Morceaux',
            artists: 'Artistes',
            export: 'Exporter',
            import: 'Importer',
            clear: 'Tout effacer',
            clearConfirm: 'Effacer tous les favoris ?',
            clearWarning: 'Cette action est irréversible. Tous vos favoris seront définitivement supprimés.',
            galleryView: 'Vue Galerie',
            backToList: 'Retour à la liste',
            filterByType: 'Filtrer par type',
            all: 'Tous',
            alphabetical: 'Alphabétique',
            byType: 'Par type',
            random: 'Aléatoire',
            noMatch: 'Aucun favori ne correspond au filtre actuel.',
        },
        
        gallery: {
            title: 'Galerie de Pochettes',
            exit: 'Quitter la Galerie',
            sortBy: 'Trier par',
            sortRecent: 'Plus récents',
            sortOldest: 'Plus anciens',
            sortName: 'Nom',
            empty: 'Aucune pochette dans la galerie',
            emptyDesc: 'Ajoutez des albums et morceaux à vos favoris pour les voir ici',
            loading: 'Ouverture de votre galerie...',
            emptyTitle: 'Votre galerie vous attend',
            switchToRandom: 'Passer en ordre aléatoire',
            switchToRecent: 'Passer en ordre récent',
            play: 'Lecture',
        },
        
        search: {
            placeholder: 'Rechercher des albums, artistes, morceaux...',
            filters: 'Filtres',
            advancedSearch: 'Recherche Avancée',
            results: 'Résultats',
            noResults: 'Aucun résultat trouvé',
            searchFor: 'Rechercher',
            recentSearches: 'Recherches Récentes',
            popularSearches: 'Recherches Populaires',
            quickDiscoveries: 'Découvertes Rapides',
            clearAll: 'Effacer',
            voiceSearch: 'Recherche vocale',
            randomSearch: 'Recherche aléatoire',
            clearSearch: 'Effacer la recherche',
        },
        
        covers: {
            searchPlaceholder: 'Rechercher des albums, morceaux ou artistes...',
            filtersTitle: 'Filtres',
            searchingMessage: 'Recherche de musique...',
            searchResults: 'Résultats de recherche',
            resultCount: 'résultat',
            resultCountPlural: 'résultats',
            noResultsTitle: 'Aucun résultat trouvé',
            noResultsDesc: 'Essayez d\'ajuster vos termes de recherche ou vos filtres.',
            welcomeTitle: 'Découvrez de la musique incroyable',
            welcomeDesc: 'Utilisez la recherche ci-dessus pour trouver vos albums, morceaux et artistes préférés.',
            unknownArtist: 'Artiste inconnu',
        },
        
        coverDetails: {
            loadingMessage: 'Chargement des détails de l\'album...',
            back: 'Retour',
            clickToExplore: 'Cliquez pour explorer',
            addToFavorites: 'Ajouter aux favoris',
            removeFromFavorites: 'Retirer des favoris',
            share: 'Partager',
            shareTitle: 'Partager cet album',
            openInSpotify: 'Ouvrir dans Spotify',
            released: 'Sorti le',
            tracks: 'pistes',
            duration: 'Durée',
            trackListing: 'Liste des pistes',
            moreFrom: 'Plus de',
            noSurpriseTitle: 'Aucune surprise disponible',
            noSurpriseDesc: 'Nous n\'avons pas pu trouver d\'album aléatoire pour la surprise d\'aujourd\'hui. Veuillez réessayer plus tard.',
            tryAgain: 'Réessayer',
            goHome: 'Retour à l\'accueil',
            albumNotFoundTitle: 'Album introuvable',
            albumNotFoundDesc: 'L\'album demandé n\'a pas pu être trouvé.',
            albumNotFoundDescRandom: 'L\'album aléatoire que nous avons trouvé n\'est pas disponible dans votre région ou a été supprimé.',
            tryAnotherRandom: 'Essayer un autre album aléatoire',
            browseAlbums: 'Parcourir les albums',
            goBack: 'Retour',
            unknownArtist: 'Artiste inconnu',
        },
        
        hero: {
            title: 'Redécouvrez vos pochettes ',
            description: 'Découvrez, zoom, et explorez les couvertures d\'album comme jamais avant. Votre galerie personnelle d\'art musicale vous attend.',
            btnStartExploring: 'Commencer à explorer',
            btnSurpriseMe: 'Suprends moi',
            btnMyCollection: 'Ma collection',
            titleAccent: 'd\'album préférées',
            urCollection: 'Dans votre collection',
            highQuality: 'Haute qualité',
            toDiscover: 'À découvrir',
        },
        
        privacy: {
            title: 'Confidentialité & Analyses',
            whatWeCollect: 'Ce que nous collectons',
            anonymousDescription: 'Nous utilisons Plausible Analytics, un service d\'analyse respectueux de la vie privée et open-source. Toutes les données sont collectées de manière anonyme et agrégée.',
            noPersonalData: 'Aucune donnée personnelle ou information identifiable',
            noCookies: 'Aucun cookie stocké sur votre appareil',
            noTracking: 'Aucun suivi inter-sites ou inter-appareils',
            gdprCompliant: 'Conforme RGPD, CCPA et PECR',
            eventsTracked: 'Événements suivis',
            eventsDescription: 'Nous suivons les événements anonymes suivants pour améliorer l\'expérience utilisateur :',
            eventSearch: 'Lorsque vous effectuez une recherche',
            eventClick: 'Lorsque vous cliquez sur un résultat',
            eventFavorite: 'Lorsque vous ajoutez un album aux favoris',
            eventGift: 'Lorsque vous consultez le cadeau du jour',
            optOutTitle: 'Désactiver les analyses',
            optOutDescription: 'Vous pouvez désactiver le suivi analytique à tout moment. Votre préférence sera enregistrée localement sur votre appareil.',
            optedOut: 'Analyses désactivées',
            optIn: 'Désactiver les analyses',
            statusOptedOut: 'Le suivi analytique est actuellement désactivé pour vos visites.',
            statusOptedIn: 'Le suivi analytique est actuellement activé pour nous aider à améliorer l\'expérience.',
            learnMore: 'En savoir plus',
            plausibleInfo: 'En savoir plus sur les analyses respectueuses de la vie privée sur',
        },
    },
};
