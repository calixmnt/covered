interface LoadingSpinnerProps {
    size?: 'small' | 'medium' | 'large';
    message?: string;
    className?: string;
}

export function LoadingSpinner({ 
    size = 'medium', 
    message = 'Loading...', 
    className = '' 
}: LoadingSpinnerProps) {
    return (
        <div className={`loading-spinner ${size} ${className}`}>
            <div className="loading-spinner__animation">
                <div className="loading-spinner__dot"></div>
                <div className="loading-spinner__dot"></div>
                <div className="loading-spinner__dot"></div>
            </div>
            {message && (
                <p className="loading-spinner__message">{message}</p>
            )}
        </div>
    );
}

// Skeleton loader for cover grids
export function CoverSkeleton() {
    return (
        <div className="cover-skeleton">
            <div className="cover-skeleton__image"></div>
            <div className="cover-skeleton__info">
                <div className="cover-skeleton__title"></div>
                <div className="cover-skeleton__artist"></div>
            </div>
        </div>
    );
}

// Grid of skeleton loaders
interface SkeletonGridProps {
    count?: number;
    className?: string;
}

export function SkeletonGrid({ count = 12, className = '' }: SkeletonGridProps) {
    return (
        <div className={`skeleton-grid ${className}`}>
            {Array.from({ length: count }, (_, index) => (
                <CoverSkeleton key={index} />
            ))}
        </div>
    );
}

// Loading overlay
interface LoadingOverlayProps {
    isVisible: boolean;
    message?: string;
}

export function LoadingOverlay({ isVisible, message = 'Loading...' }: LoadingOverlayProps) {
    if (!isVisible) return null;

    return (
        <div className="loading-overlay">
            <div className="loading-overlay__content">
                <LoadingSpinner size="large" message={message} />
            </div>
        </div>
    );
}
