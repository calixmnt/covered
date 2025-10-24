import { Hero } from "./components/Hero";
import { SearchBar } from "./components/SearchBar";

function App() {
    return (
        <>
            <Hero />
            <SearchBar
                placeholder="Search for your favorite album covers..."
                isTopPosition={false}
                redirectTo='/covers'
                showSuggestions={true}
            />
        </>
    )
}

export default App