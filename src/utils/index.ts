import {SpotifyAlbum} from "../interfaces";
import {Filter} from "../components/FilterZone.tsx";

const alphabet: string[] = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

export function getRandomLetter(): string {
    const randomIndex = Math.floor(Math.random() * alphabet.length);
    return alphabet[randomIndex];
}

export function filterSpotifyItems(items:SpotifyAlbum[], activeFilter : Filter) {
    return items.filter((item) => {
        if (activeFilter === "all") return true;
        if (activeFilter === "albums") {
            return (
                item.album_type === "album" ||
                (item.album_type === "single" && item.total_tracks > 1)
            );
        }
        if (activeFilter === "singles") {
            return item.album_type === "single" && item.total_tracks === 1;
        }
        return false;
    });
}