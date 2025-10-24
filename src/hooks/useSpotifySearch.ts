import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { searchItem, SpotifyAPIError } from '../api/spotify';
import { SpotifySearchResponse } from '../interfaces';

interface UseSpotifySearchOptions {
    enabled?: boolean;
    staleTime?: number;
    cacheTime?: number;
}

interface UseSpotifySearchReturn {
    data: SpotifySearchResponse | undefined;
    isLoading: boolean;
    isError: boolean;
    error: SpotifyAPIError | null;
    search: (query: string, limit?: number, types?: string[]) => void;
    clearResults: () => void;
    hasSearched: boolean;
}

export function useSpotifySearch(options: UseSpotifySearchOptions = {}): UseSpotifySearchReturn {
    const [searchParams, setSearchParams] = useState<{
        query: string;
        limit: number;
        types: string[];
    } | null>(null);

    const {
        data,
        isLoading,
        isError,
        error
    } = useQuery({
        queryKey: ['spotify-search', searchParams],
        queryFn: () => {
            if (!searchParams) throw new Error('No search parameters');
            return searchItem(searchParams.query, searchParams.limit, searchParams.types);
        },
        enabled: !!searchParams && (options.enabled !== false),
        staleTime: options.staleTime || 5 * 60 * 1000, // 5 minutes
        gcTime: options.cacheTime || 10 * 60 * 1000, // 10 minutes
        retry: (failureCount, error) => {
            // Don't retry on client errors (4xx)
            if (error instanceof SpotifyAPIError && error.status && error.status >= 400 && error.status < 500) {
                return false;
            }
            return failureCount < 2;
        },
    });

    const search = useCallback((query: string, limit = 50, types = ['album', 'track', 'artist']) => {
        if (!query.trim()) return;
        setSearchParams({ query: query.trim(), limit, types });
    }, []);

    const clearResults = useCallback(() => {
        setSearchParams(null);
    }, []);

    return {
        data,
        isLoading,
        isError,
        error: error as SpotifyAPIError | null,
        search,
        clearResults,
        hasSearched: !!searchParams,
    };
}
