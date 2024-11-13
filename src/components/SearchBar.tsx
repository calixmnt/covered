import {FaSearch} from "react-icons/fa";
import React, {useState} from "react";
import {searchForItem} from "../utils/spotify.ts";
import {redirect} from "react-router-dom";

type SearchBarProps = {
    isTopPosition: boolean;
    placeholder:string;
}

function SearchBar({isTopPosition = false, placeholder}: SearchBarProps) {
    const [searchTerm, setSearchTerm] = useState("");

    const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
        const target = e.target as HTMLInputElement;
        setSearchTerm(target.value);
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement> | React.MouseEvent<SVGElement, MouseEvent>) => {
        e.preventDefault();
        const result = await searchForItem(searchTerm);
        if (!result) return redirect("/not-found");
        redirect("/covers");
        console.log(result?.albums.items);
        setSearchTerm("");
    }

    return (
        <form onSubmit={handleSubmit}
              className={`container search-bar__container ${isTopPosition ? "top-position" : ""}`}>
            <div className="search-bar__wrapper">
                <input
                    type="text"
                    className="search-bar"
                    placeholder={placeholder}
                    onChange={handleChange}
                    value={searchTerm}
                />
                <FaSearch onClick={handleSubmit} className="search-bar__icon"/>
            </div>
        </form>
    );

}

export default SearchBar;



