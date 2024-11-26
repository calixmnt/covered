import SearchBar from "./components/SearchBar.tsx";
import Hero from "./components/Hero.tsx";
import Categories from "./components/Categories.tsx";
import {getTracksBySearchTerm} from "./utils/spotify.ts";
import {useEffect} from "react";

function App() {


    useEffect(() => {
        const fetch = async () => {
            const tracks = await getTracksBySearchTerm('billets violets');
            console.log('tracks :', tracks);
        }
        fetch()
    }, []);

    return (
        <>
            <Hero />
            {/*<Categories />*/}
            {/*<Recommendations />*/}
            <SearchBar
                placeholder={"Search for your favorite cover here"}
                isTopPosition={false}
                redirectTo='/covers'
            />
        </>
    )
}

export default App
