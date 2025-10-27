import { Hero } from "./components/Hero";
import { SearchBar } from "./components/SearchBar";
import { SEO } from "./components/SEO";
import { seoConfig } from "./utils/seoConfig";
// import { GalleryPromo } from "./components/GalleryPromo";

function App() {
    return (
        <>
            <SEO {...seoConfig.home} />
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