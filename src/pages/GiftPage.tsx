import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    FaGift, 
    FaHeart, 
    FaShare, 
    FaExternalLinkAlt,
    FaDiceSix,
    FaArrowLeft,
    FaTimes,
    FaHistory,
    FaCog,
    FaMusic,
    FaCalendarAlt
} from 'react-icons/fa';
import { searchItem } from '../api/spotify';
import { useFavorites } from '../hooks/useFavorites';
import { useShare } from '../hooks/useShare';
import { useLanguage } from '../contexts/LanguageContext';
import { trackEvent } from '../analytics';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { SpotifyAlbum } from '../interfaces';

interface GiftHistory {
    id: string;
    album: SpotifyAlbum;
    date: string;
    liked: boolean;
}

interface GiftPreferences {
    preferredGenres: string[];
    excludedGenres: string[];
    minTracks: number;
    albumTypes: string[];
}

const DEFAULT_PREFERENCES: GiftPreferences = {
    preferredGenres: [],
    excludedGenres: [],
    minTracks: 5,
    albumTypes: ['album']
};

export default function GiftPage() {
    const [giftAlbum, setGiftAlbum] = useState<SpotifyAlbum | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [giftDate, setGiftDate] = useState<string>('');
    const [showControls, setShowControls] = useState(true);
    const [showDetails, setShowDetails] = useState(false);
    const [showHistory, setShowHistory] = useState(false);
    const [showPreferences, setShowPreferences] = useState(false);
    const [giftHistory, setGiftHistory] = useState<GiftHistory[]>([]);
    const [preferences, setPreferences] = useState<GiftPreferences>(DEFAULT_PREFERENCES);
    
    const navigate = useNavigate();
    const { favorites, toggleFavorite } = useFavorites();
    const { shareItem } = useShare();
    const { t, language } = useLanguage();

    // Load preferences and history from localStorage
    useEffect(() => {
        const savedPreferences = localStorage.getItem('giftPreferences');
        const savedHistory = localStorage.getItem('giftHistory');
        
        if (savedPreferences) {
            setPreferences(JSON.parse(savedPreferences));
        }
        
        if (savedHistory) {
            setGiftHistory(JSON.parse(savedHistory));
        }
    }, []);

    const saveToHistory = useCallback((album: SpotifyAlbum) => {
        const historyItem: GiftHistory = {
            id: `${album.id}-${Date.now()}`,
            album,
            date: new Date().toISOString(),
            liked: false
        };
        
        const newHistory = [historyItem, ...giftHistory].slice(0, 50); // Keep last 50
        setGiftHistory(newHistory);
        localStorage.setItem('giftHistory', JSON.stringify(newHistory));
    }, [giftHistory]);

    const getRandomGenre = useCallback(() => {
        const allGenres = [
            'rock', 'pop', 'jazz', 'electronic', 'hip-hop', 'classical', 
            'blues', 'country', 'reggae', 'folk', 'indie', 'alternative',
            'soul', 'funk', 'disco', 'punk', 'metal', 'ambient', 'r&b',
            'latin', 'world', 'new age', 'gospel', 'ska', 'grunge'
        ];
        
        // Filter based on preferences
        const availableGenres = allGenres.filter(genre => 
            !preferences.excludedGenres.includes(genre)
        );
        
        // Prefer user's preferred genres if any
        if (preferences.preferredGenres.length > 0) {
            const preferredAvailable = preferences.preferredGenres.filter(genre => 
                availableGenres.includes(genre)
            );
            if (preferredAvailable.length > 0) {
                return preferredAvailable[Math.floor(Math.random() * preferredAvailable.length)];
            }
        }
        
        return availableGenres[Math.floor(Math.random() * availableGenres.length)];
    }, [preferences]);

    const getTodayKey = () => {
        const today = new Date();
        return `gift-${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
    };

    const fetchGiftAlbum = async (isRefresh = false) => {
        if (isRefresh) {
            setIsRefreshing(true);
        } else {
            setIsLoading(true);
        }
        setError(null);

        try {
            // Check if we already have a gift for today
            const todayKey = getTodayKey();
            const savedTodayGift = localStorage.getItem(todayKey);
            
            if (savedTodayGift && !isRefresh) {
                const savedAlbum = JSON.parse(savedTodayGift);
                setGiftAlbum(savedAlbum);
                setGiftDate(new Date().toLocaleDateString('fr-FR', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                }));
                setIsLoading(false);
                
                // Track album of the day view (cached)
                trackEvent('album_of_day_view');
                return;
            }

            const maxAttempts = 5;
            let validAlbum = null;

            for (let attempt = 0; attempt < maxAttempts; attempt++) {
                const randomGenre = getRandomGenre();
                const results = await searchItem(randomGenre, 50, ['album']);

                if (results?.albums?.items && results.albums.items.length > 0) {
                    // Filter for high-quality albums based on preferences
                    const validAlbums = results.albums.items.filter(album => 
                        album.images && 
                        album.images.length > 0 && 
                        album.name && 
                        album.artists && 
                        album.artists.length > 0 &&
                        album.total_tracks > preferences.minTracks &&
                        preferences.albumTypes.includes(album.album_type) &&
                        !giftHistory.some(h => h.album.id === album.id) // Avoid recent duplicates
                    );

                    if (validAlbums.length > 0) {
                        validAlbum = validAlbums[Math.floor(Math.random() * validAlbums.length)];
                        break;
                    }
                }
            }

            if (validAlbum) {
                setGiftAlbum(validAlbum);
                setGiftDate(new Date().toLocaleDateString('fr-FR', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                }));
                
                // Save today's gift
                localStorage.setItem(todayKey, JSON.stringify(validAlbum));
                
                saveToHistory(validAlbum);
                
                // Track album of the day view
                trackEvent('album_of_day_view');
            } else {
                setError('Unable to find a gift album. Please try again.');
            }
        } catch (err) {
            console.error('Error fetching gift album:', err);
            setError('An error occurred while finding your gift. Please try again.');
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        fetchGiftAlbum();
    }, []);

    // Hide controls after 3 seconds of inactivity
    useEffect(() => {
        const timer = setTimeout(() => setShowControls(false), 3000);
        return () => clearTimeout(timer);
    }, [showControls]);

    const handleMouseMove = () => {
        setShowControls(true);
    };

    const handleExitGift = () => {
        navigate(-1);
    };

    const handleFavorite = () => {
        if (giftAlbum) {
            toggleFavorite({
                id: giftAlbum.id,
                title: giftAlbum.name,
                artist: giftAlbum.artists[0]?.name || 'Unknown Artist',
                image: giftAlbum.images[0]?.url || '',
                type: 'album'
            });
            
            // Update history to mark as liked
            const updatedHistory = giftHistory.map(item => 
                item.album.id === giftAlbum.id 
                    ? { ...item, liked: !item.liked }
                    : item
            );
            setGiftHistory(updatedHistory);
            localStorage.setItem('giftHistory', JSON.stringify(updatedHistory));
        }
    };

    const updatePreferences = (newPreferences: GiftPreferences) => {
        setPreferences(newPreferences);
        localStorage.setItem('giftPreferences', JSON.stringify(newPreferences));
    };

    const clearHistory = () => {
        setGiftHistory([]);
        localStorage.removeItem('giftHistory');
    };

    const loadHistoryItem = (historyItem: GiftHistory) => {
        setGiftAlbum(historyItem.album);
        const locale = language === 'fr' ? 'fr-FR' : 'en-US';
        setGiftDate(new Date(historyItem.date).toLocaleDateString(locale, {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }));
        setShowHistory(false);
    };

    const handleShare = async () => {
        if (giftAlbum) {
            await shareItem({
                id: giftAlbum.id,
                title: giftAlbum.name,
                artist: giftAlbum.artists[0]?.name || 'Unknown Artist',
                type: 'album'
            });
        }
    };


    const formatReleaseDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.getFullYear();
    };

    if (isLoading) {
        return (
            <div className="gift-immersive">
                <div className="gift-loading">
                    <LoadingSpinner size="large" message={t.gift.loading} />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="gift-immersive">
                <div className="gift-minimal-header">
                    <button onClick={handleExitGift} className="gift-exit-btn">
                        <FaArrowLeft />
                        <span>{t.common.back}</span>
                    </button>
                </div>
                
                <div className="gift-error-state">
                    <div className="gift-error-content">
                        <FaGift className="gift-error-icon" />
                        <h2>{t.gift.error}</h2>
                        <p>{t.gift.errorMessage}</p>
                        <button 
                            onClick={() => fetchGiftAlbum()}
                            className="gift-retry-btn"
                        >
                            {t.common.retry}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (!giftAlbum) {
        return (
            <div className="gift-immersive">
                <div className="gift-minimal-header">
                    <button onClick={handleExitGift} className="gift-exit-btn">
                        <FaArrowLeft />
                        <span>{t.common.back}</span>
                    </button>
                </div>
                
                <div className="gift-error-state">
                    <div className="gift-error-content">
                        <FaGift className="gift-error-icon" />
                        <h2>{t.gift.noGiftTitle}</h2>
                        <p>{t.gift.noGiftDesc}</p>
                        <button 
                            onClick={() => fetchGiftAlbum()}
                            className="gift-retry-btn"
                        >
                            {t.gift.unwrapGift}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const isFavorite = favorites.has(giftAlbum.id);

    return (
        <div className="gift-immersive" onMouseMove={handleMouseMove}>
            {/* Minimal Header */}
            <div className={`gift-minimal-header ${showControls ? 'visible' : 'hidden'}`}>
                <button onClick={handleExitGift} className="gift-exit-btn">
                    <FaArrowLeft />
                    <span>{t.common.back}</span>
                </button>
                
                <div className="gift-date-minimal">
                    <span>{giftDate}</span>
                </div>
                
                <div className="gift-header-actions">
                    <button 
                        onClick={() => setShowHistory(true)}
                        className="gift-header-btn"
                        title={t.gift.history}
                    >
                        <FaHistory />
                    </button>
                    
                    <button 
                        onClick={() => setShowPreferences(true)}
                        className="gift-header-btn"
                        title={t.gift.preferences}
                    >
                        <FaCog />
                    </button>
                    
                    <button 
                        onClick={() => fetchGiftAlbum(true)}
                        className="gift-refresh-btn"
                        disabled={isRefreshing}
                        title={t.gift.refresh}
                    >
                        <FaDiceSix className={isRefreshing ? 'spinning' : ''} />
                    </button>
                </div>
            </div>

            {/* Immersive Gift Display */}
            <div className="gift-immersive-content">
                <div className="gift-immersive-album">
                    <div 
                        className="gift-album-cover"
                        onClick={() => setShowDetails(!showDetails)}
                    >
                        <img 
                            src={giftAlbum.images[0]?.url} 
                            alt={giftAlbum.name}
                        />
                        <div className="gift-cover-overlay">
                            <FaGift className="gift-overlay-icon" />
                        </div>
                    </div>
                    
                    <div className={`gift-album-info ${showDetails ? 'expanded' : ''}`}>
                        <h1>{giftAlbum.name}</h1>
                        <h2>{giftAlbum.artists[0]?.name}</h2>
                        <p className="gift-release-year">{formatReleaseDate(giftAlbum.release_date)}</p>
                        
                        <div className="gift-actions">
                            <button 
                                onClick={handleFavorite}
                                className={`gift-action-btn ${isFavorite ? 'active' : ''}`}
                                title={isFavorite ? t.coverDetails.removeFromFavorites : t.coverDetails.addToFavorites}
                            >
                                <FaHeart />
                                <span>{isFavorite ? t.gift.liked : t.gift.like}</span>
                            </button>
                            
                            <button 
                                onClick={handleShare} 
                                className="gift-action-btn"
                                title={t.gift.shareTitle}
                            >
                                <FaShare />
                                <span>{t.coverDetails.share}</span>
                            </button>
                            
                            {giftAlbum.external_urls?.spotify && (
                                <a 
                                    href={giftAlbum.external_urls.spotify}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="gift-action-btn"
                                    title={t.coverDetails.openInSpotify}
                                >
                                    <FaExternalLinkAlt />
                                    <span>Spotify</span>
                                </a>
                            )}
                        </div>
                    </div>
                </div>
                
                {/* Gift Message */}
                <div className="gift-message">
                    <FaGift className="gift-message-icon" />
                    <p>{t.gift.dailyDiscovery}</p>
                </div>
            </div>

            {/* Details Modal */}
            {showDetails && (
                <div className="gift-details-modal">
                    <div className="gift-details-overlay" onClick={() => setShowDetails(false)} />
                    
                    <div className="gift-details-content">
                        <button 
                            className="gift-details-close"
                            onClick={() => setShowDetails(false)}
                        >
                            <FaTimes />
                        </button>

                        <div className="gift-details-info">
                            <img 
                                src={giftAlbum.images[0]?.url} 
                                alt={giftAlbum.name}
                            />
                            <div className="gift-details-text">
                                <h2>{giftAlbum.name}</h2>
                                <p>{giftAlbum.artists[0]?.name}</p>
                                <div className="gift-details-meta">
                                    <span>{t.coverDetails.released}: {formatReleaseDate(giftAlbum.release_date)}</span>
                                    <span>{t.coverDetails.tracks}: {giftAlbum.total_tracks}</span>
                                    <span>{t.gift.type}: {giftAlbum.album_type}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* History Modal */}
            {showHistory && (
                <div className="gift-modal">
                    <div className="gift-modal-overlay" onClick={() => setShowHistory(false)} />
                    
                    <div className="gift-modal-content">
                        <div className="gift-modal-header">
                            <h2><FaHistory /> {t.gift.historyTitle}</h2>
                            <button 
                                className="gift-modal-close"
                                onClick={() => setShowHistory(false)}
                            >
                                <FaTimes />
                            </button>
                        </div>
                        
                        <div className="gift-modal-body">
                            {giftHistory.length === 0 ? (
                                <div className="gift-empty-state">
                                    <FaGift className="gift-empty-icon" />
                                    <p>{t.gift.historyEmpty}</p>
                                    <small>{t.gift.historyEmptyDesc}</small>
                                </div>
                            ) : (
                                <>
                                    <div className="gift-history-actions">
                                        <button 
                                            onClick={clearHistory}
                                            className="gift-clear-btn"
                                        >
                                            {t.gift.clearHistory}
                                        </button>
                                    </div>
                                    
                                    <div className="gift-history-list">
                                        {giftHistory.map((item) => (
                                            <div 
                                                key={item.id} 
                                                className="gift-history-item"
                                                onClick={() => loadHistoryItem(item)}
                                            >
                                                <img 
                                                    src={item.album.images[0]?.url} 
                                                    alt={item.album.name}
                                                />
                                                <div className="gift-history-info">
                                                    <h4>{item.album.name}</h4>
                                                    <p>{item.album.artists[0]?.name}</p>
                                                    <small>
                                                        <FaCalendarAlt /> {new Date(item.date).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US')}
                                                    </small>
                                                </div>
                                                {item.liked && (
                                                    <FaHeart className="gift-history-liked" />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Preferences Modal */}
            {showPreferences && (
                <div className="gift-modal">
                    <div className="gift-modal-overlay" onClick={() => setShowPreferences(false)} />
                    
                    <div className="gift-modal-content gift-preferences-modal">
                        <div className="gift-modal-header">
                            <h2><FaCog /> {t.gift.preferencesTitle}</h2>
                            <button 
                                className="gift-modal-close"
                                onClick={() => setShowPreferences(false)}
                            >
                                <FaTimes />
                            </button>
                        </div>
                        
                        <div className="gift-modal-body">
                            <div className="gift-preference-section">
                                <h3><FaMusic /> {t.gift.preferredGenres}</h3>
                                <p>{t.gift.preferredGenresDesc}</p>
                                <div className="gift-genre-grid">
                                    {['rock', 'pop', 'jazz', 'electronic', 'hip-hop', 'classical', 'blues', 'country', 'reggae', 'folk', 'indie', 'alternative'].map(genre => (
                                        <button
                                            key={genre}
                                            className={`gift-genre-btn ${
                                                preferences.preferredGenres.includes(genre) ? 'active' : ''
                                            }`}
                                            onClick={() => {
                                                const newPreferred = preferences.preferredGenres.includes(genre)
                                                    ? preferences.preferredGenres.filter(g => g !== genre)
                                                    : [...preferences.preferredGenres, genre];
                                                updatePreferences({ ...preferences, preferredGenres: newPreferred });
                                            }}
                                        >
                                            {t.gift.genres[genre as keyof typeof t.gift.genres]}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            
                            <div className="gift-preference-section">
                                <h3>{t.gift.minTracks}</h3>
                                <p>{t.gift.minTracksDesc}</p>
                                <div className="gift-range-input">
                                    <input
                                        type="range"
                                        min="3"
                                        max="20"
                                        value={preferences.minTracks}
                                        onChange={(e) => updatePreferences({ 
                                            ...preferences, 
                                            minTracks: parseInt(e.target.value) 
                                        })}
                                    />
                                    <span>{preferences.minTracks} {t.coverDetails.tracks}</span>
                                </div>
                            </div>
                            
                            <div className="gift-preference-section">
                                <h3>{t.gift.albumTypes}</h3>
                                <div className="gift-checkbox-group">
                                    {[{ value: 'album', label: t.gift.albumTypesAlbum }, { value: 'single', label: t.gift.albumTypesSingle }].map(type => (
                                        <label key={type.value} className="gift-checkbox-label">
                                            <input
                                                type="checkbox"
                                                checked={preferences.albumTypes.includes(type.value)}
                                                onChange={(e) => {
                                                    const newTypes = e.target.checked
                                                        ? [...preferences.albumTypes, type.value]
                                                        : preferences.albumTypes.filter(t => t !== type.value);
                                                    updatePreferences({ ...preferences, albumTypes: newTypes });
                                                }}
                                            />
                                            <span>{type.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
