import { Outlet } from "react-router-dom";
import SearchBar from "../components/SearchBar.tsx";
import { useState } from "react";
import { searchArtist } from "../api/spotify.ts";
import Loader from "../components/Loader.tsx";
import { SpotifyArtist } from "../interfaces";
import Artist from "../components/Artist.tsx";

type ArtistsPageProps = {};

export default function ArtistsPage({}: ArtistsPageProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [artists, setArtists] = useState<SpotifyArtist[]>();

  const handleSearch = async (query: string) => {
    setIsLoading(true);
    try {
      const result = await searchArtist(query);
      if (result) {
        console.log("result :", result);
        setArtists(result.artists?.items);
      } else {
      }
    } catch (error) {
      console.error("Error during the search :", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <SearchBar
        isTopPosition={true}
        placeholder={"Search for your favorite artist here"}
        onSearch={handleSearch}
      />
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <b>{artists && artists.length} results</b>
          <div className="container covers-grid">
            {artists && artists.map((artist) => (
              <Artist
                key={artist.id}
                id={artist.id}
                image={artist.images?.[0]?.url || "https://via.placeholder.com/250"}
                title={artist.name}
                genres={artist.genres}
              />
            ))}
          </div>
        </>
      )}
      <Outlet />
    </>
  );
}
