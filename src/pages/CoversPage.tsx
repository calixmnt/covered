import { useState, useEffect } from 'react';
import { Outlet, useSearchParams } from 'react-router-dom';
import { useSpotifySearch } from '../hooks/useSpotifySearch.ts';
import { useFavorites } from '../hooks/useFavorites.ts';
import { useShare } from '../hooks/useShare.ts';
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
                itemArtist = item.artists?.[0]?.name || '';
            } else if ('album' in item) {
                // It's a track
                itemType = 'track';
                itemImage = item.album?.images?.[0]?.url || '';
                itemTitle = item.name;
                itemArtist = item.artists?.[0]?.name || '';
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
        artist: album.artists?.[0]?.name || 'Unknown Artist',
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
                        placeholder="Search for albums, tracks, or artists..."
                    />

                    {hasSearched && (
                        <section className="covers-filters">
                            <h3>Filters</h3>
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
                                message="Searching for music..." 
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
                                <h2>Search Results</h2>
                                <p className="covers-count">
                                    <strong>{coversData.length}</strong> {coversData.length === 1 ? 'result' : 'results'} found
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
                            <h3>No Results Found</h3>
                            <p>Try adjusting your search terms or filters.</p>
                        </div>
                    )}

                    {!hasSearched && (
                        <div className="covers-welcome">
                            <h2>Discover Amazing Music</h2>
                            <p>Use the search above to find your favorite albums, tracks, and artists.</p>
                        </div>
                    )}
                </section>
            </div>
            <Outlet />
        </>
    );
}
