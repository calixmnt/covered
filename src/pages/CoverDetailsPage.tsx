import { useParams } from "react-router-dom";
import { SpotifyAlbum } from "../interfaces";
import CoverTag from "../components/CoverTag.tsx";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { useEffect, useState } from "react";
import { getAlbumById } from "../api/spotify.ts";

function CoverDetailsPage() {
  const params = useParams();
  const coverId = params.coverId;
  // const spotifyItem = useLoaderData() as SpotifyTrack;
  const [isLoading, setIsLoading] = useState(false);
  const [album, setAlbum] = useState<SpotifyAlbum | null>();

  useEffect(() => {
    const fetchCovers = async () => {
      setIsLoading(true);
      try {
        if (coverId) {
          const result = await getAlbumById(coverId);
          console.log("resullslsls", result);
          setAlbum(result);
        } else {
          // const result = await getRandomItemLoader();
        }
      } catch (error) {
        console.error("Error during the search :", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCovers();
  }, [coverId]);

  if (!album) return <p>Album not found</p>;

  const albumName = album.name;
  const trackName = album.name;
  const artistName = album.artists[0]?.name || "Unknown Artist";
  const releaseDate = album.release_date || "Unknown Release Date";
  // const durationMinutes = (album. / 1000 / 60).toFixed(2);

  return (
    <section className="cover-details container">
      <div className="cover-details__image-box">
        <LazyLoadImage
          alt={`Cover Art of ${albumName}`}
          className={"cover-details__image"}
          placeholderSrc={album.images[2].url}
          src={album.images[0].url}
          effect={"blur"}
        />
      </div>
      <div className="cover-details__description">
        <h2 className="cover-details__title">
          <p className="flex items-center g-2">
            <CoverTag title={"t"} />
            {trackName}
          </p>
          <p className="u-accent flex items-center g-2">
            <CoverTag title={"a"} />
            {albumName}
          </p>
        </h2>
        <p className="cover-details__artist">{artistName}</p>
        <p className="cover-details__info"> Release Date: {releaseDate} </p>
        {/*<p className="cover-details__info">*/}
        {/*  {" "}*/}
        {/*  Duration: {durationMinutes} minutes{" "}*/}
        {/*</p>*/}
        {/*<p>*/}
        {/*  <a*/}
        {/*    href={spotifyItem.external_urls.spotify}*/}
        {/*    target={"_blank"}*/}
        {/*    rel="noopener noreferrer"*/}
        {/*  >*/}
        {/*    Listen to &lt; Spotify &gt;*/}
        {/*  </a>*/}
        {/*</p>*/}
      </div>
    </section>
  );
}

export default CoverDetailsPage;
