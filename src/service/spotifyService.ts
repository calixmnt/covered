interface TokenResponse {
    access_token: string;
    token_type: string;
    expires_in: number;
}

const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const secretId = import.meta.env.VITE_SPOTIFY_SECRET_ID;
let cachedToken: string | null = null;
let tokenExpiration: number = 0;

export async function getToken(): Promise<string> {
    const currentTime = Date.now();

    if (cachedToken && currentTime < tokenExpiration) {
        return cachedToken;
    }

    const response = await fetch("https://accounts.spotify.com/api/token", {
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
        throw new Error(`Spotify token request failed with status ${response.status}`);
    }

    const result: TokenResponse = await response.json();

    cachedToken = result.access_token;
    tokenExpiration = currentTime + (result.expires_in * 1000);

    return cachedToken;
}
