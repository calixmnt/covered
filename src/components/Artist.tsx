import React from "react";

export interface ArtistProps {
    id: string;
    image: string;
    title: string;
    genres?: string[];
}

const Artist: React.FC<ArtistProps> = ({ id, image, title, genres }) => {
    return (
        <div className="artist-card" key={id}>
            <div className="artist-image">
                <img src={image} alt={title} />
            </div>
            <div className="artist-info">
                <h4>{title}</h4>
                {genres && genres.length > 0 && (
                    <p className="artist-genres">{genres.join(", ")}</p>
                )}
                <a href={`/artists/${id}`} target="_blank" rel="noopener noreferrer">
                    View
                </a>
            </div>
        </div>
    );
};

export default Artist;
