export default function Categories() {
    const categories = ["Nouveautés", "Classiques", "Pop", "Rock", "Hip-Hop"];

    return (
        <section className="categories">
            <h2 className="categories__title">Explore Categories</h2>
            <div className="categories__list">
                {categories.map(category => (
                    <div key={category} className="category__item">
                        {category}
                    </div>
                ))}
            </div>
        </section>
    );
}
