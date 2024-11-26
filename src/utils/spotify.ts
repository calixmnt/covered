import {
  Album,
  Artist,
  Pagination,
  SearchResponse,
  SearchType,
  Track,
} from "../interfaces";
import { getRandomLetter } from "./index.ts";

const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const secretId = import.meta.env.VITE_SPOTIFY_SECRET_ID;
const limit = 9;

type TokenResponse = {
  access_token: string;
  token_type: string;
  expires_in: number;
};

export async function getToken() {
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

  if (!response.ok)
    throw new Error(
      `Spotify token request failed with status ${response.status}`,
    );

  const result: TokenResponse = await response.json();
  return result;
}

export async function searchForItem(
  searchTerm: string,
  type: SearchType = "album",
) {
  const tokenResponse = await getToken();
  if (!tokenResponse) return;

  const response = await fetch(
    `https://api.spotify.com/v1/search?q=${searchTerm}&type=${type}&limit=${limit}`,
    {
      method: "GET",
      headers: { Authorization: "Bearer " + tokenResponse.access_token },
    },
  );

  if (!response.ok)
    throw new Error(
      `Spotify search request failed with status ${response.status}`,
    );

  const result: SearchResponse = await response.json();
  console.log("results :", result);
  const filteredAlbums = result.albums.items.filter(
    (album) => album.album_type === "album",
    // (album.album_type === "single" && !album.release_date)
  );

  console.log("filteredAlbums : ", filteredAlbums);
  return filteredAlbums;
}

export function getRandomItemLoader(type: "album" | "track") {
  return async function loader() {
    const tokenResponse = await getToken();
    if (!tokenResponse) return;

    const searchTerm = getRandomLetter();
    const response = await fetch(
      `https://api.spotify.com/v1/search?q=${searchTerm}&type=${type}&limit=50`,
      {
        method: "GET",
        headers: { Authorization: "Bearer " + tokenResponse.access_token },
      },
    );

    if (!response.ok)
      throw new Error(
        `Spotify search request failed with status ${response.status}`,
      );

    const data: SearchResponse = await response.json();

    const items = type === "album" ? data.albums.items : data.tracks.items;
    if (items.length === 0) return null;

    return items[Math.floor(Math.random() * items.length)].id;
  };
}

export async function getDetailedUniqueItems(searchTerm: string) {
  const tokenResponse = await getToken();
  if (!tokenResponse) return;

  const response = await fetch(
    `https://api.spotify.com/v1/search?q=${encodeURIComponent(searchTerm)}&type=album,track&limit=${limit}`,
    {
      method: "GET",
      headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
    },
  );

  if (!response.ok)
    throw new Error(
      `Spotify search request failed with status ${response.status}`,
    );

  const result: SearchResponse = await response.json();

  console.log("result :", result);

  const albums = result.albums.items.filter(
    (item) => item.album_type === "album",
  );

  const singles = result.albums.items.filter(
    (item) => item.album_type === "single",
  );

  const tracks = result.tracks.items;

  const trackDetails = await Promise.all(
    tracks.map(async (track) => {
      const detailedTrack: Track = await fetch(
        `https://api.spotify.com/v1/tracks/${track.id}`,
        {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        },
      ).then((res) => res.json());

      return detailedTrack;
    }),
  );

  console.log("trackDetails :", trackDetails);

  const albumDetails = await Promise.all(
    albums.map(async (album) => {
      const detailedAlbum: Album = await fetch(
        `https://api.spotify.com/v1/albums/${album.id}`,
        {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        },
      ).then((res) => res.json());

      return detailedAlbum;
    }),
  );

  // Construire un set des IDs de tracks liés aux albums
  const albumTrackIds = new Set(
    albumDetails.flatMap((album: Album) =>
      album.tracks.items.map((track: Track) => track.id),
    ),
  );

  // Filtrer les singles indépendants
  const independentSingles = singles.filter(
    (single) => !albumTrackIds.has(single.id),
  );

  // Charger les détails des singles indépendants
  const detailedSingles = await Promise.all(
    independentSingles.map(async (single) => {
      const detailedSingle: Album = await fetch(
        `https://api.spotify.com/v1/albums/${single.id}`,
        {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        },
      ).then((res) => res.json());

      return detailedSingle;
    }),
  );

  return {
    albums: albumDetails,
    singles: detailedSingles,
  };
}

export async function getTracksBySearchTerm(searchTerm: string) {
  const tokenResponse = await getToken();
  if (!tokenResponse) return;

  const response = await fetch(
    `https://api.spotify.com/v1/search?q=${encodeURIComponent(searchTerm)}&type=track&limit=${limit}`,
    {
      method: "GET",
      headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
    },
  );
  if (!response.ok)
    throw new Error(
      `Spotify search request failed with status ${response.status}`,
    );
  const result: Pagination<Track> = await response.json();
  return result;
}

export async function getAlbumByTrackId(trackId: string) {
  const tokenResponse = await getToken();
  if (!tokenResponse) return;

  const response = await fetch(
    `https://api.spotify.com/v1/tracks/${trackId}/album`,
    {
      method: "GET",
      headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
    },
  );
  if (!response.ok)
    throw new Error(
      `Spotify search request failed with status ${response.status}`,
    );
}
