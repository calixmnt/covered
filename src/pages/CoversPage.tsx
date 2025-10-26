import { useState, useEffect } from 'react';
import { Outlet, useSearchParams } from 'react-router-dom';
import { useSpotifySearch } from '../hooks/useSpotifySearch.ts';
import { useFavorites } from '../hooks/useFavorites.ts';
import { useShare } from '../hooks/useShare.ts';
import { useLanguage } from '../contexts/LanguageContext';
import { AdvancedSearch } from '../components/AdvancedSearch.tsx';
import { CoverGrid } from '../components/CoverImproved.tsx';
import { LoadingSpinner, SkeletonGrid } from '../components/LoadingSpinner.tsx';
import { ErrorMessage } from '../components/ErrorBoundary.tsx';
import { Filter } from '../interfaces/index.ts';
import { filterSpotifyItems } from '../utils/index.ts';
import FilterZone from '../components/FilterZone.tsx';

export default function CoversPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [activeFilter, setActiveFilter] = useState<Filter>('all');
    const [searchTypes, setSearchTypes] = useState<string[]>(['album', 'track', 'artist']);
    
    const { favorites, toggleFavorite } = useFavorites();
    const { shareItem } = useShare();
    const { data, isLoading, isError, error, search, hasSearched } = useSpotifySearch();
    const { t } = useLanguage();

    const searchTerm = searchParams.get('q') || '';

    // Handle search from URL parameters
    useEffect(() => {
        if (searchTerm && !hasSearched) {
            search(searchTerm, 50, searchTypes);
        }
    }, [searchTerm, hasSearched, search, searchTypes]);

    const handleAdvancedSearch = (query: string, _filters: any, types: string[]) => {
        setSearchTypes(types);
        search(query, 50, types);
        
        // Update URL
        const newParams = new URLSearchParams();
        newParams.set('q', query);
        setSearchParams(newParams, { replace: true });
    };

    const handleFavorite = (id: string) => {
        // Find the item in current results
        const allItems = [
            ...(data?.albums?.items || []),
            ...(data?.tracks?.items || []),
            ...(data?.artists?.items || [])
        ];
        
        const item = allItems.find(item => item.id === id);
        if (item) {
            let itemType: 'album' | 'track' | 'artist' = 'album';
            let itemImage = '';
            let itemTitle = '';
            let itemArtist = '';

            if ('album_type' in item) {
                // It's an album
                itemType = 'album';
                itemImage = item.images?.[0]?.url || '';
                itemTitle = item.name;
                itemArtist = item.artists?.[0]?.name || t.covers.unknownArtist;
            } else if ('album' in item) {
                // It's a track
                itemType = 'track';
                itemImage = item.album?.images?.[0]?.url || '';
                itemTitle = item.name;
                itemArtist = item.artists?.[0]?.name || t.covers.unknownArtist;
            } else {
                // It's an artist
                itemType = 'artist';
                itemImage = item.images?.[0]?.url || '';
                itemTitle = item.name;
                itemArtist = item.name;
            }

            toggleFavorite({
                id: item.id,
                title: itemTitle,
                artist: itemArtist,
                image: itemImage,
                type: itemType
            });
        }
    };

    const handleShare = async (id: string, title: string, artist: string) => {
        await shareItem({
            id,
            title,
            artist,
            type: 'album' // Default to album, could be improved
        });
    };

    // Filter and prepare data for display
    const filteredAlbums = filterSpotifyItems(
        data?.albums?.items || [],
        activeFilter
    );

    const coversData = filteredAlbums.map(album => ({
        id: album.id,
        image: album.images?.[0]?.url || '',
        title: album.name,
        artist: album.artists?.[0]?.name || t.covers.unknownArtist,
        releaseDate: album.release_date,
        albumType: album.album_type as 'album' | 'single' | 'compilation'
    }));

    const showResults = hasSearched && !isLoading;
    const hasResults = coversData.length > 0;

    return (
        <>
            <div className="covers-page-improved">
                <div className="container">
                    <AdvancedSearch
                        onSearch={handleAdvancedSearch}
                        isLoading={isLoading}
                        placeholder={t.covers.searchPlaceholder}
                    />

                    {hasSearched && (
                        <section className="covers-filters">
                            <h3>{t.covers.filtersTitle}</h3>
                            <FilterZone
                                activeFilter={activeFilter} 
                                onFilterChange={setActiveFilter} 
                            />
                        </section>
                    )}
                </div>

                <section className="container-xl">
                    {isLoading && (
                        <div className="covers-loading">
                            <LoadingSpinner 
                                size="large" 
                                message={t.covers.searchingMessage} 
                            />
                            <SkeletonGrid count={12} />
                        </div>
                    )}

                    {isError && error && (
                        <ErrorMessage 
                            error={error} 
                            onRetry={() => searchTerm && search(searchTerm, 50, searchTypes)}
                        />
                    )}

                    {showResults && hasResults && (
                        <div className="covers-results">
                            <div className="covers-results-header">
                                <h2>{t.covers.searchResults}</h2>
                                <p className="covers-count">
                                    <strong>{coversData.length}</strong> {coversData.length === 1 ? t.covers.resultCount : t.covers.resultCountPlural}
                                </p>
                            </div>
                            
                            <CoverGrid
                                covers={coversData}
                                onFavorite={handleFavorite}
                                onShare={handleShare}
                                favorites={favorites}
                                className="covers-main-grid"
                            />
                        </div>
                    )}

                    {showResults && !hasResults && !isError && (
                        <div className="covers-no-results">
                            <h3>{t.covers.noResultsTitle}</h3>
                            <p>{t.covers.noResultsDesc}</p>
                        </div>
                    )}

                    {!hasSearched && (
                        <div className="covers-welcome">
                            <h2>{t.covers.welcomeTitle}</h2>
                            <p>{t.covers.welcomeDesc}</p>
                        </div>
                    )}
                </section>
            </div>
            <Outlet />
        </>
    );
}
