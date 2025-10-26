import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    FaSearch, 
    FaMicrophone, 
    FaRandom,
    FaClock,
    FaTimes
} from 'react-icons/fa';
import { useTheme } from '../hooks/useTheme';
import { useLanguage } from '../contexts/LanguageContext';

interface SearchBarProps {
    placeholder?: string;
    isTopPosition?: boolean;
    isBottomFixed?: boolean;
    onSearch?: (query: string) => void;
    redirectTo?: string;
    showSuggestions?: boolean;
}

const POPULAR_SEARCHES = [
    'Alpha Blondy - Jérusalem',
    'Magic System - Premier Gaou',
    'Fela Kuti - Zombie',
    'Youssou N\'Dour - 7 Seconds',
    'Salif Keita - Soro',
    'Angelique Kidjo - Logozo',
    'DJ Arafat - Yorobo',
    'Tiken Jah Fakoly - Françafrique'
];

const SEARCH_SUGGESTIONS = [
    'coupé-décalé',
    'afrobeat',
    'reggae africain',
    'zouglou',
    'makossa',
    'ndombolo'
];

export function SearchBar({
    placeholder,
    isTopPosition = false,
    isBottomFixed = false,
    onSearch,
    redirectTo = '/covers',
    showSuggestions = true
}: SearchBarProps) {
    const [query, setQuery] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [recentSearches, setRecentSearches] = useState<string[]>([]);
    const [isListening, setIsListening] = useState(false);
    
    const navigate = useNavigate();
    const inputRef = useRef<HTMLInputElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { theme } = useTheme();
    const { t } = useLanguage();

    // Load recent searches from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('covered-recent-searches');
        if (saved) {
            try {
                setRecentSearches(JSON.parse(saved));
            } catch (error) {
                console.error('Error loading recent searches:', error);
            }
        }
    }, []);

    // Handle click outside to close dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const saveRecentSearch = (searchQuery: string) => {
        if (!searchQuery.trim()) return;
        
        const updated = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5);
        setRecentSearches(updated);
        localStorage.setItem('covered-recent-searches', JSON.stringify(updated));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        saveRecentSearch(query);
        setShowDropdown(false);
        
        if (onSearch) {
            onSearch(query);
        }
        
        if (redirectTo) {
            navigate(`${redirectTo}?q=${encodeURIComponent(query)}`);
        }
    };

    const handleSuggestionClick = (suggestion: string) => {
        setQuery(suggestion);
        saveRecentSearch(suggestion);
        setShowDropdown(false);
        
        if (onSearch) {
            onSearch(suggestion);
        }
        
        if (redirectTo) {
            navigate(`${redirectTo}?q=${encodeURIComponent(suggestion)}`);
        }
    };

    const handleRandomSearch = () => {
        const randomSuggestion = SEARCH_SUGGESTIONS[Math.floor(Math.random() * SEARCH_SUGGESTIONS.length)];
        handleSuggestionClick(randomSuggestion);
    };

    const handleVoiceSearch = () => {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            alert('Voice search is not supported in your browser');
            return;
        }

        const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
        const recognition = new SpeechRecognition();
        
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        setIsListening(true);

        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            setQuery(transcript);
            setIsListening(false);
        };

        recognition.onerror = () => {
            setIsListening(false);
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognition.start();
    };

    const clearRecentSearches = () => {
        setRecentSearches([]);
        localStorage.removeItem('covered-recent-searches');
    };

    const handleFocus = () => {
        setIsFocused(true);
        if (showSuggestions) {
            setShowDropdown(true);
        }
    };

    const handleBlur = () => {
        setIsFocused(false);
        // Delay hiding dropdown to allow clicks on suggestions
        setTimeout(() => setShowDropdown(false), 200);
    };

    return (
        <div className={`search-bar-improved ${isTopPosition ? 'top-position' : ''} ${isBottomFixed ? 'bottom-fixed' : ''} theme-${theme}`}>
            <div className="container">
                <form onSubmit={handleSubmit} className="search-bar-improved__form">
                    <div className="search-bar-improved__container" ref={dropdownRef}>
                        <div className={`search-bar-improved__input-wrapper ${isFocused ? 'focused' : ''}`}>
                            <FaSearch className="search-bar-improved__icon search-icon" />
                            
                            <input
                                ref={inputRef}
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onFocus={handleFocus}
                                onBlur={handleBlur}
                                placeholder={placeholder || t.search.placeholder}
                                className="search-bar-improved__input"
                            />
                            
                            <div className="search-bar-improved__actions">
                                {query && (
                                    <button
                                        type="button"
                                        onClick={() => setQuery('')}
                                        className="search-bar-improved__clear-btn"
                                        title={t.search.clearSearch}
                                    >
                                        <FaTimes />
                                    </button>
                                )}
                                
                                <button
                                    type="button"
                                    onClick={handleVoiceSearch}
                                    className={`search-bar-improved__voice-btn ${isListening ? 'listening' : ''}`}
                                    title={t.search.voiceSearch}
                                >
                                    <FaMicrophone />
                                </button>
                                
                                <button
                                    type="button"
                                    onClick={handleRandomSearch}
                                    className="search-bar-improved__random-btn"
                                    title={t.search.randomSearch}
                                >
                                    <FaRandom />
                                </button>
                            </div>
                        </div>

                        {/* Dropdown with suggestions */}
                        {showDropdown && showSuggestions && (
                            <div className="search-bar-improved__dropdown">
                                {/* Recent searches */}
                                {recentSearches.length > 0 && (
                                    <div className="search-bar-improved__section">
                                        <div className="search-bar-improved__section-header">
                                            <h4>
                                                <FaClock /> {t.search.recentSearches}
                                            </h4>
                                            <button 
                                                onClick={clearRecentSearches}
                                                className="search-bar-improved__clear-all"
                                            >
                                                {t.search.clearAll}
                                            </button>
                                        </div>
                                        <div className="search-bar-improved__suggestions">
                                            {recentSearches.map((search, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => handleSuggestionClick(search)}
                                                    className="search-bar-improved__suggestion recent"
                                                >
                                                    <FaClock />
                                                    <span>{search}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Popular searches */}
                                <div className="search-bar-improved__section">
                                    <h4 className="search-bar-improved__section-header">
                                        {t.search.popularSearches}
                                    </h4>
                                    <div className="search-bar-improved__suggestions">
                                        {POPULAR_SEARCHES.slice(0, 4).map((search, index) => (
                                            <button
                                                key={index}
                                                onClick={() => handleSuggestionClick(search)}
                                                className="search-bar-improved__suggestion popular"
                                            >
                                                <FaSearch />
                                                <span>{search}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Quick suggestions */}
                                <div className="search-bar-improved__section">
                                    <h4 className="search-bar-improved__section-header">
                                        {t.search.quickDiscoveries}
                                    </h4>
                                    <div className="search-bar-improved__quick-suggestions">
                                        {SEARCH_SUGGESTIONS.map((suggestion, index) => (
                                            <button
                                                key={index}
                                                onClick={() => handleSuggestionClick(suggestion)}
                                                className="search-bar-improved__quick-suggestion"
                                            >
                                                {suggestion}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}
