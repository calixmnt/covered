import { getToken } from "../service/spotifyService.ts";
import {
    SpotifyAlbum,
    SpotifyArtist,
    SpotifySearchResponse,
    SpotifyTrack,
} from "../interfaces";
import { getRandomLetter } from "../utils";

const SPOTIFY_BASE_URL = 'https://api.spotify.com/v1';
const DEFAULT_LIMIT = 50;
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

// Simple in-memory cache
const cache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export class SpotifyAPIError extends Error {
    constructor(
        message: string,
        public status?: number,
        public endpoint?: string
    ) {
        super(message);
        this.name = 'SpotifyAPIError';
    }
}

// Utility function for delays
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Generic API call function with retry logic
async function makeSpotifyRequest<T>(
    endpoint: string,
    options: RequestInit = {},
    retries = MAX_RETRIES
): Promise<T> {
    // Check cache first
    const cacheKey = `${endpoint}_${JSON.stringify(options)}`;
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        return cached.data as T;
    }

    try {
        const token = await getToken();
        const url = endpoint.startsWith('http') ? endpoint : `${SPOTIFY_BASE_URL}${endpoint}`;
        
        const response = await fetch(url, {
            ...options,
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                ...options.headers,
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
            
            try {
                const errorData = JSON.parse(errorText);
                errorMessage = errorData.error?.message || errorMessage;
            } catch {
                // Keep default error message if JSON parsing fails
            }

            // Handle rate limiting (429) with exponential backoff
            if (response.status === 429 && retries > 0) {
                const retryAfter = response.headers.get('Retry-After');
                const waitTime = retryAfter ? parseInt(retryAfter) * 1000 : RETRY_DELAY * (MAX_RETRIES - retries + 1);
                
                console.warn(`Rate limited. Retrying after ${waitTime}ms...`);
                await delay(waitTime);
                return makeSpotifyRequest<T>(endpoint, options, retries - 1);
            }

            // Retry on server errors (5xx) or network issues
            if ((response.status >= 500 || response.status === 0) && retries > 0) {
                console.warn(`Server error ${response.status}. Retrying... (${retries} attempts left)`);
                await delay(RETRY_DELAY * (MAX_RETRIES - retries + 1));
                return makeSpotifyRequest<T>(endpoint, options, retries - 1);
            }

            throw new SpotifyAPIError(errorMessage, response.status, endpoint);
        }

        const data: T = await response.json();
        
        // Cache successful responses
        cache.set(cacheKey, { data, timestamp: Date.now() });
        
        return data;
    } catch (error) {
        if (error instanceof SpotifyAPIError) {
            throw error;
        }
        
        // Network errors - retry if we have attempts left
        if (retries > 0) {
            console.warn(`Network error. Retrying... (${retries} attempts left)`);
            await delay(RETRY_DELAY * (MAX_RETRIES - retries + 1));
            return makeSpotifyRequest<T>(endpoint, options, retries - 1);
        }
        
        throw new SpotifyAPIError(
            `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`,
            undefined,
            endpoint
        );
    }
}

// Clear cache utility
export function clearCache(): void {
    cache.clear();
}

//GET https://api.spotify.com/v1/search
export const searchItem = async (
    query: string, 
    limit: number = DEFAULT_LIMIT,
    types: string[] = ['album', 'track', 'artist']
): Promise<SpotifySearchResponse> => {
    if (!query.trim()) {
        throw new SpotifyAPIError('Search query cannot be empty');
    }

    const encodedQuery = encodeURIComponent(query.trim());
    const typeString = types.join(',');
    const endpoint = `/search?q=${encodedQuery}&type=${typeString}&limit=${limit}`;
    
    return makeSpotifyRequest<SpotifySearchResponse>(endpoint);
};

export const searchArtist = async (
    query: string, 
    limit: number = DEFAULT_LIMIT
): Promise<SpotifySearchResponse> => {
    return searchItem(query, limit, ['artist']);
};

//GET https://api.spotify.com/v1/albums/{id}
export const getAlbumById = async (albumId: string): Promise<SpotifyAlbum> => {
    if (!albumId?.trim()) {
        throw new SpotifyAPIError('Album ID is required');
    }

    const endpoint = `/albums/${albumId.trim()}`;
    return makeSpotifyRequest<SpotifyAlbum>(endpoint);
};

//GET https://api.spotify.com/v1/tracks/{id}
export const getTrackById = async (trackId: string): Promise<SpotifyTrack> => {
    if (!trackId?.trim()) {
        throw new SpotifyAPIError('Track ID is required');
    }

    const endpoint = `/tracks/${trackId.trim()}`;
    return makeSpotifyRequest<SpotifyTrack>(endpoint);
};

