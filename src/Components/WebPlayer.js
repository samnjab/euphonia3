import { useEffect } from "react"
import axios from "axios"

export default function WebPlayer({player, playerId, spotifyApi, setPlayingTrack, playingTrack, setIspaused, setIsActive, isPaused}){
    useEffect(() => {
        // console.log('device id inside webplayer', playerId)
        // spotifyApi.transferMyPlayback(playerId)
        // .then((res) => {
        //     console.log('transferring playback', res)
        // })
        // .catch((error)=>{
        //     console.log(error.message)
        // })
        spotifyApi.getMyCurrentPlaybackState()
        .then(function(data) {
        // Output items
        if (data.body && data.body.is_playing) {
            console.log("User is currently playing something!");
            } else {
            console.log("User is not playing anything, or doing so in private.");
            }
        } )
        .catch((error) => {
            console.log(error.message)
        })
        axios.put('https://api.spotify.com/v1/me/player/play',{
            params: {
                uris: playingTrack.uri

    
            }
        })

    })
    // player.addListener('player_state_changed', ( state => {
    //     if (!state) return
    //     setPlayingTrack(state.track_window.current_track)
    //     setIspaused(state.paused)
    //     player.getCurrentState().then(state => {
    //         (!state) ? setIsActive(false) : setIsActive(true)
    //     })
    // }))
    return(
        <div className='container'>
            <div className='mainWraper'>
                <img src={playingTrack.albumUrl} 
                className='playingTrackCover'
                alt='' />
                <div className='playingTrackInfo'>
                    <div className='playingTrackName'>
                        {playingTrack.trackTitle}
                    </div>
                    <div className='playingTrackArtist'>
                        {playingTrack.artist}
                    </div>
                </div>
            </div>
            <button className="btnSpotify" onClick={() => { player.previousTrack() }} >
            </button>
            <button className="btSpotify" onClick={() => { player.togglePlay() }} >
                { isPaused ? "PLAY" : "PAUSE" }
            </button>
            <button className="btnSpotify" onClick={() => { player.nextTrack() }} >
            </button>
        </div>
    )
}