import {Link} from "react-router-dom";

interface CoverProps {
    id:string;
    image: string;
    title: string;
    artist: string;
}

const Cover = ({ id, image, title, artist } : CoverProps) => {
    return (
        <div className="cover">
            <Link to={`/covers/${id}`}>
                <img src={image} alt={`${title} cover`} className="cover__image"/>
                <div className="cover__info">
                    <h3 className="cover__title">{title}</h3>
                    <p className="cover__artist">{artist}</p>
                </div>
            </Link>
        </div>
    );
};

export default Cover;
