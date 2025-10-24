import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
    FaArrowLeft, 
    FaHeart, 
    FaShare, 
    FaPlay,
    FaExternalLinkAlt,
    FaMusic,
    FaCompactDisc,
    FaUsers
} from 'react-icons/fa';
import { useArtistPageData } from '../hooks/useSpotifyData';
import { useFavorites } from '../hooks/useFavorites';
import { useShare } from '../hooks/useShare';
import { LoadingSpinner, SkeletonGrid } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorBoundary';
import { CoverGrid } from '../components/CoverImproved';
import FilterZone from '../components/FilterZone';
import { Filter } from '../interfaces';
import { filterSpotifyItems } from '../utils';

export default function ArtistPageImproved() {
    const { artistId } = useParams<{ artistId: string }>();
    const navigate = useNavigate();
    
    const [activeFilter, setActiveFilter] = useState<Filter>('all');
    const [showAllAlbums, setShowAllAlbums] = useState(false);
    
    const { artist, albums, topTracks, relatedArtists, isLoading, hasError, error } = useArtistPageData(artistId);
    const { favorites, toggleFavorite } = useFavorites();
    const { shareItem } = useShare();

    const handleBack = () => {
        navigate(-1);
    };

    const handleFavoriteArtist = () => {
        if (artist.data) {
            toggleFavorite({
                id: artist.data.id,
                title: artist.data.name,
                artist: artist.data.name,
                image: artist.data.images?.[0]?.url || '',
                type: 'artist'
            });
        }
    };

    const handleShareArtist = async () => {
        if (artist.data) {
            await shareItem({
                id: artist.data.id,
                title: artist.data.name,
                artist: artist.data.name,
                type: 'artist'
            });
        }
    };

    const handleFavoriteAlbum = (albumId: string) => {
        const album = albums.data?.items.find(a => a.id === albumId);
        if (album) {
            toggleFavorite({
                id: album.id,
                title: album.name,
                artist: album.artists[0]?.name || '',
                image: album.images?.[0]?.url || '',
                type: 'album'
            });
        }
    };

    const handleShareAlbum = async (albumId: string, title: string, artistName: string) => {
        await shareItem({
            id: albumId,
            title,
            artist: artistName,
            type: 'album'
        });
    };

    if (!artistId) {
        return (
            <div className="container">
                <div className="artist-page-error">
                    <h2>Invalid Artist ID</h2>
                    <p>Please check the URL and try again.</p>
                    <button onClick={handleBack} className="btn-primary">
                        <FaArrowLeft /> Go Back
                    </button>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="artist-page-loading">
                <LoadingSpinner size="large" message="Loading artist details..." />
                <div className="container">
                    <SkeletonGrid count={8} />
                </div>
            </div>
        );
    }

    if (hasError || !artist.data) {
        return (
            <div className="container">
                <ErrorMessage 
                    error={error || new Error('Artist not found')} 
                    onRetry={() => window.location.reload()}
                />
            </div>
        );
    }

    const artistData = artist.data;
    const isArtistFavorite = favorites.has(artistData.id);
    
    // Filter albums
    const filteredAlbums = filterSpotifyItems(
        albums.data?.items || [],
        activeFilter
    );

    // Prepare albums data for CoverGrid
    const albumsToShow = showAllAlbums ? filteredAlbums : filteredAlbums.slice(0, 12);
    const coversData = albumsToShow.map(album => ({
        id: album.id,
        image: album.images?.[0]?.url || '',
        title: album.name,
        artist: album.artists?.[0]?.name || artistData.name,
        releaseDate: album.release_date,
        albumType: album.album_type as 'album' | 'single' | 'compilation'
    }));

    return (
        <div className="artist-page-improved">
            {/* Header with back button */}
            <div className="artist-page-header">
                <div className="container">
                    <button onClick={handleBack} className="artist-page-back-btn">
                        <FaArrowLeft /> Back to Search
                    </button>
                </div>
            </div>

            {/* Artist Hero Section */}
            <div className="artist-hero">
                <div className="artist-hero__background">
                    {artistData.images?.[0] && (
                        <img 
                            src={artistData.images[0].url} 
                            alt={artistData.name}
                            className="artist-hero__bg-image"
                        />
                    )}
                    <div className="artist-hero__overlay"></div>
                </div>

                <div className="container">
                    <div className="artist-hero__content">
                        <div className="artist-hero__info">
                            <div className="artist-hero__image-container">
                                {artistData.images?.[0] ? (
                                    <img 
                                        src={artistData.images[0].url} 
                                        alt={artistData.name}
                                        className="artist-hero__image"
                                    />
                                ) : (
                                    <div className="artist-hero__image-placeholder">
                                        <FaUsers />
                                    </div>
                                )}
                            </div>

                            <div className="artist-hero__details">
                                <h1 className="artist-hero__name">{artistData.name}</h1>
                                
                                {artistData.genres && artistData.genres.length > 0 && (
                                    <div className="artist-hero__genres">
                                        {artistData.genres.slice(0, 3).map((genre, index) => (
                                            <span key={index} className="artist-hero__genre">
                                                {genre}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                <div className="artist-hero__stats">
                                    <div className="artist-hero__stat">
                                        <FaCompactDisc />
                                        <span>{albums.data?.total || 0} Albums</span>
                                    </div>
                                    {topTracks.data && (
                                        <div className="artist-hero__stat">
                                            <FaMusic />
                                            <span>{topTracks.data.tracks.length} Top Tracks</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="artist-hero__actions">
                            <button 
                                onClick={handleFavoriteArtist}
                                className={`artist-hero__action-btn ${isArtistFavorite ? 'active' : ''}`}
                                title={isArtistFavorite ? 'Remove from favorites' : 'Add to favorites'}
                            >
                                <FaHeart />
                                {isArtistFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                            </button>
                            
                            <button 
                                onClick={handleShareArtist}
                                className="artist-hero__action-btn"
                                title="Share this artist"
                            >
                                <FaShare />
                                Share Artist
                            </button>
                            
                            {artistData.external_urls?.spotify && (
                                <a 
                                    href={artistData.external_urls.spotify}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="artist-hero__action-btn spotify-btn"
                                >
                                    <FaExternalLinkAlt />
                                    Open in Spotify
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Top Tracks Section */}
            {topTracks.data && topTracks.data.tracks.length > 0 && (
                <section className="artist-top-tracks">
                    <div className="container">
                        <h2 className="section-title">
                            <FaPlay /> Popular Tracks
                        </h2>
                        <div className="top-tracks-list">
                            {topTracks.data.tracks.slice(0, 5).map((track, index) => (
                                <div key={track.id} className="top-track-item">
                                    <div className="top-track-number">{index + 1}</div>
                                    <div className="top-track-image">
                                        <img 
                                            src={track.album.images?.[2]?.url || track.album.images?.[0]?.url} 
                                            alt={track.album.name}
                                        />
                                    </div>
                                    <div className="top-track-info">
                                        <div className="top-track-name">{track.name}</div>
                                        <div className="top-track-album">{track.album.name}</div>
                                    </div>
                                    <div className="top-track-duration">
                                        {Math.floor(track.duration_ms / 60000)}:
                                        {Math.floor((track.duration_ms % 60000) / 1000).toString().padStart(2, '0')}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Albums Section */}
            <section className="artist-albums">
                <div className="container">
                    <div className="artist-albums-header">
                        <h2 className="section-title">
                            <FaCompactDisc /> Discography
                        </h2>
                        
                        <FilterZone 
                            activeFilter={activeFilter} 
                            onFilterChange={setActiveFilter} 
                        />
                    </div>

                    {albums.isLoading ? (
                        <SkeletonGrid count={12} />
                    ) : albums.isError ? (
                        <ErrorMessage 
                            error={albums.error} 
                            onRetry={() => albums.refetch?.()}
                        />
                    ) : coversData.length > 0 ? (
                        <>
                            <div className="albums-results-info">
                                <p>
                                    <strong>{filteredAlbums.length}</strong> {filteredAlbums.length === 1 ? 'album' : 'albums'} found
                                </p>
                            </div>
                            
                            <CoverGrid
                                covers={coversData}
                                onFavorite={handleFavoriteAlbum}
                                onShare={handleShareAlbum}
                                favorites={favorites}
                                className="artist-albums-grid"
                            />
                            
                            {!showAllAlbums && filteredAlbums.length > 12 && (
                                <div className="artist-albums-show-more">
                                    <button 
                                        onClick={() => setShowAllAlbums(true)}
                                        className="btn-secondary"
                                    >
                                        Show All {filteredAlbums.length} Albums
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="artist-no-albums">
                            <FaCompactDisc />
                            <h3>No Albums Found</h3>
                            <p>No albums match the current filter for this artist.</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Related Artists Section */}
            {relatedArtists.data && relatedArtists.data.artists.length > 0 && (
                <section className="artist-related">
                    <div className="container">
                        <h2 className="section-title">
                            <FaUsers /> You Might Also Like
                        </h2>
                        <div className="related-artists-grid">
                            {relatedArtists.data.artists.slice(0, 6).map((relatedArtist) => (
                                <Link 
                                    key={relatedArtist.id} 
                                    to={`/artists/${relatedArtist.id}`}
                                    className="related-artist-card"
                                >
                                    <div className="related-artist-image">
                                        {relatedArtist.images?.[0] ? (
                                            <img 
                                                src={relatedArtist.images[0].url} 
                                                alt={relatedArtist.name}
                                            />
                                        ) : (
                                            <div className="related-artist-placeholder">
                                                <FaUsers />
                                            </div>
                                        )}
                                    </div>
                                    <div className="related-artist-name">{relatedArtist.name}</div>
                                    {relatedArtist.genres?.[0] && (
                                        <div className="related-artist-genre">{relatedArtist.genres[0]}</div>
                                    )}
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
}
