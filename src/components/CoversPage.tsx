import SearchBar from "./SearchBar.tsx";
import Cover from "./Cover.tsx";

const covers = [
    {
        id: "cover 1",
        image: "https://via.placeholder.com/250",
        title: "Ether",
        artist: "Calixx"
    },
    {
        id: "cover 2",
        image: "https://via.placeholder.com/550",
        title: "M. Anderson",
        artist: "Laylow"
    },
    {
        id: "cover 3",
        image: "https://via.placeholder.com/550",
        title: "Culture III",
        artist: "Migos"
    },
    {
        id: "cover 4",
        image: "https://via.placeholder.com/550",
        title: "Or Noir",
        artist: "Kaaris"
    }
];

function CoversPage() {

    return (
        <div>
            <SearchBar isTopPosition={true} placeholder={"Have fun, search your cover"}/>
            <section className="container-xl">
                <div className="covers-grid">
                    {covers.map((cover, index) => (
                        <Cover
                            key={index}
                            image={cover.image}
                            title={cover.title}
                            artist={cover.artist}
                            id={cover.id}
                        />
                    ))}
                </div>
            </section>
        </div>
    );
}

export default CoversPage;