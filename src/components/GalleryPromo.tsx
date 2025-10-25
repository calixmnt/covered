import { Link } from 'react-router-dom';
import { FaImages, FaArrowRight, FaHeart } from 'react-icons/fa';
import { useFavorites } from '../hooks/useFavorites';

export function GalleryPromo() {
    const { favoriteItems } = useFavorites();
    
    // Count covers in gallery (albums and tracks with images)
    const galleryCovers = favoriteItems.filter(item => 
        (item.type === 'album' || item.type === 'track') && item.image
    );
    
    // Get first 6 covers for preview
    const previewCovers = galleryCovers.slice(0, 6);
    
    // Don't show if no covers
    if (galleryCovers.length === 0) {
        return null;
    }
    
    return (
        <section className="gallery-promo">
            <div className="container">
                <div className="gallery-promo__content">
                    <div className="gallery-promo__header">
                        <div className="gallery-promo__icon">
                            <FaImages />
                        </div>
                        <h2 className="gallery-promo__title">
                            Your Immersive Gallery
                        </h2>
                        <p className="gallery-promo__description">
                            Experience your favorite album covers in a stunning full-screen gallery. 
                            {galleryCovers.length} cover{galleryCovers.length > 1 ? 's' : ''} waiting for you.
                        </p>
                    </div>

                    <div className="gallery-promo__preview">
                        <div className="gallery-promo__grid">
                            {previewCovers.map((cover, index) => (
                                <div 
                                    key={cover.id} 
                                    className="gallery-promo__item"
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                >
                                    <img 
                                        src={cover.image} 
                                        alt={cover.title}
                                        loading="lazy"
                                    />
                                    <div className="gallery-promo__item-overlay">
                                        <FaHeart />
                                    </div>
                                </div>
                            ))}
                            
                            {galleryCovers.length > 6 && (
                                <div className="gallery-promo__item more">
                                    <div className="gallery-promo__more-content">
                                        <span className="gallery-promo__more-count">
                                            +{galleryCovers.length - 6}
                                        </span>
                                        <span className="gallery-promo__more-text">
                                            more
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="gallery-promo__actions">
                        <Link to="/gallery" className="gallery-promo__btn primary">
                            <FaImages />
                            Open Gallery
                            <FaArrowRight />
                        </Link>
                        
                        <div className="gallery-promo__features">
                            <div className="gallery-promo__feature">
                                <span className="gallery-promo__feature-icon">🎨</span>
                                <span className="gallery-promo__feature-text">Full-screen experience</span>
                            </div>
                            <div className="gallery-promo__feature">
                                <span className="gallery-promo__feature-icon">⚡</span>
                                <span className="gallery-promo__feature-text">Smooth navigation</span>
                            </div>
                            <div className="gallery-promo__feature">
                                <span className="gallery-promo__feature-icon">✨</span>
                                <span className="gallery-promo__feature-text">Immersive design</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
