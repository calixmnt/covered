import {Filter} from "../interfaces";

type FilterZoneProps = {
  activeFilter: Filter;
  onFilterChange: (filter: Filter) => void;
};

export default function FilterZone({activeFilter, onFilterChange} : FilterZoneProps) {
  const filters = ["all", "albums", "singles"] as const;

  return (
    <div>
      {filters.map((filter) => (
        <button
          key={filter}
          className={activeFilter === filter ? "active" : ""}
          onClick={() => onFilterChange(filter)}
        >
          {filter.charAt(0).toUpperCase() + filter.slice(1)}
        </button>
      ))}
    </div>
  );
}
