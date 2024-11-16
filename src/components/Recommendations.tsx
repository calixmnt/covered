export default function Recommendations() {
    const recommendations = [
        "Cover 1", "Cover 2", "Cover 3", "Cover 4", "Cover 5"
    ];

    return (
        <section className="recommendations">
            <h2 className="recommendations__title">Recommended for You</h2>
            <div className="recommendations__list">
                {recommendations.map((cover, index) => (
                    <div key={index} className="recommendation__item">
                        {cover}
                    </div>
                ))}
            </div>
        </section>
    );
}
