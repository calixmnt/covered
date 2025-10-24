import { useState, useEffect } from 'react';
import { NavLink, useLocation, Link } from 'react-router-dom';
import { 
    FaHeart, 
    FaSearch, 
    FaMusic,
    FaBars,
    FaTimes,
    FaSun,
    FaMoon,
    FaGift,
    FaImages
} from 'react-icons/fa';
import { useFavorites } from '../hooks/useFavorites';
import { useTheme } from '../hooks/useTheme';

export function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [showSearchBar, setShowSearchBar] = useState(false);
    
    const location = useLocation();
    const { favoriteItems } = useFavorites();
    const { theme, switchMode } = useTheme();
    
    const toggleTheme = () => {
        switchMode(theme === 'dark' ? 'light' : 'dark');
    };

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close menu on route change
    useEffect(() => {
        setIsMenuOpen(false);
        setShowSearchBar(false);
    }, [location.pathname]);

    // Close menu on escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setIsMenuOpen(false);
                setShowSearchBar(false);
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, []);

    const handleMenuToggle = () => {
        setIsMenuOpen(!isMenuOpen);
        setShowSearchBar(false);
    };

    const handleSearchToggle = () => {
        setShowSearchBar(!showSearchBar);
        setIsMenuOpen(false);
    };

    const navigationItems = [
        { 
            to: '/', 
            label: 'Home', 
            icon: <FaMusic />,
            description: 'Discover music'
        },
        { 
            to: '/covers', 
            label: 'Explore', 
            icon: <FaSearch />,
            description: 'Search albums'
        },
        { 
            to: '/gift-of-the-day', 
            label: 'Your gift', 
            icon: <FaGift />,
            description: 'Daily discovery'
        },
        { 
            to: '/gallery', 
            label: 'Gallery', 
            icon: <FaImages />,
            description: 'Your cover collection'
        }
    ];

    return (
        <header className={`header-improved ${isScrolled ? 'scrolled' : ''}`}>
            <div className="header-improved__background"></div>
            
            <div className="container">
                <div className="header-improved__content">
                    {/* Logo */}
                    <Link to="/" className="header-improved__logo">
                        <div className="header-improved__logo-text">
                            <span className="header-improved__logo-name">Covered</span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="header-improved__nav desktop-nav">
                        <ul className="header-improved__nav-list">
                            {navigationItems.map((item) => (
                                <li key={item.to} className="header-improved__nav-item">
                                    <NavLink 
                                        to={item.to}
                                        className={({ isActive }) => 
                                            `header-improved__nav-link ${isActive ? 'active' : ''}`
                                        }
                                        title={item.description}
                                    >
                                        <span className="header-improved__nav-icon">
                                            {item.icon}
                                        </span>
                                        <span className="header-improved__nav-label">
                                            {item.label}
                                        </span>
                                        {/* {item.badge && (
                                            <span className="header-improved__nav-badge">
                                                {item.badge}
                                            </span>
                                        )} */}
                                    </NavLink>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    {/* Actions */}
                    <div className="header-improved__actions">
                        {/* Search Toggle */}
                        <button 
                            onClick={handleSearchToggle}
                            className={`header-improved__action-btn ${showSearchBar ? 'active' : ''}`}
                            title="Toggle search"
                        >
                            <FaSearch />
                        </button>

                        {/* Theme Toggle */}
                        <button 
                            onClick={toggleTheme}
                            className="header-improved__action-btn theme-toggle"
                            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                        >
                            {theme === 'dark' ? <FaSun /> : <FaMoon />}
                        </button>

                        {/* Favorites Quick Access */}
                        <Link 
                            to="/favorites"
                            className="header-improved__action-btn favorites-btn"
                            title={`${favoriteItems.length} favorites`}
                        >
                            <FaHeart />
                            {favoriteItems.length > 0 && (
                                <span className="header-improved__action-badge">
                                    {favoriteItems.length}
                                </span>
                            )}
                        </Link>

                        {/* Mobile Menu Toggle */}
                        <button 
                            onClick={handleMenuToggle}
                            className={`header-improved__menu-toggle ${isMenuOpen ? 'active' : ''}`}
                            aria-label="Toggle navigation menu"
                        >
                            {isMenuOpen ? <FaTimes /> : <FaBars />}
                        </button>
                    </div>
                </div>

                {/* Quick Search Bar */}
                {showSearchBar && (
                    <div className="header-improved__search-bar">
                        <div className="header-improved__search-container">
                            <FaSearch className="header-improved__search-icon" />
                            <input 
                                type="text"
                                placeholder="Quick search for albums, artists..."
                                className="header-improved__search-input"
                                autoFocus
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                                        window.location.href = `/covers?q=${encodeURIComponent(e.currentTarget.value)}`;
                                    }
                                }}
                            />
                            <button 
                                onClick={() => setShowSearchBar(false)}
                                className="header-improved__search-close"
                            >
                                <FaTimes />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Mobile Navigation Menu */}
            <div className={`header-improved__mobile-menu ${isMenuOpen ? 'open' : ''}`}>
                <div className="header-improved__mobile-menu-content">
                    <div className="header-improved__mobile-menu-header">
                        <h3>Navigation</h3>
                        <button 
                            onClick={() => setIsMenuOpen(false)}
                            className="header-improved__mobile-menu-close"
                        >
                            <FaTimes />
                        </button>
                    </div>

                    <nav className="header-improved__mobile-nav">
                        <ul className="header-improved__mobile-nav-list">
                            {navigationItems.map((item) => (
                                <li key={item.to} className="header-improved__mobile-nav-item">
                                    <NavLink 
                                        to={item.to}
                                        className={({ isActive }) => 
                                            `header-improved__mobile-nav-link ${isActive ? 'active' : ''}`
                                        }
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        <div className="header-improved__mobile-nav-icon">
                                            {item.icon}
                                        </div>
                                        <div className="header-improved__mobile-nav-content">
                                            <span className="header-improved__mobile-nav-label">
                                                {item.label}
                                            </span>
                                            <span className="header-improved__mobile-nav-description">
                                                {item.description}
                                            </span>
                                        </div>
                                        {/* {item.badge && (
                                            <span className="header-improved__mobile-nav-badge">
                                                {item.badge}
                                            </span>
                                        )} */}
                                    </NavLink>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    <div className="header-improved__mobile-menu-footer">
                        <button 
                            onClick={toggleTheme}
                            className="header-improved__mobile-theme-toggle"
                        >
                            {theme === 'dark' ? <FaSun /> : <FaMoon />}
                            <span>
                                {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                            </span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {isMenuOpen && (
                <div 
                    className="header-improved__overlay"
                    onClick={() => setIsMenuOpen(false)}
                />
            )}
        </header>
    );
}
