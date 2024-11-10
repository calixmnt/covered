import {Album, Artist, Pagination, Track} from "../interfaces";

const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const secretId = import.meta.env.VITE_SPOTIFY_SECRET_ID;

type TokenResponse = {
    access_token :string;
    token_type : string;
    expires_in : number;
}

type SearchType = "artist" | "album" | "track";

type SearchResponse = {
    tracks: Pagination<Track>;
    albums: Pagination<Album>;
    artists: Pagination<Artist>;
};

export async function getToken() {
    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        body: new URLSearchParams({
            'grant_type': 'client_credentials',
        }),
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa(clientId + ':' + secretId),
        },
    });

    if (!response.ok) throw new Error(`Spotify token request failed with status ${response.status}`);

    const result : TokenResponse = await  response.json();
    return result;
}

export async function searchForItem(searchTerm:string, type:SearchType='album')  {

    const tokenResponse = await getToken();
    if (!tokenResponse) return;

    const response = await fetch(`https://api.spotify.com/v1/search?q=${searchTerm}&type=${type}`, {
        method: 'GET',
        headers: { 'Authorization': 'Bearer ' + tokenResponse.access_token },
    })

    if (!response.ok) throw new Error(`Spotify search request failed with status ${response.status}`);

    const result:SearchResponse = await response.json()
    return result;
}