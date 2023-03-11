import {useState, useEffect} from 'react'
export default function SoloView({track, selectTrack, spotifyApi, user}){
    const [addClicked, setAddClicked] = useState(false)
   
    
    function addToPlaylist(){
        addClicked ? setAddClicked(false) : setAddClicked(true)
    }
    return(
        <div className='soloView'>
            <div className='info'>
                <h5>{track.title}</h5>
                <h5 className='artist'>{track.artist}</h5>
            </div>
            <div className="icons">
                {/* <div className='iconBox'>
                    <FaPlus className='plus' onClick={addToPlaylist}/>
                </div>
                {
                    addClicked ?
                    <Playlists track={track} spotifyApi={spotifyApi} user={user}/>
                    :
                    <></>
                } */}
                <div className='iconBox'>
                    <i className="fa-solid fa-arrow-up-to-line" onClick={()=>selectTrack(track)}></i>
                </div>
            </div>
            <h5 className="album">{track.albumTitle}</h5>
            <p className='duration'>{track.duration}</p>
        </div>
    )
}