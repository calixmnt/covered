import Tag from "./Tag.tsx";

function Hero() {

    return (
        <section className="hero">
            <div className="container flex-end">
                {/*<Tag text="build by a music addict."/>*/}
                <h1 className="heading hero__title">Get your favorite song cover here. <span
                    className="u-accent u-italic">Nostalgia++</span>
                </h1>
                {/*<Tag text="for potentials music addicts."/>*/}
            </div>
        </section>
    )
}

export default Hero;