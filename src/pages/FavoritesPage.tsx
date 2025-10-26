import { useState, useEffect } from 'react';
import { 
    FaHeart, 
    FaDownload, 
    FaUpload, 
    FaTrash, 
    FaImages,
    FaTh,
    FaTimes,
    FaChevronLeft,
    FaChevronRight,
    FaShare,
    FaPlay,
    FaRandom,
    FaSortAmountDown
} from 'react-icons/fa';
import { useFavorites } from '../hooks/useFavorites';
import { useShare } from '../hooks/useShare';
import { useLanguage } from '../contexts/LanguageContext';
import { CoverImproved } from '../components/CoverImproved';
import { ErrorMessage } from '../components/ErrorBoundary';
// import { LoadingSpinner } from '../components/LoadingSpinner';

type ViewMode = 'list' | 'gallery';
type SortMode = 'recent' | 'alphabetical' | 'type' | 'random';

export default function FavoritesPage() {
    const { favoriteItems, removeFavorite, clearFavorites, exportFavorites, importFavorites } = useFavorites();
    const { shareItem } = useShare();
    const { t } = useLanguage();
    
    const [viewMode, setViewMode] = useState<ViewMode>('list');
    const [filter, setFilter] = useState<'all' | 'album' | 'track' | 'artist'>('all');
    const [sortBy, setSortBy] = useState<SortMode>('recent');
    const [showConfirmClear, setShowConfirmClear] = useState(false);
    const [importError, setImportError] = useState<string | null>(null);
    const [selectedCover, setSelectedCover] = useState<number | null>(null);
    const [showControls, setShowControls] = useState(true);
    const [randomizedCovers, setRandomizedCovers] = useState<any[]>([]);

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

    // For gallery mode, only show albums and tracks with images
    const galleryItems = favoriteItems.filter(item => 
        (item.type === 'album' || item.type === 'track') && item.image
    );

    const filteredFavorites = (viewMode === 'gallery' ? galleryItems : favoriteItems).filter(item => {
        if (filter === 'all') return true;
        return item.type === filter;
    });

    useEffect(() => {
        if (sortBy === 'random') {
            setRandomizedCovers([...filteredFavorites].sort(() => Math.random() - 0.5));
        }
    }, [sortBy, favoriteItems, filter]);

    // Hide controls after 3 seconds in gallery mode
    useEffect(() => {
        if (viewMode === 'gallery') {
            const timer = setTimeout(() => setShowControls(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [showControls, viewMode]);

    const sortedFavorites = [...filteredFavorites].sort((a, b) => {
        switch (sortBy) {
            case 'alphabetical':
                return a.title.localeCompare(b.title);
            case 'type':
                return a.type.localeCompare(b.type);
            case 'random':
                return 0; // Will use randomizedCovers
            case 'recent':
            default:
                return b.addedAt - a.addedAt;
        }
    });

    const displayedFavorites = sortBy === 'random' ? randomizedCovers : sortedFavorites;

    const coversData = displayedFavorites.map(item => ({
        id: item.id,
        image: item.image,
        title: item.title,
        artist: item.artist,
        albumType: item.type as 'album' | 'single' | 'compilation'
    }));

    const handleMouseMove = () => {
        if (viewMode === 'gallery') {
            setShowControls(true);
        }
    };

    const navigateFullscreen = (direction: 'prev' | 'next') => {
        if (selectedCover === null) return;
        
        if (direction === 'prev') {
            setSelectedCover(selectedCover > 0 ? selectedCover - 1 : displayedFavorites.length - 1);
        } else {
            setSelectedCover(selectedCover < displayedFavorites.length - 1 ? selectedCover + 1 : 0);
        }
    };

    const handleShareCover = async (cover: any) => {
        await shareItem({
            id: cover.id,
            title: cover.title,
            artist: cover.artist,
            type: cover.type,
            image: cover.image
        });
    };

    // Empty state
    if (favoriteItems.length === 0) {
        return (
            <div className="favorites-page">
                <div className="container">
                    <div className="favorites-empty">
                        <FaHeart className="favorites-empty__icon" />
                        <h2>{t.favorites.empty}</h2>
                        <p>{t.favorites.emptyDesc}</p>
                    </div>
                </div>
            </div>
        );
    }

    // Gallery Mode
    if (viewMode === 'gallery') {
        if (galleryItems.length === 0) {
            return (
                <div className="gallery-immersive">
                    <div className="gallery-minimal-header">
                        <button onClick={() => setViewMode('list')} className="gallery-exit-btn">
                            <FaTh />
                            <span>{t.favorites.backToList}</span>
                        </button>
                    </div>
                    
                    <div className="gallery-empty-state">
                        <div className="gallery-empty-content">
                            <FaHeart className="gallery-empty-icon" />
                            <h2>{t.gallery.emptyTitle}</h2>
                            <p>{t.gallery.emptyDesc}</p>
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div className="gallery-immersive" onMouseMove={handleMouseMove}>
                {/* Minimal Header */}
                <div className={`gallery-minimal-header ${showControls ? 'visible' : 'hidden'}`}>
                    <button onClick={() => setViewMode('list')} className="gallery-exit-btn">
                        <FaTh />
                        <span>{t.favorites.backToList}</span>
                    </button>
                    
                    <div className="gallery-sort-minimal">
                        <button 
                            onClick={() => setSortBy(sortBy === 'recent' ? 'random' : 'recent')}
                            className="gallery-sort-toggle"
                            title={sortBy === 'recent' ? t.gallery.switchToRandom : t.gallery.switchToRecent}
                        >
                            {sortBy === 'recent' ? <FaRandom /> : <FaSortAmountDown />}
                        </button>
                    </div>
                </div>

                {/* Gallery Grid */}
                <div className="gallery-immersive-grid">
                    {displayedFavorites.map((cover, index) => (
                        <div 
                            key={`${cover.id}-${index}`}
                            className="gallery-immersive-item"
                            onClick={() => setSelectedCover(index)}
                        >
                            <img 
                                src={cover.image} 
                                alt={cover.title}
                                loading="lazy"
                            />
                            <div className="gallery-item-overlay">
                                <div className="gallery-item-info">
                                    <h3>{cover.title}</h3>
                                    <p>{cover.artist}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Fullscreen Modal */}
                {selectedCover !== null && (
                    <div className="gallery-fullscreen-modal">
                        <div className="gallery-fullscreen-overlay" onClick={() => setSelectedCover(null)} />
                        
                        <div className="gallery-fullscreen-content">
                            <button 
                                className="gallery-fullscreen-close"
                                onClick={() => setSelectedCover(null)}
                            >
                                <FaTimes />
                            </button>

                            <button 
                                className="gallery-fullscreen-nav prev"
                                onClick={() => navigateFullscreen('prev')}
                            >
                                <FaChevronLeft />
                            </button>

                            <div className="gallery-fullscreen-item">
                                <img 
                                    src={displayedFavorites[selectedCover]?.image}
                                    alt={displayedFavorites[selectedCover]?.title}
                                />
                                <div className="gallery-fullscreen-info">
                                    <h2>{displayedFavorites[selectedCover]?.title}</h2>
                                    <p>{displayedFavorites[selectedCover]?.artist}</p>
                                    <div className="gallery-fullscreen-actions">
                                        <button 
                                            onClick={() => handleShareCover(displayedFavorites[selectedCover])}
                                            className="gallery-fullscreen-btn"
                                        >
                                            <FaShare /> {t.coverDetails.share}
                                        </button>
                                        <button className="gallery-fullscreen-btn">
                                            <FaPlay /> {t.gallery.play}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <button 
                                className="gallery-fullscreen-nav next"
                                onClick={() => navigateFullscreen('next')}
                            >
                                <FaChevronRight />
                            </button>

                            <div className="gallery-fullscreen-counter">
                                {selectedCover + 1} / {displayedFavorites.length}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // List Mode

    return (
        <div className="favorites-page">
            <div className="container">
                <div className="favorites-header">
                    <div className="favorites-title">
                        <FaHeart className="favorites-title__icon" />
                        <h1>{t.favorites.title}</h1>
                        <span className="favorites-count">({favoriteItems.length})</span>
                    </div>

                    <div className="favorites-actions">
                        {galleryItems.length > 0 && (
                            <button 
                                onClick={() => setViewMode('gallery')} 
                                className="favorites-action-btn primary"
                                title={t.favorites.galleryView}
                            >
                                <FaImages /> {t.favorites.galleryView}
                            </button>
                        )}
                        
                        <button onClick={handleExport} className="favorites-action-btn">
                            <FaDownload /> {t.favorites.export}
                        </button>
                        
                        <label className="favorites-action-btn">
                            <FaUpload /> {t.favorites.import}
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
                            <FaTrash /> {t.favorites.clear}
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
                        <label>{t.favorites.filterByType}:</label>
                        <select 
                            value={filter} 
                            onChange={(e) => setFilter(e.target.value as any)}
                            className="favorites-select"
                        >
                            <option value="all">{t.favorites.all} ({favoriteItems.length})</option>
                            <option value="album">{t.favorites.albums} ({favoriteItems.filter(f => f.type === 'album').length})</option>
                            <option value="track">{t.favorites.tracks} ({favoriteItems.filter(f => f.type === 'track').length})</option>
                            <option value="artist">{t.favorites.artists} ({favoriteItems.filter(f => f.type === 'artist').length})</option>
                        </select>
                    </div>

                    <div className="favorites-sort">
                        <label>{t.gallery.sortBy}:</label>
                        <select 
                            value={sortBy} 
                            onChange={(e) => setSortBy(e.target.value as any)}
                            className="favorites-select"
                        >
                            <option value="recent">{t.gallery.sortRecent}</option>
                            <option value="alphabetical">{t.favorites.alphabetical}</option>
                            <option value="type">{t.favorites.byType}</option>
                            <option value="random">{t.favorites.random}</option>
                        </select>
                    </div>
                </div>

                {displayedFavorites.length > 0 ? (
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
                        <p>{t.favorites.noMatch}</p>
                    </div>
                )}

                {showConfirmClear && (
                    <div className="favorites-modal-overlay">
                        <div className="favorites-modal">
                            <h3>{t.favorites.clearConfirm}</h3>
                            <p>{t.favorites.clearWarning}</p>
                            <div className="favorites-modal-actions">
                                <button 
                                    onClick={() => setShowConfirmClear(false)}
                                    className="favorites-modal-btn secondary"
                                >
                                    {t.common.cancel}
                                </button>
                                <button 
                                    onClick={() => {
                                        clearFavorites();
                                        setShowConfirmClear(false);
                                    }}
                                    className="favorites-modal-btn danger"
                                >
                                    {t.favorites.clear}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
