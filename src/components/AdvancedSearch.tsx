import React, { useState } from 'react';
import { FaSearch, FaFilter, FaTimes } from 'react-icons/fa';

interface SearchFilters {
    year?: number;
    genre?: string;
    artist?: string;
    album?: string;
    track?: string;
}

interface AdvancedSearchProps {
    onSearch: (query: string, filters: SearchFilters, types: string[]) => void;
    isLoading?: boolean;
    placeholder?: string;
    className?: string;
}

export function AdvancedSearch({ 
    onSearch, 
    isLoading = false, 
    placeholder = "Search for music...",
    className = ""
}: AdvancedSearchProps) {
    const [query, setQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState<SearchFilters>({});
    const [selectedTypes, setSelectedTypes] = useState<string[]>(['album', 'track', 'artist']);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            onSearch(query.trim(), filters, selectedTypes);
        }
    };

    const handleFilterChange = (key: keyof SearchFilters, value: string | number) => {
        setFilters(prev => ({
            ...prev,
            [key]: value || undefined
        }));
    };

    const handleTypeToggle = (type: string) => {
        setSelectedTypes(prev => 
            prev.includes(type) 
                ? prev.filter(t => t !== type)
                : [...prev, type]
        );
    };

    const clearFilters = () => {
        setFilters({});
        setSelectedTypes(['album', 'track', 'artist']);
    };

    const hasActiveFilters = Object.values(filters).some(v => v) || selectedTypes.length !== 3;

    return (
        <div className={`advanced-search ${className}`}>
            <form onSubmit={handleSubmit} className="advanced-search__form">
                <div className="advanced-search__main">
                    <div className="advanced-search__input-container">
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder={placeholder}
                            className="advanced-search__input"
                            disabled={isLoading}
                        />
                        <button
                            type="button"
                            onClick={() => setShowFilters(!showFilters)}
                            className={`advanced-search__filter-btn ${showFilters ? 'active' : ''} ${hasActiveFilters ? 'has-filters' : ''}`}
                            title="Advanced filters"
                        >
                            <FaFilter />
                        </button>
                        <button
                            type="submit"
                            className="advanced-search__submit-btn"
                            disabled={isLoading || !query.trim()}
                        >
                            <FaSearch />
                        </button>
                    </div>
                </div>

                {showFilters && (
                    <div className="advanced-search__filters">
                        <div className="advanced-search__filters-header">
                            <h4>Advanced Filters</h4>
                            {hasActiveFilters && (
                                <button
                                    type="button"
                                    onClick={clearFilters}
                                    className="advanced-search__clear-btn"
                                >
                                    <FaTimes /> Clear All
                                </button>
                            )}
                        </div>

                        <div className="advanced-search__filter-group">
                            <label className="advanced-search__filter-label">Search Types:</label>
                            <div className="advanced-search__type-toggles">
                                {[
                                    { key: 'album', label: 'Albums' },
                                    { key: 'track', label: 'Tracks' },
                                    { key: 'artist', label: 'Artists' }
                                ].map(({ key, label }) => (
                                    <button
                                        key={key}
                                        type="button"
                                        onClick={() => handleTypeToggle(key)}
                                        className={`advanced-search__type-toggle ${selectedTypes.includes(key) ? 'active' : ''}`}
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="advanced-search__filter-row">
                            <div className="advanced-search__filter-group">
                                <label className="advanced-search__filter-label">Year:</label>
                                <input
                                    type="number"
                                    min="1900"
                                    max={new Date().getFullYear()}
                                    value={filters.year || ''}
                                    onChange={(e) => handleFilterChange('year', parseInt(e.target.value))}
                                    className="advanced-search__filter-input"
                                    placeholder="e.g. 2023"
                                />
                            </div>

                            <div className="advanced-search__filter-group">
                                <label className="advanced-search__filter-label">Genre:</label>
                                <input
                                    type="text"
                                    value={filters.genre || ''}
                                    onChange={(e) => handleFilterChange('genre', e.target.value)}
                                    className="advanced-search__filter-input"
                                    placeholder="e.g. rock, pop, jazz"
                                />
                            </div>
                        </div>

                        <div className="advanced-search__filter-row">
                            <div className="advanced-search__filter-group">
                                <label className="advanced-search__filter-label">Artist:</label>
                                <input
                                    type="text"
                                    value={filters.artist || ''}
                                    onChange={(e) => handleFilterChange('artist', e.target.value)}
                                    className="advanced-search__filter-input"
                                    placeholder="Artist name"
                                />
                            </div>

                            <div className="advanced-search__filter-group">
                                <label className="advanced-search__filter-label">Album:</label>
                                <input
                                    type="text"
                                    value={filters.album || ''}
                                    onChange={(e) => handleFilterChange('album', e.target.value)}
                                    className="advanced-search__filter-input"
                                    placeholder="Album name"
                                />
                            </div>
                        </div>

                        <div className="advanced-search__filter-group">
                            <label className="advanced-search__filter-label">Track:</label>
                            <input
                                type="text"
                                value={filters.track || ''}
                                onChange={(e) => handleFilterChange('track', e.target.value)}
                                className="advanced-search__filter-input"
                                placeholder="Track name"
                            />
                        </div>
                    </div>
                )}
            </form>
        </div>
    );
}
