import { Hero } from "./components/Hero";
import { SearchBar } from "./components/SearchBar";
// import { GalleryPromo } from "./components/GalleryPromo";

function App() {
    return (
        <>
            <Hero />
            <SearchBar
                placeholder="Search for your favorite album covers..."
                isBottomFixed={true}
                redirectTo='/covers'
                showSuggestions={true}
            />
            {/* <GalleryPromo /> */}
        </>
    )
}

export default App