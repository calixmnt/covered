import React, { useState } from 'react';
import { useParams, useNavigate, Link, useLoaderData } from 'react-router-dom';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { 
    FaHeart, 
    FaShare, 
    FaPlay, 
    FaExternalLinkAlt, 
    FaArrowLeft,
    FaCalendarAlt,
    FaClock,
    FaMusic,
    FaUser
} from 'react-icons/fa';
import { useAlbum, useArtistTopTracks } from '../hooks/useSpotifyData';
import { useFavorites } from '../hooks/useFavorites';
import { useShare } from '../hooks/useShare';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorBoundary';
import { CoverImproved } from '../components/CoverImproved';
import { CoverZoom } from '../components/CoverZoom';
import 'react-lazy-load-image-component/src/effects/blur.css';

function CoverDetailsPage() {
    const { coverId } = useParams<{ coverId: string }>();
    const navigate = useNavigate();
    const loaderData = useLoaderData() as string | null;
    
    // Use loader data if available (for surprise-of-the-day), otherwise use URL param
    const albumId = loaderData || coverId;
    
    // Don't make the query if we don't have a valid albumId
    const { data: album, isLoading, error } = useAlbum(albumId && typeof albumId === 'string' ? albumId : undefined);
    const { data: artistTopTracks } = useArtistTopTracks(album?.artists[0]?.id);
    const { favorites, toggleFavorite } = useFavorites();
    const { shareItem } = useShare();
    
    // State for cover zoom modal
    const [isZoomOpen, setIsZoomOpen] = useState(false);

    const handleBack = () => {
        navigate(-1);
    };

    const handleFavorite = () => {
        if (album) {
            toggleFavorite({
                id: album.id,
                title: album.name,
                artist: album.artists[0]?.name || 'Unknown Artist',
                image: album.images[0]?.url || '',
                type: 'album'
            });
        }
    };

    const handleShare = async () => {
        if (album) {
            await shareItem({
                id: album.id,
                title: album.name,
                artist: album.artists[0]?.name || 'Unknown Artist',
                type: 'album'
            });
        }
    };

    const formatDuration = (ms: number) => {
        const minutes = Math.floor(ms / 60000);
        const seconds = Math.floor((ms % 60000) / 1000);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const formatReleaseDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getAlbumDuration = () => {
        if (!album?.tracks?.items) return 0;
        return album.tracks.items.reduce((total, track) => total + (track.duration_ms || 0), 0);
    };

    if (isLoading) {
        return (
            <div className="cover-details-loading">
                <LoadingSpinner size="large" message="Loading album details..." />
            </div>
        );
    }

    if (error) {
        return (
            <div className="container">
                <ErrorMessage 
                    error={error} 
                    onRetry={() => window.location.reload()}
                />
            </div>
        );
    }

    // Special case: if this is surprise-of-the-day and loader returned null
    if (loaderData === null && !coverId) {
        return (
            <div className="container">
                <div className="cover-details-not-found">
                    <h2>No Surprise Available</h2>
                    <p>We couldn't find a random album for today's surprise. Please try again later.</p>
                    <div className="cover-details-not-found-actions">
                        <button onClick={() => window.location.reload()} className="btn-secondary">
                            Try Again
                        </button>
                        <button onClick={() => navigate('/')} className="btn-primary">
                            <FaArrowLeft /> Go Home
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (!album) {
        const isFromSurprise = loaderData && !coverId;
        return (
            <div className="container">
                <div className="cover-details-not-found">
                    <h2>Album Not Found</h2>
                    <p>
                        {isFromSurprise 
                            ? "The random album we found is not available in your region or has been removed."
                            : "The requested album could not be found."
                        }
                    </p>
                    <div className="cover-details-not-found-actions">
                        {isFromSurprise && (
                            <button onClick={() => window.location.reload()} className="btn-secondary">
                                Try Another Random Album
                            </button>
                        )}
                        <Link to="/covers" className="btn-secondary">
                            Browse Albums
                        </Link>
                        <button onClick={handleBack} className="btn-primary">
                            <FaArrowLeft /> Go Back
                        </button>
                    </div>
                </div>
            </div>
        );
    }


    const isFavorite = favorites.has(album.id);
    const totalDuration = getAlbumDuration();
    const relatedAlbums = artistTopTracks?.tracks?.slice(0, 4).map(track => track.album).filter(
        (album, index, self) => self.findIndex(a => a.id === album.id) === index
    ) || [];

    return (
        <div className="cover-details-improved">
            {/* Header with back button */}
            <div className="cover-details-header">
                <div className="container">
                    <button onClick={handleBack} className="cover-details-back-btn">
                        <FaArrowLeft /> Back
                    </button>
                </div>
            </div>

            {/* Main content */}
            <div className="container">
                <div className="cover-details-main">
                    {/* Album artwork */}
                    <div className="cover-details-artwork">
                        <div 
                            className="cover-details-image-container clickable"
                            onClick={() => setIsZoomOpen(true)}
                            title="Click to zoom and explore the cover"
                        >
                            <LazyLoadImage
                                src={album.images[0]?.url}
                                alt={`${album.name} by ${album.artists[0]?.name}`}
                                className="cover-details-image"
                                effect="blur"
                                placeholderSrc={album.images[2]?.url}
                            />
                            
                            {/* Overlay actions */}
                            <div className="cover-details-overlay">
                                <button className="cover-details-play-btn">
                                    <FaPlay />
                                </button>
                                <div className="cover-details-zoom-hint">
                                    <span>Click to explore</span>
                                </div>
                            </div>
                        </div>

                        {/* Action buttons */}
                        <div className="cover-details-actions">
                            <button 
                                onClick={handleFavorite}
                                className={`cover-details-action-btn ${isFavorite ? 'active' : ''}`}
                                title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                            >
                                <FaHeart />
                                {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                            </button>
                            
                            <button 
                                onClick={handleShare}
                                className="cover-details-action-btn"
                                title="Share this album"
                            >
                                <FaShare />
                                Share
                            </button>
                            
                            {album.external_urls?.spotify && (
                                <a 
                                    href={album.external_urls.spotify}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="cover-details-action-btn spotify-btn"
                                >
                                    <FaExternalLinkAlt />
                                    Open in Spotify
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Album information */}
                    <div className="cover-details-info">
                        <div className="cover-details-header-info">
                            <span className="cover-details-type">{album.album_type}</span>
                            <h1 className="cover-details-title">{album.name}</h1>
                            
                            <div className="cover-details-artists">
                                {album.artists.map((artist, index) => (
                                    <React.Fragment key={artist.id}>
                                        <Link 
                                            to={`/artists/${artist.id}`}
                                            className="cover-details-artist-link"
                                        >
                                            <FaUser /> {artist.name}
                                        </Link>
                                        {index < album.artists.length - 1 && ', '}
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>

                        {/* Album metadata */}
                        <div className="cover-details-metadata">
                            <div className="cover-details-meta-item">
                                <FaCalendarAlt />
                                <span>Released: {formatReleaseDate(album.release_date)}</span>
                            </div>
                            
                            <div className="cover-details-meta-item">
                                <FaMusic />
                                <span>{album.total_tracks} tracks</span>
                            </div>
                            
                            {totalDuration > 0 && (
                                <div className="cover-details-meta-item">
                                    <FaClock />
                                    <span>Duration: {formatDuration(totalDuration)}</span>
                                </div>
                            )}
                        </div>

                        {/* Track listing */}
                        {/* {album.tracks?.items && album.tracks.items.length > 0 && (
                            <div className="cover-details-tracklist">
                                <h3>Track Listing</h3>
                                <div className="cover-details-tracks">
                                    {album.tracks.items.map((track) => (
                                        <div key={track.id} className="cover-details-track">
                                            <div className="cover-details-track-number">
                                                {track.track_number}
                                            </div>
                                            <div className="cover-details-track-info">
                                                <div className="cover-details-track-name">
                                                    {track.name}
                                                    {track.explicit && (
                                                        <span className="explicit-badge">E</span>
                                                    )}
                                                </div>
                                                {track.artists.length > 0 && (
                                                    <div className="cover-details-track-artists">
                                                        {track.artists.map((artist: any) => artist.name).join(', ')}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="cover-details-track-duration">
                                                {formatDuration(track.duration_ms)}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )} */}

                        {/* Related albums */}
                        {relatedAlbums.length > 0 && (
                            <div className="cover-details-related">
                                <h3>More from {album.artists[0]?.name}</h3>
                                <div className="cover-details-related-grid">
                                    {relatedAlbums.map((relatedAlbum) => (
                                        <CoverImproved
                                            key={relatedAlbum.id}
                                            id={relatedAlbum.id}
                                            image={relatedAlbum.images[0]?.url || ''}
                                            title={relatedAlbum.name}
                                            artist={relatedAlbum.artists[0]?.name || ''}
                                            releaseDate={relatedAlbum.release_date}
                                            albumType={relatedAlbum.album_type as any}
                                            size="small"
                                            showActions={false}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Cover Zoom Modal */}
            <CoverZoom
                isOpen={isZoomOpen}
                onClose={() => setIsZoomOpen(false)}
                imageUrl={album.images[0]?.url || ''}
                title={album.name}
                artist={album.artists[0]?.name || 'Unknown Artist'}
                albumType={album.album_type}
                releaseDate={album.release_date}
                onFavorite={handleFavorite}
                onShare={handleShare}
                isFavorite={isFavorite}
            />
        </div>
    );
}

export default CoverDetailsPage;
