import SearchBar from "../components/SearchBar.tsx";
import Cover from "../components/Cover.tsx";
import {Outlet, useSearchParams} from "react-router-dom";
import { useEffect, useState } from "react";
import { searchForItem } from "../utils/spotify.ts";
import { Album } from "../interfaces";

function CoversPage() {
  const [covers, setCovers] = useState<Album[]>();
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams] = useSearchParams();

  const searchTerm = searchParams.get("q") || "";


  const handleSearch = async (searchTerm: string) => {
    setIsLoading(true);
    try {
      const result = await searchForItem(searchTerm);
      setCovers(result?.albums?.items || []);
    } catch (error) {
      console.error("Erreur lors de la recherche :", error);
      setCovers([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchCovers = async () => {
      if (!searchTerm) return;
      try {
        setIsLoading(true);
        const result = await searchForItem(searchTerm);
        if (result?.albums?.items) {
          setCovers(result.albums.items);
        } else {
          setCovers([]);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des covers :", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCovers();
  }, [searchTerm]);

  return (
    <>
      <SearchBar
        isTopPosition={true}
        placeholder={"Have fun, search your cover"}
        onSearch={handleSearch}
      />
      <section className="container-xl">
        {isLoading ? (
          <p>Loading covers...</p>
        ) : covers && covers.length > 0 ? (
          <div className="covers-grid">
            {covers.map((cover) => (
              <Cover
                key={cover.id}
                image={
                  cover.images?.[0]?.url || "https://via.placeholder.com/250"
                }
                title={cover.name}
                artist={cover.artists?.[0]?.name || "Unknown Artist"}
                id={cover.id}
              />
            ))}
          </div>
        ) : (
          <p>No covers found</p>
        )}
      </section>
      <Outlet />
    </>
  );
}

export default CoversPage;
