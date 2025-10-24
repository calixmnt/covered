import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    FaTimes,
    FaChevronLeft,
    FaChevronRight,
    FaHeart,
    FaShare,
    FaPlay,
    FaRandom,
    FaSortAmountDown,
    FaArrowLeft
} from 'react-icons/fa';
import { useFavorites } from '../hooks/useFavorites';
import { useShare } from '../hooks/useShare';
import { LoadingSpinner } from '../components/LoadingSpinner';

type SortMode = 'recent' | 'alphabetical' | 'artist' | 'random';

export default function GalleryPage() {
    const navigate = useNavigate();
    const { favoriteItems } = useFavorites();
    const { shareItem } = useShare();
    
    const [sortMode, setSortMode] = useState<SortMode>('recent');
    const [selectedCover, setSelectedCover] = useState<number | null>(null);
    const [showControls, setShowControls] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [randomizedCovers, setRandomizedCovers] = useState<any[]>([]);

    // Filter only albums and tracks with images
    const coversData = favoriteItems.filter(item => 
        (item.type === 'album' || item.type === 'track') && item.image
    );

    useEffect(() => {
        // Simulate loading for smooth transition
        const timer = setTimeout(() => setIsLoading(false), 500);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (sortMode === 'random') {
            setRandomizedCovers([...coversData].sort(() => Math.random() - 0.5));
        }
    }, [sortMode, favoriteItems]);

    // Hide controls after 3 seconds of inactivity
    useEffect(() => {
        const timer = setTimeout(() => setShowControls(false), 3000);
        return () => clearTimeout(timer);
    }, [showControls]);

    const getSortedCovers = () => {
        let sorted = [...coversData];
        
        switch (sortMode) {
            case 'alphabetical':
                return sorted.sort((a, b) => a.title.localeCompare(b.title));
            case 'artist':
                return sorted.sort((a, b) => a.artist.localeCompare(b.artist));
            case 'random':
                return randomizedCovers;
            case 'recent':
            default:
                return sorted.sort((a, b) => b.addedAt - a.addedAt);
        }
    };

    const sortedCovers = getSortedCovers();

    const handleCoverClick = (index: number) => {
        setSelectedCover(index);
    };

    const handleShare = async (cover: any) => {
        await shareItem({
            id: cover.id,
            title: cover.title,
            artist: cover.artist,
            type: cover.type,
            image: cover.image
        });
    };

    const navigateFullscreen = (direction: 'prev' | 'next') => {
        if (selectedCover === null) return;
        
        if (direction === 'prev') {
            setSelectedCover(selectedCover > 0 ? selectedCover - 1 : sortedCovers.length - 1);
        } else {
            setSelectedCover(selectedCover < sortedCovers.length - 1 ? selectedCover + 1 : 0);
        }
    };

    const handleMouseMove = () => {
        setShowControls(true);
    };

    const handleExitGallery = () => {
        navigate(-1); // Go back to previous page
    };

    if (isLoading) {
        return (
            <div className="gallery-immersive">
                <div className="gallery-loading">
                    <LoadingSpinner size="large" message="Opening your gallery..." />
                </div>
            </div>
        );
    }

    if (coversData.length === 0) {
        return (
            <div className="gallery-immersive">
                <div className="gallery-minimal-header">
                    <button onClick={handleExitGallery} className="gallery-exit-btn">
                        <FaArrowLeft />
                        <span>Exit Gallery</span>
                    </button>
                </div>
                
                <div className="gallery-empty-state">
                    <div className="gallery-empty-content">
                        <FaHeart className="gallery-empty-icon" />
                        <h2>Your Gallery Awaits</h2>
                        <p>Like albums and tracks to create your personal visual collection</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="gallery-immersive" onMouseMove={handleMouseMove}>
            {/* Minimal Header */}
            <div className={`gallery-minimal-header ${showControls ? 'visible' : 'hidden'}`}>
                <button onClick={handleExitGallery} className="gallery-exit-btn">
                    <FaArrowLeft />
                    <span>Exit Gallery</span>
                </button>
                
                <div className="gallery-sort-minimal">
                    <button 
                        onClick={() => setSortMode(sortMode === 'recent' ? 'random' : 'recent')}
                        className="gallery-sort-toggle"
                        title={`Switch to ${sortMode === 'recent' ? 'random' : 'recent'} order`}
                    >
                        {sortMode === 'recent' ? <FaRandom /> : <FaSortAmountDown />}
                    </button>
                </div>
            </div>

            {/* Gallery Grid */}
            <div className="gallery-immersive-grid">
                {sortedCovers.map((cover, index) => (
                    <div 
                        key={`${cover.id}-${index}`}
                        className="gallery-immersive-item"
                        onClick={() => handleCoverClick(index)}
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
                                src={sortedCovers[selectedCover]?.image}
                                alt={sortedCovers[selectedCover]?.title}
                            />
                            <div className="gallery-fullscreen-info">
                                <h2>{sortedCovers[selectedCover]?.title}</h2>
                                <p>{sortedCovers[selectedCover]?.artist}</p>
                                <div className="gallery-fullscreen-actions">
                                    <button 
                                        onClick={() => handleShare(sortedCovers[selectedCover])}
                                        className="gallery-fullscreen-btn"
                                    >
                                        <FaShare /> Share
                                    </button>
                                    <button className="gallery-fullscreen-btn">
                                        <FaPlay /> Play
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
                            {selectedCover + 1} / {sortedCovers.length}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
