import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
    FaPlay, 
    FaHeart, 
    FaRandom, 
    FaChevronDown
} from 'react-icons/fa';
import { useFavorites } from '../hooks/useFavorites';
import { searchItem } from '../api/spotify';

export function Hero() {
    const [showScrollHint, setShowScrollHint] = useState(true);
    const [isSearchingRandom, setIsSearchingRandom] = useState(false);
    const { favoriteItems } = useFavorites();
    const navigate = useNavigate();

    // Hide scroll hint after scroll
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 100) {
                setShowScrollHint(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleSurpriseMe = async () => {
        setIsSearchingRandom(true);
        
        try {
            const randomGenres = ['rock', 'pop', 'jazz', 'electronic', 'hip-hop', 'classical', 'blues', 'country', 'reggae', 'folk'];
            const randomGenre = randomGenres[Math.floor(Math.random() * randomGenres.length)];
            
            const results = await searchItem(randomGenre, 50, ['album']);
            
            if (results?.albums?.items && results.albums.items.length > 0) {
                // Filter valid albums
                const validAlbums = results.albums.items.filter(album => 
                    album.images && 
                    album.images.length > 0 && 
                    album.name && 
                    album.artists && 
                    album.artists.length > 0
                );
                
                if (validAlbums.length > 0) {
                    const randomAlbum = validAlbums[Math.floor(Math.random() * validAlbums.length)];
                    navigate(`/covers/${randomAlbum.id}`);
                } else {
                    // Fallback to covers page
                    navigate('/covers');
                }
            } else {
                // Fallback to covers page
                navigate('/covers');
            }
        } catch (error) {
            console.error('Error during random search:', error);
            // Fallback to covers page
            navigate('/covers');
        } finally {
            setIsSearchingRandom(false);
        }
    };

    return (
        <section className="hero-simple">
            <div className="hero-simple__background">
                <div className="hero-simple__gradient"></div>
            </div>

            <div className="container">
                <div className="hero-simple__content">
                    <div className="hero-simple__text">
                        <h1 className="hero-simple__title">
                            Explore Your Favorite
                            <span className="hero-simple__title-accent">
                                Album Covers
                            </span>
                        </h1>
                        
                        <p className="hero-simple__description">
                            Discover, zoom, and explore album artwork like never before. 
                            Your personal gallery of music art awaits.
                        </p>

                        <div className="hero-simple__actions">
                            <Link to="/covers" className="hero-simple__btn primary">
                                <FaPlay />
                                Start Exploring
                            </Link>
                            
                            <button 
                                onClick={handleSurpriseMe}
                                className="hero-simple__btn secondary"
                                disabled={isSearchingRandom}
                            >
                                <FaRandom />
                                {isSearchingRandom ? 'Finding...' : 'Surprise Me'}
                            </button>
                            
                            {favoriteItems.length > 0 && (
                                <Link to="/favorites" className="hero-simple__btn tertiary">
                                    <FaHeart />
                                    My Collection ({favoriteItems.length})
                                </Link>
                            )}
                        </div>
                    </div>

                    <div className="hero-simple__visual">
                        <div className="hero-simple__album-showcase">
                            <div className="hero-simple__album-grid">
                                <div className="hero-simple__album-item large">
                                    <img 
                                        src="https://placehold.co/200/084887/FFFFFF?text=♪" 
                                        alt="Featured Album" 
                                        className="hero-simple__album-image"
                                    />
                                </div>
                                <div className="hero-simple__album-item medium">
                                    <img 
                                        src="https://placehold.co/150/9DCBBA/FFFFFF?text=♫" 
                                        alt="Featured Album" 
                                        className="hero-simple__album-image"
                                    />
                                </div>
                                <div className="hero-simple__album-item small">
                                    <img 
                                        src="https://placehold.co/100/CEB1BE/FFFFFF?text=♪" 
                                        alt="Featured Album" 
                                        className="hero-simple__album-image"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {favoriteItems.length > 0 && (
                    <div className="hero-simple__stats">
                        <div className="hero-simple__stat">
                            <span className="hero-simple__stat-number">{favoriteItems.length}</span>
                            <span className="hero-simple__stat-label">In Your Collection</span>
                        </div>
                        <div className="hero-simple__stat">
                            <span className="hero-simple__stat-number">HD</span>
                            <span className="hero-simple__stat-label">High Quality</span>
                        </div>
                        <div className="hero-simple__stat">
                            <span className="hero-simple__stat-number">∞</span>
                            <span className="hero-simple__stat-label">To Discover</span>
                        </div>
                    </div>
                )}
            </div>

            {showScrollHint && (
                <div className="hero-simple__scroll-hint">
                    <FaChevronDown className="hero-simple__scroll-icon" />
                </div>
            )}
        </section>
    );
}
