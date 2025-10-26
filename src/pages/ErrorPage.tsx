import { Link } from 'react-router-dom';
import { FaHome, FaSearch, FaExclamationTriangle } from 'react-icons/fa';
import { Logo } from '../components/Logo';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../hooks/useTheme';

function ErrorPage() {
    const { t } = useLanguage();
    const { theme } = useTheme();

    return (
        <div className="error-page">
            <div className="error-page__content">
                <Logo 
                    size="large" 
                    variant={theme === 'dark' ? 'white' : 'black'} 
                    crop="tight" 
                    className="error-page__logo" 
                />
                
                <div className="error-page__icon">
                    <FaExclamationTriangle />
                </div>
                
                <h1 className="error-page__title">404</h1>
                <h2 className="error-page__subtitle">{t.common.pageNotFound || 'Page Not Found'}</h2>
                <p className="error-page__description">
                    {t.common.pageNotFoundDesc || 'The page you are looking for does not exist or has been moved.'}
                </p>
                
                <div className="error-page__actions">
                    <Link to="/" className="error-page__btn primary">
                        <FaHome />
                        {t.common.backToHome || 'Back to Home'}
                    </Link>
                    <Link to="/covers" className="error-page__btn secondary">
                        <FaSearch />
                        {t.header.explore || 'Explore Music'}
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default ErrorPage;