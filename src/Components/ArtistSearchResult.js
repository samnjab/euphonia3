export default function TrackSearchResult({ artist, selectArtist }) {
    function handleSelect() {
        selectArtist(artist)
    }

    return (
        <div
        style={{ cursor: "pointer" }}
        className='artistSearchResult'
        onClick={handleSelect}>
            <img src={artist.artistImg} style={{ height: "64px", width: "64px" }} className='cover' />
            <div className='info'>
                <h5>{artist.name}</h5>
            </div>
        </div>
    )
}