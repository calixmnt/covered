import React from "react";

function CoverDetails() {
    return (
        <section className="cover-details container">
            <div className="cover-details__image-box">
                <img
                    src="https://via.placeholder.com/700"
                    alt="Cover Art"
                    className="cover-details__image"
                />
            </div>
            <div className="cover-details__description">
                <h2 className="cover-details__title">Album Title</h2>
                <p className="cover-details__artist">Artist Name</p>
                <p className="cover-details__info">
                    Some detailed description about the album or song, such as release date, genre,
                    and other relevant information.
                </p>
            </div>
        </section>
    );
}

export default CoverDetails;
