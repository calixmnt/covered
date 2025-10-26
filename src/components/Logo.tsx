import { Link } from 'react-router-dom';
import logoWhite from '../assets/images/logo_white.svg';
import logoBlack from '../assets/images/logo_black.svg';

interface LogoProps {
    variant?: 'white' | 'black' | 'auto';
    size?: 'small' | 'medium' | 'large';
    crop?: 'tight' | 'normal' | 'loose' | 'none';
    className?: string;
}

export function Logo({ 
    variant = 'auto', 
    size = 'medium', 
    crop = 'normal',
    className = '' 
}: LogoProps) {
    // Auto mode: use white logo (assuming dark mode by default)
    const logoSrc = variant === 'auto' ? logoWhite : variant === 'white' ? logoWhite : logoBlack;
    
    const sizeClasses = {
        small: 'logo--small',
        medium: 'logo--medium',
        large: 'logo--large'
    };

    const cropClass = crop !== 'none' ? `logo--crop-${crop}` : '';

    return (
        <Link to="/" className={`logo ${sizeClasses[size]} ${cropClass} ${className}`}>
            <img 
                src={logoSrc} 
                alt="Covered - Music Art Gallery" 
                className="logo__image"
            />
        </Link>
    );
}