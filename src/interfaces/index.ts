export interface Image {
  url: string;
  height: number;
  width: number;
}

export interface Artist {
  href: string;
  id: string;
  name: string;
  type: "artist";
  uri: string;
}

export interface Album {
  album_type: "album" | "compilation" | "single";
  total_tracks: number;
  href: string;
  id: string;
  images: Image[];
  name: string;
  release_date: string;
  release_date_precision: "day" | "month" | "year";
  type: "album";
  uri: string;
  artists: Artist[];
  tracks: Pagination<Track>;
  popularity: number;
}

export interface Track {
  album: Album;
  artists: Artist[];
  duration_ms: number;
  explicit: boolean;
  href: string;
  id: string;
  is_playable: boolean;
  name: string;
  popularity: number;
  preview_url: string;
  track_number: number;
  external_urls: { spotify: string };
  type: "track";
  uri: string;
}

export interface Pagination<T> {
  href: string;
  limit: number;
  next: string | null;
  offset: number;
  previous: string | null;
  total: number;
  items: T[];
}

export type SearchType = "artist" | "album" | "track";

export type SearchResponse = {
  tracks: Pagination<Track>;
  albums: Pagination<Album>;
  artists: Pagination<Artist>;
};



//-----------------------------------------------------------------------------------------

export type Filter = "all" | "albums" | "singles";


export interface SpotifySearchResponse {
  albums?: {
    items: SpotifyAlbum[];
    total: number;
    limit: number;
    offset: number;
    next:string;
  };
  tracks?: {
    items: SpotifyTrack[];
    total: number;
    limit: number;
    offset: number;
    next:string;
  };
  artists?: {
    items: SpotifyArtist[];
    total: number;
    limit: number;
    offset: number;
    next:string;
  };
}

export type SpotifyAlbumType = "album" | "compilation" | "single"

export interface SpotifyAlbum {
  album_type: SpotifyAlbumType;
  total_tracks: number;
  available_markets: string[];
  href:string;
  id: string;
  images: SpotifyImage[];
  name: string;
  release_date: string;
  release_date_precision: 'day' | 'month' | 'year';
  artists: SpotifyArtist[];
}

export interface SpotifyTrack {
  id: string;
  name: string;
  album: SpotifyAlbum;
  artists: SpotifyArtist[];
  disc_number:number;
  duration_ms: number;
  track_number:number;
  uri:string;
  type:'track';
  href:string;
}

export interface SpotifyArtist {
  href:string;
  id: string;
  name: string;
  images?: SpotifyImage[];
  genres?: string[];
  type: 'artist';
  uri:string;
}

export interface SpotifyImage {
  height: number;
  width: number;
  url: string;
}
