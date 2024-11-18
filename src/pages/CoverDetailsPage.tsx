import {useLoaderData, useParams} from "react-router-dom";
import {Track} from "../interfaces";
import CoverTag from "../components/CoverTag.tsx";
import { LazyLoadImage } from "react-lazy-load-image-component";
import 'react-lazy-load-image-component/src/effects/blur.css';



function CoverDetailsPage() {

    // const { coverId } = useParams();
    const spotifyItem = useLoaderData() as Track;

    // console.log(spotifyItem);

    const albumName = spotifyItem.album.name;
    const trackName = spotifyItem.name;
    const artistName = spotifyItem.artists[0]?.name || 'Unknown Artist';
    const releaseDate = spotifyItem.album.release_date || 'Unknown Release Date';
    const durationMinutes = (spotifyItem.duration_ms / 1000 / 60).toFixed(2);

    return (
        <section className="cover-details container">
            <div className="cover-details__image-box">
                <LazyLoadImage
                    alt={`Cover Art of ${albumName}`}
                    className={"cover-details__image"}
                    placeholderSrc={spotifyItem.album.images[2].url}
                    src={spotifyItem.album.images[0].url}
                    effect={"blur"}
                />
            </div>
            <div className="cover-details__description">
                <h2 className="cover-details__title">
                    <p className='flex items-center g-2'>
                        <CoverTag title={"t"}/>
                        {trackName}
                    </p>
                    <p className='u-accent flex items-center g-2'>
                        <CoverTag title={"a"}/>
                        {albumName}
                    </p>
                </h2>
                <p className="cover-details__artist">{artistName}</p>
                <p className="cover-details__info"> Release Date: {releaseDate} </p>
                <p className="cover-details__info"> Duration: {durationMinutes} minutes </p>
                <p>
                    <a href={spotifyItem.external_urls.spotify} target={"_blank"} rel="noopener noreferrer">
                        Listen to &lt; Spotify &gt;
                    </a>
                </p>
            </div>
        </section>
    );
}

export default CoverDetailsPage;
