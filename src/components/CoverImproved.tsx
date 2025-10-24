import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { FaPlay, FaHeart, FaShare } from 'react-icons/fa';

interface CoverProps {
    id: string;
    image: string;
    title: string;
    artist: string;
    releaseDate?: string;
    albumType?: 'album' | 'single' | 'compilation';
    onFavorite?: (id: string) => void;
    onShare?: (id: string, title: string, artist: string) => void;
    isFavorite?: boolean;
    showActions?: boolean;
    size?: 'small' | 'medium' | 'large';
}

export function CoverImproved({ 
    id, 
    image, 
    title, 
    artist, 
    releaseDate,
    albumType = 'album',
    onFavorite,
    onShare,
    isFavorite = false,
    showActions = true,
    size = 'medium'
}: CoverProps) {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);

    const handleFavorite = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onFavorite?.(id);
    };

    const handleShare = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onShare?.(id, title, artist);
    };

    const formatReleaseDate = (date: string) => {
        return new Date(date).getFullYear();
    };

    return (
        <div className={`cover-improved ${size} ${albumType}`}>
            <Link to={`/covers/${id}`} className="cover-improved__link">
                <div className="cover-improved__image-container">
                    {!imageError ? (
                        <LazyLoadImage
                            src={image}
                            alt={`${title} by ${artist}`}
                            className={`cover-improved__image ${imageLoaded ? 'loaded' : ''}`}
                            onLoad={() => setImageLoaded(true)}
                            onError={() => setImageError(true)}
                            effect="blur"
                            placeholderSrc="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2Y0ZjRmNCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjE4IiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+TG9hZGluZy4uLjwvdGV4dD48L3N2Zz4="
                        />
                    ) : (
                        <div className="cover-improved__image-error">
                            <span>No Image</span>
                        </div>
                    )}
                    
                    {showActions && (
                        <div className="cover-improved__overlay">
                            <div className="cover-improved__actions">
                                <button 
                                    className="cover-improved__action-btn play-btn"
                                    title="Preview"
                                >
                                    <FaPlay />
                                </button>
                                {onFavorite && (
                                    <button 
                                        className={`cover-improved__action-btn favorite-btn ${isFavorite ? 'active' : ''}`}
                                        onClick={handleFavorite}
                                        title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                                    >
                                        <FaHeart />
                                    </button>
                                )}
                                {onShare && (
                                    <button 
                                        className="cover-improved__action-btn share-btn"
                                        onClick={handleShare}
                                        title="Share"
                                    >
                                        <FaShare />
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                    
                    <div className="cover-improved__type-badge">
                        {albumType}
                    </div>
                </div>
                
                <div className="cover-improved__info">
                    <h3 className="cover-improved__title" title={title}>
                        {title}
                    </h3>
                    <p className="cover-improved__artist" title={artist}>
                        {artist}
                    </p>
                    {releaseDate && (
                        <p className="cover-improved__year">
                            {formatReleaseDate(releaseDate)}
                        </p>
                    )}
                </div>
            </Link>
        </div>
    );
}

// Grid component for covers
interface CoverGridProps {
    covers: Array<{
        id: string;
        image: string;
        title: string;
        artist: string;
        releaseDate?: string;
        albumType?: 'album' | 'single' | 'compilation';
    }>;
    onFavorite?: (id: string) => void;
    onShare?: (id: string, title: string, artist: string) => void;
    favorites?: Set<string>;
    className?: string;
    size?: 'small' | 'medium' | 'large';
}

export function CoverGrid({ 
    covers, 
    onFavorite, 
    onShare, 
    favorites = new Set(), 
    className = '',
    size = 'medium'
}: CoverGridProps) {
    return (
        <div className={`cover-grid ${className}`}>
            {covers.map((cover) => (
                <CoverImproved
                    key={cover.id}
                    id={cover.id}
                    image={cover.image}
                    title={cover.title}
                    artist={cover.artist}
                    releaseDate={cover.releaseDate}
                    albumType={cover.albumType}
                    onFavorite={onFavorite}
                    onShare={onShare}
                    isFavorite={favorites.has(cover.id)}
                    size={size}
                />
            ))}
        </div>
    );
}
