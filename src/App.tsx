import SearchBar from "./components/SearchBar.tsx";
import Hero from "./components/Hero.tsx";

function App() {

    return (
        <>
            <Hero/>
            <SearchBar placeholder={"Search for your favorite cover here"} isTopPosition={false}/>
        </>
    )
}

export default App
