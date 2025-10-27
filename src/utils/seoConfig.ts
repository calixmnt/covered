// Configuration SEO pour chaque page

export const seoConfig = {
    home: {
        title: 'Covered - Discover & Explore Album Artwork',
        description: 'Explore, zoom, and discover album covers like never before. Your personal gallery of music art with daily discoveries and high-quality artwork from Spotify.',
        image: 'https://covered.lavibeagency.com/og-image.jpg',
    },
    
    covers: {
        title: 'Explore Album Covers | Covered',
        description: 'Search and explore thousands of album covers from Spotify. Discover new music through stunning artwork and high-quality album art.',
        image: 'https://covered.lavibeagency.com/og-image.jpg',
    },

    favorites: {
        title: 'My Favorites | Covered',
        description: 'Your personal collection of favorite album covers. Browse, organize, and export your curated gallery of music artwork.',
        image: 'https://covered.lavibeagency.com/og-image.jpg',
    },
    
    gift: {
        title: 'Daily Musical Gift | Covered',
        description: 'Discover your daily musical gift - a new album recommendation every day. Explore curated music discoveries and expand your musical horizons.',
        image: 'https://covered.lavibeagency.com/og-image.jpg',
    },
    
    privacy: {
        title: 'Privacy & Analytics | Covered',
        description: 'Learn about our privacy-friendly analytics and how we protect your data. Opt-out options available.',
        image: 'https://covered.lavibeagency.com/og-image.jpg',
    },
    
    // Pour les pages dynamiques (album details)
    albumDetail: (albumName: string, artistName: string, imageUrl?: string) => ({
        title: `${albumName} by ${artistName} | Covered`,
        description: `Explore the album cover and details for "${albumName}" by ${artistName}. High-quality artwork and track information.`,
        image: imageUrl || 'https://covered.lavibeagency.com/og-image.jpg',
        type: 'music.album' as const,
    }),
};

export type SEOConfigKey = keyof typeof seoConfig;
