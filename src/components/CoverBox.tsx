type CoverBoxProps = {
    items : string[];
}

function CoverBox({items} : CoverBoxProps) {

    return (
        <section className='cover-container'>
            {
                items.map((elt) => {
                    return <div>{elt}</div>
                })
            }
        </section>
    )
}

export default CoverBox;