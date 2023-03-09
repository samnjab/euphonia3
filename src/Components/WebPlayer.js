import { useEffect, useState } from "react"
export default function WebPlayer({player, playerId, spotifyApi, setPlayingTrack, playingTrack, setIspaused, setIsActive, isPaused}){
    const [repeatOne, setRepeatOne] = useState(false)
    const [closedLoop, setClosedLoop] = useState(false)

    useEffect(() => {
        if (!playerId) return
        // spotifyApi.transferMyPlayback([playerId])
        // .then((res) => {
        //     console.log('transferring playback', res)
        // })
        // .catch((error)=>{
        //     console.log(error.message)
        // })
        spotifyApi.getMyCurrentPlayingTrack()
        .then((data) => {
            const track = data.body.item
            console.log('now playing is', data.body.item)
            // const smallestAlbumImage = track.album.images.reduce(
            //             (smallest, image) => {
            //                 if (image.height < smallest.height) return image
            //                 return smallest
            //             },
            //             track.album.images[0]
            //         )
            //         setPlayingTrack(
            //             {
            //             preview_url:track?.preview_url || '',
            //             artist: track.artists[0].name,
            //             artistId: track.artists[0].id,
            //             title: track.name,
            //             albumTitle:track.album.name,
            //             uri: track.uri,
            //             albumUrl: smallestAlbumImage.url,
            //             id:track.id,
            //             duration:`${Math.round(track.duration_ms/60000)}:${Math.round(track.duration_ms/1000)%60}`
            //         }
            //         ) 
        }).catch((error) => {
            console.log(error.message)
        })
        spotifyApi.getMyCurrentPlaybackState()
        .then(function(data) {
        if (data.body && data.body.is_playing) {
            console.log("User is currently playing something!");
            } else {
            console.log("User is not playing anything, or doing so in private.");
            }
        } )
        .catch((error) => {
            console.log(error.message)
        })
    }, [playerId])

    useEffect(() => {
        if (playingTrack.length === 0) return 
        console.log('playing track uri is', playingTrack.uri)
        spotifyApi.play({ 
            uris:[playingTrack.uri] 
        }).then(() => {
            setIspaused(false)
            setIsActive(true)
            
        }).catch((error) => {
            console.log(error.message)
        })
    }, [playingTrack])

    // player.addListener('player_state_changed', ( state => {
    //     if (!state) return
    //     setPlayingTrack(state.track_window.current_track)
    //     setIspaused(state.paused)
    //     player.getCurrentState().then(state => {
    //         (!state) ? setIsActive(false) : setIsActive(true)
    //     })
    // }))
    const togglePlay = () => {
        if (playingTrack.length === 0) return
        if (isPaused) {
            spotifyApi.play()
            .then(() => {
                setIspaused(false)
                setIsActive(true)
            }).catch((error) => {
                console.log(error.message)
            })
        }else if (!isPaused){
            spotifyApi.pause()
            .then(() => {
                setIspaused(true)
                setIsActive(false)
            }).catch((error) => {
                console.log(error.message)
            })
        }
    }
    return(
        <div className='container'>
            <div className='trackWrapper'>
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
            <button id='shuffle' className='playerBtn'><i className="fa-solid fa-shuffle"></i></button>
            <button id='backward' className='playerBtn'><i className="fa-solid fa-backward-step"></i></button>
            {
                isPaused ? 
                <button id='play' className='playerBtn'><i className="fa-regular fa-play"></i></button>
                :
                <button id='pause' className='playerBtn'><i className="fa-solid fa-pause"></i></button>

            }
            <button id='forward' className='playerBtn'><i className="fa-solid fa-forward-step"></i></button>
            {
                closedLoop ?
                <button id='repeatLoop'
                className='playerBtn'
                onClick={() => {
                    setClosedLoop(false)
                    setRepeatOne(true)}}
                ><i className="fa-solid fa-repeat"></i></button>
                :
                repeatOne ?
                <button id='repeatOne'
                className='playerBtn'
                onClick={() => {
                    setRepeatOne(false)
                }}
                ><i className="fa-solid fa-repeat-1"></i></button>
                :
                <button id='repeatNone'
                className='playerBtn'
                onClick={() => {
                    setClosedLoop(true)
                }}
                ><i className="fa-solid fa-repeat"></i></button>
                
            }
            <button id='lyrics' className='playerBtn'><i className="fa-solid fa-microphone-stand"></i></button>
            <button id='devices' className='playerBtn'><i className="fa-solid fa-computer-speaker"></i></button>
             <button id='heart' className='playerBtn'><i className="fa-solid fa-heart"></i></button>
            
        </div>
    )
}