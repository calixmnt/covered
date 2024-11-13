export interface Image {
    url: string;
    height: number;
    width: number;
}

export interface Artist {
    href: string;
    id: string;
    name: string;
    type: 'artist';
    uri: string;
}

export interface Album {
    album_type: string;
    total_tracks: number;
    href: string;
    id: string;
    images: Image[];
    name: string;
    release_date: string;
    release_date_precision: 'day' | 'month' | 'year';
    type: 'album';
    uri: string;
    artists: Artist[];
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
    external_urls: {spotify : string}
    type: 'track';
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