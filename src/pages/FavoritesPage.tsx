import React, { useState } from 'react';
import { FaHeart, FaDownload, FaUpload, FaTrash } from 'react-icons/fa';
import { useFavorites } from '../hooks/useFavorites';
import { useShare } from '../hooks/useShare';
import { CoverImproved } from '../components/CoverImproved';
import { ErrorMessage } from '../components/ErrorBoundary';

export default function FavoritesPage() {
    const { favoriteItems, removeFavorite, clearFavorites, exportFavorites, importFavorites } = useFavorites();
    const { shareItem } = useShare();
    const [filter, setFilter] = useState<'all' | 'album' | 'track' | 'artist'>('all');
    const [sortBy, setSortBy] = useState<'recent' | 'alphabetical' | 'type'>('recent');
    const [showConfirmClear, setShowConfirmClear] = useState(false);
    const [importError, setImportError] = useState<string | null>(null);

    const handleExport = () => {
        const data = exportFavorites();
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `covered-favorites-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target?.result as string;
            const success = importFavorites(content);
            if (!success) {
                setImportError('Invalid file format. Please select a valid favorites export file.');
            } else {
                setImportError(null);
            }
        };
        reader.readAsText(file);
        event.target.value = ''; // Reset input
    };

    const handleShare = async (id: string) => {
        const item = favoriteItems.find(fav => fav.id === id);
        if (item) {
            await shareItem({
                id: item.id,
                title: item.title,
                artist: item.artist,
                type: item.type,
                image: item.image
            });
        }
    };

    const filteredFavorites = favoriteItems.filter(item => {
        if (filter === 'all') return true;
        return item.type === filter;
    });

    const sortedFavorites = [...filteredFavorites].sort((a, b) => {
        switch (sortBy) {
            case 'alphabetical':
                return a.title.localeCompare(b.title);
            case 'type':
                return a.type.localeCompare(b.type);
            case 'recent':
            default:
                return b.addedAt - a.addedAt;
        }
    });

    const coversData = sortedFavorites.map(item => ({
        id: item.id,
        image: item.image,
        title: item.title,
        artist: item.artist,
        albumType: item.type as 'album' | 'single' | 'compilation'
    }));

    if (favoriteItems.length === 0) {
        return (
            <div className="favorites-page">
                <div className="container">
                    <div className="favorites-empty">
                        <FaHeart className="favorites-empty__icon" />
                        <h2>No Favorites Yet</h2>
                        <p>Start exploring music and add your favorite albums, tracks, and artists!</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="favorites-page">
            <div className="container">
                <div className="favorites-header">
                    <div className="favorites-title">
                        <FaHeart className="favorites-title__icon" />
                        <h1>My Favorites</h1>
                        <span className="favorites-count">({favoriteItems.length})</span>
                    </div>

                    <div className="favorites-actions">
                        <button onClick={handleExport} className="favorites-action-btn">
                            <FaDownload /> Export
                        </button>
                        
                        <label className="favorites-action-btn">
                            <FaUpload /> Import
                            <input
                                type="file"
                                accept=".json"
                                onChange={handleImport}
                                style={{ display: 'none' }}
                            />
                        </label>

                        <button 
                            onClick={() => setShowConfirmClear(true)}
                            className="favorites-action-btn danger"
                        >
                            <FaTrash /> Clear All
                        </button>
                    </div>
                </div>

                {importError && (
                    <ErrorMessage 
                        error={new Error(importError)} 
                        onRetry={() => setImportError(null)}
                    />
                )}

                <div className="favorites-controls">
                    <div className="favorites-filters">
                        <label>Filter by type:</label>
                        <select 
                            value={filter} 
                            onChange={(e) => setFilter(e.target.value as any)}
                            className="favorites-select"
                        >
                            <option value="all">All ({favoriteItems.length})</option>
                            <option value="album">Albums ({favoriteItems.filter(f => f.type === 'album').length})</option>
                            <option value="track">Tracks ({favoriteItems.filter(f => f.type === 'track').length})</option>
                            <option value="artist">Artists ({favoriteItems.filter(f => f.type === 'artist').length})</option>
                        </select>
                    </div>

                    <div className="favorites-sort">
                        <label>Sort by:</label>
                        <select 
                            value={sortBy} 
                            onChange={(e) => setSortBy(e.target.value as any)}
                            className="favorites-select"
                        >
                            <option value="recent">Recently Added</option>
                            <option value="alphabetical">Alphabetical</option>
                            <option value="type">Type</option>
                        </select>
                    </div>
                </div>

                {sortedFavorites.length > 0 ? (
                    <div className="favorites-grid">
                        {coversData.map((cover) => (
                            <CoverImproved
                                key={cover.id}
                                {...cover}
                                onFavorite={removeFavorite}
                                onShare={handleShare}
                                isFavorite={true}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="favorites-empty">
                        <p>No favorites match the current filter.</p>
                    </div>
                )}

                {showConfirmClear && (
                    <div className="favorites-modal-overlay">
                        <div className="favorites-modal">
                            <h3>Clear All Favorites?</h3>
                            <p>This action cannot be undone. All your favorite items will be permanently removed.</p>
                            <div className="favorites-modal-actions">
                                <button 
                                    onClick={() => setShowConfirmClear(false)}
                                    className="favorites-modal-btn secondary"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={() => {
                                        clearFavorites();
                                        setShowConfirmClear(false);
                                    }}
                                    className="favorites-modal-btn danger"
                                >
                                    Clear All
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
