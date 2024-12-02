import SearchBar from "../components/SearchBar.tsx";
import Cover from "../components/Cover.tsx";
import { Outlet, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {Filter, SpotifySearchResponse} from "../interfaces";
import Loader from "../components/Loader.tsx";
import { searchItem } from "../api/spotify.ts";
import FilterZone from "../components/FilterZone.tsx";
import {filterSpotifyItems} from "../utils";

function CoversPage() {
  const [spotifyItems, setSpotifyItems] = useState<SpotifySearchResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams] = useSearchParams();

  const [activeFilter, setActiveFilter] = useState<Filter>("all");


  const searchTerm = searchParams.get("q") || "";

  const handleSearch = async (query: string) => {
    setIsLoading(true);
    try {
      const result = await searchItem(query);
      if (result) {
        console.log(result);
        setSpotifyItems(result);
      } else {
        setSpotifyItems(null);
      }
    } catch (error) {
      console.error("Error during the search :", error);
      setSpotifyItems(null);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredSpotifyItems = filterSpotifyItems(
      spotifyItems?.albums?.items || [],
      activeFilter
  );

  useEffect(() => {
    const fetchCovers = async () => {
      if (!searchTerm) return;
      setIsLoading(true);
      try {
        const result = await searchItem(searchTerm);
        if (result) {
          setSpotifyItems(result);
        } else {
          setSpotifyItems(null);
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
      <section className='container'>
        <h3>Filters</h3>
        <FilterZone activeFilter={activeFilter} onFilterChange={setActiveFilter} />
      </section>
      <section className="container-xl">
        {isLoading ? (
          <Loader />
        ) : filteredSpotifyItems && filteredSpotifyItems ? (
          <>
            <b>{filteredSpotifyItems.length} results</b>
            <div className="covers-grid">
              {filteredSpotifyItems.map((item) => (
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
