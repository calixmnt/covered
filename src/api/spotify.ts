import { getToken } from "../service/spotifyService.ts";
import {
    SpotifyAlbum,
    SpotifyArtist,
    SpotifySearchResponse,
    SpotifyTrack,
} from "../interfaces";
import {getRandomLetter} from "../utils";

const limit = 50;
const token = await getToken();

//GET https://api.spotify.com/v1/search
export const searchItem = async (query: string) => {
  const response = await fetch(
    `https://api.spotify.com/v1/search?q=${query}&type=album,track,artist&limit=${limit}`,
    {
      method: "GET",
      headers: { Authorization: "Bearer " + token },
    },
  );

  if (!response.ok)
    throw new Error(
      `Spotify search request failed with status ${response.status}`,
    );

  const results: SpotifySearchResponse = await response.json();
  return results;
};

export const searchArtist = async (query: string) => {
  const response = await fetch(
      `https://api.spotify.com/v1/search?q=${query}&type=artist&limit=${limit}`,
      {
        method: "GET",
        headers: { Authorization: "Bearer " + token },
      },
  );

  if (!response.ok)
    throw new Error(
        `Spotify search request failed with status ${response.status}`,
    );

  const results: SpotifySearchResponse = await response.json();
  return results;
};

//GET https://api.spotify.com/v1/albums/{id}
export const getAlbumById = async (albumId: string) => {
  const response = await fetch(
    `https://api.spotify.com/v1/albums/${albumId}`,
    {
      method: "GET",
      headers: { Authorization: "Bearer " + token },
    },
  );

  if (!response.ok)
    throw new Error(
      `Spotify search request failed with status ${response.status}`,
    );

  const album: SpotifyAlbum = await response.json();
  return album;
};

//GET https://api.spotify.com/v1/tracks/{id}
export const getTrackById = async (trackId: string) => {
  const response = await fetch(
    `https://api.spotify.com/v1/tracks/${trackId}&limit=${limit}`,
    {
      method: "GET",
      headers: { Authorization: "Bearer " + token },
    },
  );

  if (!response.ok)
    throw new Error(
      `Spotify search request failed with status ${response.status}`,
    );

  const track: SpotifyTrack = await response.json();
  return track;
};

//GET https://api.spotify.com/v1/artists/{id}/albums
export const getAlbumsByArtistId = async (artistId: string) => {
  const response = await fetch(
    `https://api.spotify.com/v1/artists/${artistId}/albums`,
    {
      method: "GET",
      headers: { Authorization: "Bearer " + token },
    },
  );

  if (!response.ok)
    throw new Error(
      `Spotify search request failed with status ${response.status}`,
    );

    const data = await response.json();
    console.log("API response:", data);
    return data;
};

//GET https://api.spotify.com/v1/artists/{id}
export const getArtistDetailsById = async (artistId: string) => {
  const response = await fetch(
    `https://api.spotify.com/v1/artists/${artistId}`,
    {
      method: "GET",
      headers: { Authorization: "Bearer " + token },
    },
  );

  if (!response.ok)
    throw new Error(
      `Spotify search request failed with status ${response.status}`,
    );

  const artistDetails: SpotifyArtist = await response.json();
  return artistDetails;
};

export function getRandomItemLoader() {
    return async function loader() {

        const searchTerm = getRandomLetter();
        const response = await fetch(
            `https://api.spotify.com/v1/search?q=${searchTerm}&limit=50`,
            {
                method: "GET",
                headers: { Authorization: "Bearer " + token },
            },
        );

        if (!response.ok)
            throw new Error(
                `Spotify search request failed with status ${response.status}`,
            );

        const data: SpotifySearchResponse = await response.json();

        if (!data.albums) return;

        const items = data.albums.items;
        if (items.length === 0) return null;

        return items[Math.floor(Math.random() * items.length)].id;
    };
}