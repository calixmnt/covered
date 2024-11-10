type TagProps = {
    text: string
}

function Tag({text}: TagProps) {

    return <p className="tag">{text}</p>
}

export default Tag;