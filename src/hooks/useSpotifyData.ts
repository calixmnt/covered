import { useQuery } from '@tanstack/react-query';
import { 
    getAlbumById, 
    getArtistDetailsById, 
    getAlbumsByArtistId, 
    getTrackById,
    getArtistTopTracks,
    getRelatedArtists,
    SpotifyAPIError 
} from '../api/spotify';

// Hook for fetching album details
export function useAlbum(albumId: string | undefined) {
    return useQuery({
        queryKey: ['album', albumId],
        queryFn: () => getAlbumById(albumId!),
        enabled: !!albumId,
        staleTime: 10 * 60 * 1000, // 10 minutes
        retry: (failureCount, error) => {
            if (error instanceof SpotifyAPIError && error.status === 404) {
                return false;
            }
            return failureCount < 2;
        },
    });
}

// Hook for fetching artist details
export function useArtist(artistId: string | undefined) {
    return useQuery({
        queryKey: ['artist', artistId],
        queryFn: () => getArtistDetailsById(artistId!),
        enabled: !!artistId,
        staleTime: 15 * 60 * 1000, // 15 minutes
        retry: (failureCount, error) => {
            if (error instanceof SpotifyAPIError && error.status === 404) {
                return false;
            }
            return failureCount < 2;
        },
    });
}

// Hook for fetching artist's albums
export function useArtistAlbums(
    artistId: string | undefined, 
    limit = 50, 
    includeGroups = ['album', 'single']
) {
    return useQuery({
        queryKey: ['artist-albums', artistId, limit, includeGroups],
        queryFn: () => getAlbumsByArtistId(artistId!, limit, includeGroups),
        enabled: !!artistId,
        staleTime: 10 * 60 * 1000,
        retry: (failureCount, error) => {
            if (error instanceof SpotifyAPIError && error.status === 404) {
                return false;
            }
            return failureCount < 2;
        },
    });
}

// Hook for fetching track details
export function useTrack(trackId: string | undefined) {
    return useQuery({
        queryKey: ['track', trackId],
        queryFn: () => getTrackById(trackId!),
        enabled: !!trackId,
        staleTime: 10 * 60 * 1000,
        retry: (failureCount, error) => {
            if (error instanceof SpotifyAPIError && error.status === 404) {
                return false;
            }
            return failureCount < 2;
        },
    });
}

// Hook for fetching artist's top tracks
export function useArtistTopTracks(artistId: string | undefined, market = 'US') {
    return useQuery({
        queryKey: ['artist-top-tracks', artistId, market],
        queryFn: () => getArtistTopTracks(artistId!, market),
        enabled: !!artistId,
        staleTime: 30 * 60 * 1000, // 30 minutes (top tracks don't change often)
        retry: (failureCount, error) => {
            if (error instanceof SpotifyAPIError && error.status === 404) {
                return false;
            }
            return failureCount < 2;
        },
    });
}

// Hook for fetching related artists
export function useRelatedArtists(artistId: string | undefined) {
    return useQuery({
        queryKey: ['related-artists', artistId],
        queryFn: () => getRelatedArtists(artistId!),
        enabled: !!artistId,
        staleTime: 60 * 60 * 1000, // 1 hour (related artists are quite stable)
        retry: (failureCount, error) => {
            if (error instanceof SpotifyAPIError && error.status === 404) {
                return false;
            }
            return failureCount < 2;
        },
    });
}

// Combined hook for artist page data
export function useArtistPageData(artistId: string | undefined) {
    const artistQuery = useArtist(artistId);
    const albumsQuery = useArtistAlbums(artistId);
    const topTracksQuery = useArtistTopTracks(artistId);
    const relatedArtistsQuery = useRelatedArtists(artistId);

    return {
        artist: artistQuery,
        albums: albumsQuery,
        topTracks: topTracksQuery,
        relatedArtists: relatedArtistsQuery,
        isLoading: artistQuery.isLoading || albumsQuery.isLoading,
        hasError: artistQuery.isError || albumsQuery.isError,
        error: artistQuery.error || albumsQuery.error,
    };
}
