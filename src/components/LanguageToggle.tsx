import { useLanguage } from '../contexts/LanguageContext';
import '../styles/language-toggle.css';

export function LanguageToggle() {
    const { language, setLanguage } = useLanguage();

    const toggleLanguage = () => {
        setLanguage(language === 'en' ? 'fr' : 'en');
    };

    return (
        <button
            onClick={toggleLanguage}
            className="language-toggle"
            title={`Switch to ${language === 'en' ? 'Français' : 'English'}`}
            aria-label={`Switch language to ${language === 'en' ? 'French' : 'English'}`}
        >
            <span className="language-toggle__flag">
                {language === 'en' ? '🇫🇷' : '🇬🇧'}
            </span>
            <span className="language-toggle__text">
                {language === 'en' ? 'FR' : 'EN'}
            </span>
        </button>
    );
}
