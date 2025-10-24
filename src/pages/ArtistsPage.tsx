import { useState, useEffect } from 'react';
import { Outlet, useSearchParams, useNavigate } from 'react-router-dom';
import { 
    FaSearch, 
    FaUsers, 
    FaFilter,
    FaRandom,
    FaHeart,
    FaShare,
    FaExternalLinkAlt,
    FaMusic
} from 'react-icons/fa';
import { SearchBar } from '../components/SearchBar';
import { LoadingSpinner, SkeletonGrid } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorBoundary';
import { useSpotifySearch } from '../hooks/useSpotifySearch';
import { useFavorites } from '../hooks/useFavorites';
import { useShare } from '../hooks/useShare';
import { SpotifyArtist } from '../interfaces';
import { searchItem } from '../api/spotify';

export default function ArtistsPageImproved() {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    
    const [query, setQuery] = useState(searchParams.get('q') || '');
    const [selectedGenre, setSelectedGenre] = useState<string>('');
    const [sortBy, setSortBy] = useState<'relevance' | 'popularity' | 'name'>('relevance');
    const [showFilters, setShowFilters] = useState(false);
    const [isRandomSearching, setIsRandomSearching] = useState(false);
    
    const { favorites, toggleFavorite } = useFavorites();
    const { shareItem } = useShare();
    
    // Use the search hook for artists
    const { 
        data: searchResults, 
        isLoading, 
        isError, 
        error,
        search,
        clearResults
    } = useSpotifySearch({
        enabled: query.length > 0,
        staleTime: 5 * 60 * 1000 // 5 minutes
    });

    // Trigger search when query changes
    useEffect(() => {
        if (query.trim()) {
            search(query, 50, ['artist']);
        } else {
            clearResults();
        }
    }, [query, search, clearResults]);

    const artists = searchResults?.artists?.items || [];

    // Update URL when query changes
    useEffect(() => {
        if (query) {
            setSearchParams({ q: query });
        } else {
            setSearchParams({});
        }
    }, [query, setSearchParams]);

    // Load query from URL on mount
    useEffect(() => {
        const urlQuery = searchParams.get('q');
        if (urlQuery && urlQuery !== query) {
            setQuery(urlQuery);
        }
    }, [searchParams]);

    const handleSearch = (searchQuery: string) => {
        setQuery(searchQuery);
    };

    const handleClearSearch = () => {
        setQuery('');
        setSelectedGenre('');
        setSortBy('relevance');
    };

    const handleRandomSearch = async () => {
        const randomGenres = ['rock', 'pop', 'jazz', 'electronic', 'hip-hop', 'classical', 'blues', 'country', 'reggae', 'folk'];
        const randomGenre = randomGenres[Math.floor(Math.random() * randomGenres.length)];
        
        setIsRandomSearching(true);
        
        try {
            // Faire une recherche directe avec l'API Spotify
            const results = await searchItem(randomGenre, 50, ['artist']);
            
            // Si on a des résultats, sélectionner un artiste aléatoire
            if (results?.artists?.items && results.artists.items.length > 0) {
                const randomArtist = results.artists.items[Math.floor(Math.random() * results.artists.items.length)];
                // Naviguer directement vers l'artiste sélectionné
                navigate(`/artists/${randomArtist.id}`);
            } else {
                // Fallback: juste mettre à jour la query si pas de résultats
                setQuery(randomGenre);
            }
        } catch (error) {
            console.error('Error during random search:', error);
            // Fallback: juste mettre à jour la query en cas d'erreur
            setQuery(randomGenre);
        } finally {
            setIsRandomSearching(false);
        }
    };

    const handleFavoriteArtist = (artist: SpotifyArtist) => {
        toggleFavorite({
            id: artist.id,
            title: artist.name,
            artist: artist.name,
            image: artist.images?.[0]?.url || '',
            type: 'artist'
        });
    };

    const handleShareArtist = async (artist: SpotifyArtist) => {
        await shareItem({
            id: artist.id,
            title: artist.name,
            artist: artist.name,
            type: 'artist'
        });
    };

    const handleArtistClick = (artistId: string) => {
        navigate(`/artists/${artistId}`);
    };

    // Filter and sort artists
    const filteredAndSortedArtists = artists
        .filter(artist => {
            if (!selectedGenre) return true;
            return artist.genres?.some(genre => 
                genre.toLowerCase().includes(selectedGenre.toLowerCase())
            );
        })
        .sort((a, b) => {
            switch (sortBy) {
                case 'popularity':
                    return (b.popularity || 0) - (a.popularity || 0);
                case 'name':
                    return a.name.localeCompare(b.name);
                case 'relevance':
                default:
                    return 0; // Keep Spotify's relevance order
            }
        });

    // Get unique genres from results for filter
    const availableGenres = Array.from(
        new Set(
            artists.flatMap(artist => artist.genres || [])
        )
    ).slice(0, 10); // Limit to 10 most common genres

    return (
        <div className="artists-page-improved">
            {/* Search Header */}
            <div className="artists-search-header">
                <div className="container">
                    <div className="artists-search-title">
                        <h1>
                            <FaUsers /> Discover Artists
                        </h1>
                        <p>Search and explore your favorite music artists</p>
                    </div>
                    
                    <div className="artists-search-bar">
                        <SearchBar
                            placeholder="Search for artists (e.g., Beatles, Drake, Adele...)"
                            isTopPosition={false}
                            onSearch={handleSearch}
                            showSuggestions={true}
                        />
                    </div>

                    <div className="artists-search-actions">
                        <button 
                            onClick={handleRandomSearch}
                            className="artists-action-btn random-btn"
                            title="Random genre search"
                            disabled={isRandomSearching}
                        >
                            {isRandomSearching ? (
                                <>
                                    <LoadingSpinner size="small" /> Searching...
                                </>
                            ) : (
                                <>
                                    <FaRandom /> Surprise Me
                                </>
                            )}
                        </button>
                        
                        <button 
                            onClick={() => setShowFilters(!showFilters)}
                            className={`artists-action-btn filter-btn ${showFilters ? 'active' : ''}`}
                            title="Toggle filters"
                        >
                            <FaFilter /> Filters
                        </button>
                        
                        {query && (
                            <button 
                                onClick={handleClearSearch}
                                className="artists-action-btn clear-btn"
                                title="Clear search"
                            >
                                Clear
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Filters Panel */}
            {showFilters && (
                <div className="artists-filters-panel">
                    <div className="container">
                        <div className="artists-filters-content">
                            <div className="artists-filter-group">
                                <label>Genre:</label>
                                <select 
                                    value={selectedGenre} 
                                    onChange={(e) => setSelectedGenre(e.target.value)}
                                    className="artists-filter-select"
                                >
                                    <option value="">All Genres</option>
                                    {availableGenres.map(genre => (
                                        <option key={genre} value={genre}>
                                            {genre.charAt(0).toUpperCase() + genre.slice(1)}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            
                            <div className="artists-filter-group"> 
                              {/* artists */}
                                <label>Sort by:</label>
                                <select 
                                    value={sortBy} 
                                    onChange={(e) => setSortBy(e.target.value as any)}
                                    className="artists-filter-select"
                                >
                                    <option value="relevance">Relevance</option>
                                    <option value="popularity">Popularity</option>
                                    <option value="name">Name (A-Z)</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Results Section */}
            <div className="artists-results-section">
                <div className="container">
                    {!query ? (
                        <div className="artists-empty-state">
                            <div className="artists-empty-icon">
                                <FaSearch />
                            </div>
                            <h2>Search for Artists</h2>
                            <p>Enter an artist name to start discovering music</p>
                            <div className="artists-suggestions">
                                <p>Try searching for:</p>
                                <div className="artists-suggestion-tags">
                                    {['Beatles', 'Drake', 'Adele', 'Ed Sheeran', 'Taylor Swift'].map(suggestion => (
                                        <button 
                                            key={suggestion}
                                            onClick={() => setQuery(suggestion)}
                                            className="artists-suggestion-tag"
                                        >
                                            {suggestion}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : isLoading ? (
                        <div className="artists-loading">
                            <LoadingSpinner size="large" message="Searching artists..." />
                            <SkeletonGrid count={12} />
                        </div>
                    ) : isError ? (
                        <ErrorMessage 
                            error={error} 
                            onRetry={() => query && search(query, 50, ['artist'])}
                        />
                    ) : (
                        <>
                            {/* Results Info */}
                            <div className="artists-results-info">
                                <div className="artists-results-count">
                                    <strong>{filteredAndSortedArtists.length}</strong> 
                                    {filteredAndSortedArtists.length === 1 ? ' artist' : ' artists'} found
                                    {selectedGenre && (
                                        <span className="artists-filter-applied">
                                            in <strong>{selectedGenre}</strong>
                                        </span>
                                    )}
                                </div>
                                
                                {query && (
                                    <div className="artists-search-query">
                                        Results for: <strong>"{query}"</strong>
                                    </div>
                                )}
                            </div>

                            {/* Artists Grid */}
                            {filteredAndSortedArtists.length > 0 ? (
                                <div className="artists-grid">
                                    {filteredAndSortedArtists.map((artist) => (
                                        <div key={artist.id} className="artist-card-improved">
                                            <div className="artist-card-image">
                                                {artist.images?.[0] ? (
                                                    <img 
                                                        src={artist.images[0].url} 
                                                        alt={artist.name}
                                                        loading="lazy"
                                                    />
                                                ) : (
                                                    <div className="artist-card-placeholder">
                                                        <FaUsers />
                                                    </div>
                                                )}
                                                
                                                <div className="artist-card-overlay">
                                                    <button 
                                                        onClick={() => handleArtistClick(artist.id)}
                                                        className="artist-card-view-btn"
                                                        title="View artist details"
                                                    >
                                                        <FaMusic /> View Artist
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="artist-card-content">
                                                <h3 className="artist-card-name">
                                                    {artist.name}
                                                </h3>
                                                
                                                {artist.genres && artist.genres.length > 0 && (
                                                    <div className="artist-card-genres">
                                                        {artist.genres.slice(0, 2).map((genre, index) => (
                                                            <span key={index} className="artist-card-genre">
                                                                {genre}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}

                                                {artist.popularity && (
                                                    <div className="artist-card-popularity">
                                                        <div className="popularity-bar">
                                                            <div 
                                                                className="popularity-fill"
                                                                style={{ width: `${artist.popularity}%` }}
                                                            ></div>
                                                        </div>
                                                        <span className="popularity-text">
                                                            {artist.popularity}% popular
                                                        </span>
                                                    </div>
                                                )}

                                                <div className="artist-card-actions">
                                                    <button 
                                                        onClick={() => handleFavoriteArtist(artist)}
                                                        className={`artist-card-action ${favorites.has(artist.id) ? 'active' : ''}`}
                                                        title={favorites.has(artist.id) ? 'Remove from favorites' : 'Add to favorites'}
                                                    >
                                                        <FaHeart />
                                                    </button>
                                                    
                                                    <button 
                                                        onClick={() => handleShareArtist(artist)}
                                                        className="artist-card-action"
                                                        title="Share artist"
                                                    >
                                                        <FaShare />
                                                    </button>
                                                    
                                                    {artist.external_urls?.spotify && (
                                                        <a 
                                                            href={artist.external_urls.spotify}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="artist-card-action spotify-link"
                                                            title="Open in Spotify"
                                                        >
                                                            <FaExternalLinkAlt />
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="artists-no-results">
                                    <div className="artists-no-results-icon">
                                        <FaUsers />
                                    </div>
                                    <h3>No Artists Found</h3>
                                    <p>
                                        No artists match your search criteria.
                                        {selectedGenre && ' Try removing the genre filter or '}
                                        Try a different search term.
                                    </p>
                                    <div className="artists-no-results-actions">
                                        <button 
                                            onClick={handleClearSearch}
                                            className="btn-secondary"
                                        >
                                            Clear Search
                                        </button>
                                        <button 
                                            onClick={handleRandomSearch}
                                            className="btn-primary"
                                            disabled={isRandomSearching}
                                        >
                                            {isRandomSearching ? (
                                                <>
                                                    <LoadingSpinner size="small" /> Searching...
                                                </>
                                            ) : (
                                                <>
                                                    <FaRandom /> Try Random
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            <Outlet />
        </div>
    );
}
