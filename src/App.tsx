import SearchBar from "./components/SearchBar.tsx";
import Hero from "./components/Hero.tsx";
import Categories from "./components/Categories.tsx";

function App() {

    return (
        <>
            <Hero />
            <Categories />
            {/*<Recommendations />*/}
            <SearchBar
                placeholder={"Search for your favorite cover here"}
                isTopPosition={false}
            />
        </>
    )
}

export default App
