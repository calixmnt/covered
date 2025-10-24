import { useState, useEffect, useCallback } from 'react';

interface FavoriteItem {
    id: string;
    title: string;
    artist: string;
    image: string;
    type: 'album' | 'track' | 'artist';
    addedAt: number;
}

interface UseFavoritesReturn {
    favorites: Set<string>;
    favoriteItems: FavoriteItem[];
    addFavorite: (item: Omit<FavoriteItem, 'addedAt'>) => void;
    removeFavorite: (id: string) => void;
    toggleFavorite: (item: Omit<FavoriteItem, 'addedAt'>) => void;
    isFavorite: (id: string) => boolean;
    clearFavorites: () => void;
    exportFavorites: () => string;
    importFavorites: (data: string) => boolean;
}

const STORAGE_KEY = 'covered-favorites';

export function useFavorites(): UseFavoritesReturn {
    const [favoriteItems, setFavoriteItems] = useState<FavoriteItem[]>([]);
    const [favorites, setFavorites] = useState<Set<string>>(new Set());

    // Load favorites from localStorage on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const items: FavoriteItem[] = JSON.parse(stored);
                setFavoriteItems(items);
                setFavorites(new Set(items.map(item => item.id)));
            }
        } catch (error) {
            console.error('Error loading favorites:', error);
        }
    }, []);

    // Save favorites to localStorage whenever they change
    const saveFavorites = useCallback((items: FavoriteItem[]) => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
        } catch (error) {
            console.error('Error saving favorites:', error);
        }
    }, []);

    const addFavorite = useCallback((item: Omit<FavoriteItem, 'addedAt'>) => {
        const newItem: FavoriteItem = {
            ...item,
            addedAt: Date.now()
        };

        setFavoriteItems(prev => {
            // Check if already exists
            if (prev.some(fav => fav.id === item.id)) {
                return prev;
            }
            const updated = [newItem, ...prev];
            saveFavorites(updated);
            return updated;
        });

        setFavorites(prev => new Set([...prev, item.id]));
    }, [saveFavorites]);

    const removeFavorite = useCallback((id: string) => {
        setFavoriteItems(prev => {
            const updated = prev.filter(item => item.id !== id);
            saveFavorites(updated);
            return updated;
        });

        setFavorites(prev => {
            const updated = new Set(prev);
            updated.delete(id);
            return updated;
        });
    }, [saveFavorites]);

    const toggleFavorite = useCallback((item: Omit<FavoriteItem, 'addedAt'>) => {
        if (favorites.has(item.id)) {
            removeFavorite(item.id);
        } else {
            addFavorite(item);
        }
    }, [favorites, addFavorite, removeFavorite]);

    const isFavorite = useCallback((id: string) => {
        return favorites.has(id);
    }, [favorites]);

    const clearFavorites = useCallback(() => {
        setFavoriteItems([]);
        setFavorites(new Set());
        localStorage.removeItem(STORAGE_KEY);
    }, []);

    const exportFavorites = useCallback(() => {
        return JSON.stringify({
            version: '1.0',
            exportedAt: Date.now(),
            favorites: favoriteItems
        }, null, 2);
    }, [favoriteItems]);

    const importFavorites = useCallback((data: string): boolean => {
        try {
            const parsed = JSON.parse(data);
            if (parsed.favorites && Array.isArray(parsed.favorites)) {
                setFavoriteItems(parsed.favorites);
                setFavorites(new Set(parsed.favorites.map((item: FavoriteItem) => item.id)));
                saveFavorites(parsed.favorites);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error importing favorites:', error);
            return false;
        }
    }, [saveFavorites]);

    return {
        favorites,
        favoriteItems,
        addFavorite,
        removeFavorite,
        toggleFavorite,
        isFavorite,
        clearFavorites,
        exportFavorites,
        importFavorites
    };
}
