import FilterZone from "../components/FilterZone.tsx";
import SearchBar from "../components/SearchBar.tsx";

export default function HaveFunPage() {

    return (
        <>
            <FilterZone/>
            <br/>
            <SearchBar isTopPosition={true} placeholder={'Many filters just for you...'}/>
        </>
    )
}