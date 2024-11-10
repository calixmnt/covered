/// <reference types="vite/client" />

interface ImportMetaEnv {
    VITE_SPOTIFY_CLIENT_ID: string;
    VITE_SPOTIFY_SECRET_ID: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}