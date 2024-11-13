import {useLoaderData} from "react-router-dom";
import {Track} from "../interfaces";
import CoverTag from "./CoverTag.tsx";

function CoverDetails() {

    const spotifyItem = useLoaderData() as Track;

    console.log(spotifyItem);

    const albumName = spotifyItem.album.name;
    const trackName = spotifyItem.name;
    const artistName = spotifyItem.artists[0]?.name || 'Unknown Artist';
    const releaseDate = spotifyItem.album.release_date || 'Unknown Release Date';
    const durationMinutes = (spotifyItem.duration_ms / 1000 / 60).toFixed(2);

    return (
        <section className="cover-details container">
            <div className="cover-details__image-box">
                <img
                    src={spotifyItem.album.images[0].url}
                    alt="Cover Art"
                    className="cover-details__image"
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

export default CoverDetails;
