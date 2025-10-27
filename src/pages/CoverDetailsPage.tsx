import React, { useState, useEffect } from 'react';
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
import { useLanguage } from '../contexts/LanguageContext';
import { trackEvent } from '../analytics';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorBoundary';
import { CoverImproved } from '../components/CoverImproved';
import { CoverZoom } from '../components/CoverZoom';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { SEO } from '../components/SEO.tsx';
import { seoConfig } from '../utils/seoConfig.ts';

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
    const { t, language } = useLanguage();
    
    // State for cover zoom modal
    const [isZoomOpen, setIsZoomOpen] = useState(false);

    // Track result click when album loads
    useEffect(() => {
        if (album) {
            // Determine source: Spotify API is our main source (CAA = Cover Album Art)
            trackEvent('result_click', { source: 'CAA' });
        }
    }, [album]);

    const handleBack = () => {
        navigate(-1);
    };

    const handleFavorite = () => {
        if (album) {
            toggleFavorite({
                id: album.id,
                title: album.name,
                artist: album.artists[0]?.name || t.coverDetails.unknownArtist,
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
                artist: album.artists[0]?.name || t.coverDetails.unknownArtist,
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
        const locale = language === 'fr' ? 'fr-FR' : 'en-US';
        return date.toLocaleDateString(locale, {
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
                <LoadingSpinner size="large" message={t.coverDetails.loadingMessage} />
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
                    <h2>{t.coverDetails.noSurpriseTitle}</h2>
                    <p>{t.coverDetails.noSurpriseDesc}</p>
                    <div className="cover-details-not-found-actions">
                        <button onClick={() => window.location.reload()} className="btn-secondary">
                            {t.coverDetails.tryAgain}
                        </button>
                        <button onClick={() => navigate('/')} className="btn-primary">
                            <FaArrowLeft /> {t.coverDetails.goHome}
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
                    <h2>{t.coverDetails.albumNotFoundTitle}</h2>
                    <p>
                        {isFromSurprise 
                            ? t.coverDetails.albumNotFoundDescRandom
                            : t.coverDetails.albumNotFoundDesc
                        }
                    </p>
                    <div className="cover-details-not-found-actions">
                        {isFromSurprise && (
                            <button onClick={() => window.location.reload()} className="btn-secondary">
                                {t.coverDetails.tryAnotherRandom}
                            </button>
                        )}
                        <Link to="/covers" className="btn-secondary">
                            {t.coverDetails.browseAlbums}
                        </Link>
                        <button onClick={handleBack} className="btn-primary">
                            <FaArrowLeft /> {t.coverDetails.goBack}
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
        <>
            <SEO {...seoConfig.albumDetail(album.name, album.artists[0]?.name, album.images?.[0]?.url)} />
            <div className="cover-details-improved">
            {/* Header with back button */}
            <div className="cover-details-header">
                <div className="container">
                    <button onClick={handleBack} className="cover-details-back-btn">
                        <FaArrowLeft /> {t.coverDetails.back}
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
                            title={t.coverDetails.clickToExplore}
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
                                    <span>{t.coverDetails.clickToExplore}</span>
                                </div>
                            </div>
                        </div>

                        {/* Action buttons */}
                        <div className="cover-details-actions">
                            <button 
                                onClick={handleFavorite}
                                className={`cover-details-action-btn ${isFavorite ? 'active' : ''}`}
                                title={isFavorite ? t.coverDetails.removeFromFavorites : t.coverDetails.addToFavorites}
                            >
                                <FaHeart />
                                {isFavorite ? t.coverDetails.removeFromFavorites : t.coverDetails.addToFavorites}
                            </button>
                            
                            <button 
                                onClick={handleShare}
                                className="cover-details-action-btn"
                                title={t.coverDetails.shareTitle}
                            >
                                <FaShare />
                                {t.coverDetails.share}
                            </button>
                            
                            {album.external_urls?.spotify && (
                                <a 
                                    href={album.external_urls.spotify}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="cover-details-action-btn spotify-btn"
                                >
                                    <FaExternalLinkAlt />
                                    {t.coverDetails.openInSpotify}
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
                                <span>{t.coverDetails.released}: {formatReleaseDate(album.release_date)}</span>
                            </div>
                            
                            <div className="cover-details-meta-item">
                                <FaMusic />
                                <span>{album.total_tracks} {t.coverDetails.tracks}</span>
                            </div>
                            
                            {totalDuration > 0 && (
                                <div className="cover-details-meta-item">
                                    <FaClock />
                                    <span>{t.coverDetails.duration}: {formatDuration(totalDuration)}</span>
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
                                <h3>{t.coverDetails.moreFrom} {album.artists[0]?.name}</h3>
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
                artist={album.artists[0]?.name || t.coverDetails.unknownArtist}
                albumType={album.album_type}
                releaseDate={album.release_date}
                onFavorite={handleFavorite}
                onShare={handleShare}
                isFavorite={isFavorite}
            />
        </div>
        </>
    );
}

export default CoverDetailsPage;