//GET https://api.spotify.com/v1/artists/{id}/albums
export const getAlbumsByArtistId = async (
    artistId: string,
    limit: number = DEFAULT_LIMIT,
    includeGroups: string[] = ['album', 'single']
): Promise<{ items: SpotifyAlbum[]; total: number; limit: number; offset: number }> => {
    if (!artistId?.trim()) {
        throw new SpotifyAPIError('Artist ID is required');
    }

    const includeGroupsString = includeGroups.join(',');
    const endpoint = `/artists/${artistId.trim()}/albums?include_groups=${includeGroupsString}&limit=${limit}`;
    
    return makeSpotifyRequest<{ items: SpotifyAlbum[]; total: number; limit: number; offset: number }>(endpoint);
};

//GET https://api.spotify.com/v1/artists/{id}
export const getArtistDetailsById = async (artistId: string): Promise<SpotifyArtist> => {
    if (!artistId?.trim()) {
        throw new SpotifyAPIError('Artist ID is required');
    }

    const endpoint = `/artists/${artistId.trim()}`;
    return makeSpotifyRequest<SpotifyArtist>(endpoint);
};

export function getRandomItemLoader() {
    return async function loader(): Promise<string | null> {
        const maxAttempts = 5;
        
        for (let attempt = 0; attempt < maxAttempts; attempt++) {
            try {
                const searchTerm = getRandomLetter();
                const data = await searchItem(searchTerm, 50, ['album']);

                if (!data.albums?.items || data.albums.items.length === 0) {
                    continue; // Try next attempt
                }

                // Filter albums to get only those with images and proper data
                const validAlbums = data.albums.items.filter(album => 
                    album.images && 
                    album.images.length > 0 && 
                    album.name && 
                    album.artists && 
                    album.artists.length > 0 &&
                    album.available_markets && 
                    album.available_markets.length > 0
                );

                if (validAlbums.length === 0) {
                    continue; // Try next attempt
                }

                const randomIndex = Math.floor(Math.random() * validAlbums.length);
                const selectedAlbum = validAlbums[randomIndex];
                
                // Verify the album is accessible by trying to fetch its details
                try {
                    await getAlbumById(selectedAlbum.id);
                    return selectedAlbum.id;
                } catch (verifyError) {
                    console.warn(`Album ${selectedAlbum.id} not accessible, trying another...`);
                    continue; // Try next attempt
                }
                
            } catch (error) {
                console.error(`Error in getRandomItemLoader attempt ${attempt + 1}:`, error);
                continue; // Try next attempt
            }
        }
        
        console.error('Failed to find a valid random album after all attempts');
        return null;
    };
}

// Additional utility functions
export const getMultipleAlbums = async (albumIds: string[]): Promise<{ albums: SpotifyAlbum[] }> => {
    if (!albumIds.length) {
        throw new SpotifyAPIError('At least one album ID is required');
    }

    const ids = albumIds.slice(0, 20).join(','); // Spotify allows max 20 IDs
    const endpoint = `/albums?ids=${ids}`;
    
    return makeSpotifyRequest<{ albums: SpotifyAlbum[] }>(endpoint);
};

export const getMultipleTracks = async (trackIds: string[]): Promise<{ tracks: SpotifyTrack[] }> => {
    if (!trackIds.length) {
        throw new SpotifyAPIError('At least one track ID is required');
    }

    const ids = trackIds.slice(0, 50).join(','); // Spotify allows max 50 IDs
    const endpoint = `/tracks?ids=${ids}`;
    
    return makeSpotifyRequest<{ tracks: SpotifyTrack[] }>(endpoint);
};

// Get artist's top tracks
export const getArtistTopTracks = async (
    artistId: string,
    market: string = 'US'
): Promise<{ tracks: SpotifyTrack[] }> => {
    if (!artistId?.trim()) {
        throw new SpotifyAPIError('Artist ID is required');
    }

    const endpoint = `/artists/${artistId.trim()}/top-tracks?market=${market}`;
    return makeSpotifyRequest<{ tracks: SpotifyTrack[] }>(endpoint);
};

// Get related artists
export const getRelatedArtists = async (artistId: string): Promise<{ artists: SpotifyArtist[] }> => {
    if (!artistId?.trim()) {
        throw new SpotifyAPIError('Artist ID is required');
    }

    const endpoint = `/artists/${artistId.trim()}/related-artists`;
    return makeSpotifyRequest<{ artists: SpotifyArtist[] }>(endpoint);
};

// Advanced search with filters
export const advancedSearch = async (
    query: string,
    filters: {
        year?: number;
        genre?: string;
        artist?: string;
        album?: string;
        track?: string;
    } = {},
    limit: number = DEFAULT_LIMIT,
    types: string[] = ['album', 'track', 'artist']
): Promise<SpotifySearchResponse> => {
    let searchQuery = query.trim();
    
    // Add filters to search query
    if (filters.year) searchQuery += ` year:${filters.year}`;
    if (filters.genre) searchQuery += ` genre:"${filters.genre}"`;
    if (filters.artist) searchQuery += ` artist:"${filters.artist}"`;
    if (filters.album) searchQuery += ` album:"${filters.album}"`;
    if (filters.track) searchQuery += ` track:"${filters.track}"`;
    
    return searchItem(searchQuery, limit, types);
};
