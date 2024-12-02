import {Link, useParams} from "react-router-dom";
import FilterZone from "../components/FilterZone.tsx";
import { useEffect, useState } from "react";
import { Filter, SpotifyAlbum } from "../interfaces";
import { getAlbumsByArtistId } from "../api/spotify.ts";
import Loader from "../components/Loader.tsx";

type ArtistPageProps = {};

export default function ArtistPage({}: ArtistPageProps) {

  const [activeFilter, setActiveFilter] = useState<Filter>("albums");
  const [albums, setAlbums] = useState<SpotifyAlbum[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { artistId } = useParams();

  if (!artistId) {
    return <p>Invalid artist ID. Please check the URL.</p>;
  }

  useEffect(() => {
    const fetchAlbums = async () => {
      setIsLoading(true);
      try {
        const results = await getAlbumsByArtistId(artistId);
        setAlbums(results.items);
      } catch (error) {
        console.error("Failed to fetch albums:", error);
        setAlbums(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAlbums();
  }, [artistId]);

  const filteredAlbums = albums
      ? albums.filter((album) => {
        if (activeFilter === "all") return true;
        if (activeFilter === "albums") return album.album_type === "album";
        if (activeFilter === "singles") return album.album_type === "single";
        return false;
      })
      : [];

  return (
      <div className="artist-page">
        <h1 className="artist-title">Albums by Artist</h1>
        <FilterZone
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
        />

        {isLoading ? (
            <Loader />
        ) : filteredAlbums.length > 0 ? (
            <div className="albums-grid">
              {filteredAlbums.map((album) => (
                  <div key={album.id} className="album-card">
                    <img
                        src={album.images[0]?.url || "https://via.placeholder.com/250"}
                        alt={album.name}
                        className="album-image"
                    />
                    <h3 className="album-title">{album.name}</h3>
                    <p className="album-details">{album.album_type}</p>
                      <p><Link to={`/covers/${album.id}`}>Void la cover</Link></p>
                  </div>
              ))}
            </div>
        ) : (
            <p className="no-albums">No albums found for this artist.</p>
        )}
      </div>
  );
}
