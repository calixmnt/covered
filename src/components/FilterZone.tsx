import { useState } from "react";

export default function FilterZone() {
  const [filters, setFilters] = useState({
    type: "",
    country: "",
    genre: "",
    explicit: false,
  });

  const handleFilterChange = () => {

  }

  return (
    <div className="filter-zone container">
      <div className="filter-group">
        <label>Type:</label>
        <button className="filter-btn active">Album</button>
        <button className="filter-btn">Single</button>
      </div>

      <div className="filter-group">
        <label htmlFor="country-select">Country:</label>
        <select id="country-select" className="filter-select">
          <option value="">All</option>
          <option value="us">United States</option>
          <option value="gb">United Kingdom</option>
          <option value="fr">France</option>
          <option value="ci">Côte d'Ivoire</option>
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="genre-select">Genre:</label>
        <select id="genre-select" className="filter-select">
          <option value="">All</option>
          <option value="pop">Pop</option>
          <option value="rock">Rock</option>
          <option value="hip-hop">Hip-Hop</option>
          <option value="classical">Classical</option>
          <option value="afrobeat">Afrobeat</option>
        </select>
      </div>

      <div className="filter-group">
        <label>
          <input type="checkbox" className="filter-checkbox" />
          Explicit Content
        </label>
      </div>
    </div>
  );
}
