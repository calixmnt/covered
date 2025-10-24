interface TokenResponse {
    access_token: string;
    token_type: string;
    expires_in: number;
}

interface SpotifyError {
    error: {
        status: number;
        message: string;
    };
}

class SpotifyServiceError extends Error {
    constructor(
        message: string,
        public status?: number,
        public originalError?: unknown
    ) {
        super(message);
        this.name = 'SpotifyServiceError';
    }
}

const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const secretId = import.meta.env.VITE_SPOTIFY_SECRET_ID;

if (!clientId || !secretId) {
    throw new SpotifyServiceError(
        'Spotify credentials are missing. Please check your environment variables.'
    );
}

let cachedToken: string | null = null;
let tokenExpiration: number = 0;

const SPOTIFY_ACCOUNTS_URL = 'https://accounts.spotify.com/api/token';
const TOKEN_BUFFER_TIME = 5 * 60 * 1000; // 5 minutes buffer before expiration

export async function getToken(): Promise<string> {
    const currentTime = Date.now();

    // Return cached token if still valid (with buffer time)
    if (cachedToken && currentTime < (tokenExpiration - TOKEN_BUFFER_TIME)) {
        return cachedToken;
    }

    try {
        const response = await fetch(SPOTIFY_ACCOUNTS_URL, {
            method: "POST",
            body: new URLSearchParams({
                grant_type: "client_credentials",
            }),
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: "Basic " + btoa(clientId + ":" + secretId),
            },
        });

        if (!response.ok) {
            const errorData: SpotifyError = await response.json().catch(() => ({
                error: { status: response.status, message: 'Unknown error' }
            }));
            
            throw new SpotifyServiceError(
                `Failed to get Spotify token: ${errorData.error.message}`,
                response.status
            );
        }

        const result: TokenResponse = await response.json();

        if (!result.access_token) {
            throw new SpotifyServiceError('Invalid token response from Spotify');
        }

        cachedToken = result.access_token;
        tokenExpiration = currentTime + (result.expires_in * 1000);

        return cachedToken;
    } catch (error) {
        // Clear cached token on error
        cachedToken = null;
        tokenExpiration = 0;
        
        if (error instanceof SpotifyServiceError) {
            throw error;
        }
        
        throw new SpotifyServiceError(
            'Network error while fetching Spotify token',
            undefined,
            error
        );
    }
}

// Utility function to clear token cache (useful for testing or manual refresh)
export function clearTokenCache(): void {
    cachedToken = null;
    tokenExpiration = 0;
}

// Check if we have a valid token without making a request
export function hasValidToken(): boolean {
    return cachedToken !== null && Date.now() < (tokenExpiration - TOKEN_BUFFER_TIME);
}
