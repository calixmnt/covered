import SearchBar from "../components/SearchBar.tsx";
import Cover from "../components/Cover.tsx";
import { Outlet, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { SpotifySearchResponse } from "../interfaces";
import Loader from "../components/Loader.tsx";
import { searchItem } from "../api/spotify.ts";

type Filter = "all" | "albums" | "singles";

function CoversPage() {
  const [activeFilter, setActiveFilter] = useState<Filter>("all");
  const [items, setItems] = useState<SpotifySearchResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams] = useSearchParams();

  const filters = ["all", "albums", "singles"] as const;
  const searchTerm = searchParams.get("q") || "";

  const handleSearch = async (query: string) => {
    setIsLoading(true);
    try {
      const result = await searchItem(query);
      if (result) {
        console.log(result);
        setItems(result);
      } else {
        setItems(null);
      }
    } catch (error) {
      console.error("Error during the search :", error);
      setItems(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (filter: Filter) => {
    setActiveFilter(filter);
  };

  const filteredItems = items?.albums?.items.filter((item) => {
    // const firstArtistId = array[0]?.artists[0]?.id;

    // if (!firstArtistId) return false;

    if (activeFilter === "all") {
      // return item.artists.some((artist) => artist.id === firstArtistId);
      return true;
    }

    if (activeFilter === "albums") {
      return (
          // item.artists.some((artist) => artist.id === firstArtistId) &&
          (item.album_type === "album" || (item.album_type === "single" && item.total_tracks > 1))
      );
    }

    if (activeFilter === "singles") {
      return (
          // item.artists.some((artist) => artist.id === firstArtistId) &&
          item.album_type === "single" &&
          item.total_tracks === 1
      );
    }

    return false;
  });


  useEffect(() => {
    const fetchCovers = async () => {
      if (!searchTerm) return;
      setIsLoading(true);
      try {
        const result = await searchItem(searchTerm);
        if (result) {
          setItems(result);
        } else {
          setItems(null);
        }
      } catch (error) {
        console.error("Error during loading of covers", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCovers().then();
  }, [searchTerm]);

  return (
    <>
      <SearchBar
        isTopPosition={true}
        placeholder={"Have fun, search your cover"}
        onSearch={handleSearch}
      />
      <section className={"container"}>
        <h3>Filters</h3>
        {filters.map((filter: Filter) => (
          <button
            key={filter}
            className={activeFilter === filter ? "active" : ""}
            onClick={() => handleFilterChange(filter)}
          >
            {filter.charAt(0).toUpperCase() + filter.slice(1)}
          </button>
        ))}
      </section>
      <section className="container-xl">
        {isLoading ? (
          <Loader />
        ) : items?.albums && items?.albums.items && items?.albums?.total > 0 ? (
          <>
            <b>{filteredItems.length} results</b>
            <div className="covers-grid">
              {filteredItems.map((item) => (
                <Cover
                  key={item.id}
                  id={item.id}
                  image={item.images[0].url}
                  title={item.name}
                  artist={item.artists[0].name}
                />
              ))}
            </div>
          </>
        ) : (
          <p>No Covers found</p>
        )}
      </section>
      <Outlet />
    </>
  );
}

export default CoversPage;
