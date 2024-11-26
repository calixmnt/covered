import { FaSearch } from "react-icons/fa";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

type SearchBarProps = {
  isTopPosition: boolean;
  placeholder: string;
  onSearch?: (searchTerm: string) => void;
  redirectTo?: string;
};

function SearchBar({
  isTopPosition = false,
  placeholder,
  onSearch,
  redirectTo,
}: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    setSearchTerm(target.value);
  };

  const handleSubmit = async (
    e:
      | React.FormEvent<HTMLFormElement>
      | React.MouseEvent<SVGElement, MouseEvent>,
  ) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchTerm);
    }
    if (redirectTo) {
      navigate(`${redirectTo}?q=${encodeURIComponent(searchTerm)}`, {
        replace: true,
      });
    }
    // setSearchTerm("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`container search-bar__container ${isTopPosition ? "top-position" : ""}`}
      action="#"
    >
      <div className="search-bar__wrapper">
        <input
          type="text"
          className="search-bar"
          placeholder={placeholder}
          onChange={handleChange}
          value={searchTerm}
        />
        <FaSearch onClick={handleSubmit} className="search-bar__icon" />
      </div>
    </form>
  );
}

export default SearchBar;
