import {useState, useEffect} from 'react'
export default function SoloView({track, selectTrack, spotifyApi, user}){
    const [addClicked, setAddClicked] = useState(false)
    const [inMyLibrary, setInMyLibrary] = useState(false)
    const [added, setAdded] = useState(false)
    useEffect(()=>{
        spotifyApi.containsMySavedTracks([track.id])
        .then(res=>{
            setInMyLibrary(res.body[0])
        }).catch(error => {
            return
        })
    },[added])
    function handleAddTrack(){
        spotifyApi.addToMySavedTracks([track.id])
        .then(res => {
            setAdded(true)  
        }).catch(error => {
            prompt('Oops! could not add to library. Try again in a bit!')
            return
        })
    }
    function handleRemovetrack(){
        spotifyApi.removeFromMySavedTracks([track.id])
        .then(res => {
            setAdded(false)
        }).catch(error=>{
            prompt('Oops! could not remove from library. Try again in a bit!')
        })
    }
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
                <div className='iconBox'>
                    {
                        inMyLibrary ?
                        <i className='fa-solid fa-heart liked' onClick={handleRemovetrack}></i>
                        :
                        <i className='fa-regular fa-heart like' onClick={handleAddTrack}></i>
                    }
                </div>
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