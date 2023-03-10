import { useEffect, useState } from "react"
import { FaHeart, FaMicrophone, FaPlay, FaPause} from 'react-icons/fa'
import { FiShuffle, FiRepeat, FiRewind, FiMic } from 'react-icons/fi'
import { GiMicrophone } from "react-icons/gi"
import {HiMicrophone} from 'react-icons/hi'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShuffle, faComputer, faRepeat, faPlayCircle, faPauseCircle, faBackwardStep, faForwardStep } from '@fortawesome/free-solid-svg-icons'

export default function WebPlayer({player, playerId, spotifyApi, setPlayingTrack, playingTrack, setIsPaused, setIsActive, isPaused}){
    const [userPlayingStatus, setUserPlayingStatus] = useState(false)
    const [showDevices, setShowDevices] = useState(false)
    const [devices, setDevices] = useState([])
    const [repeatOne, setRepeatOne] = useState(false)
    const [closedLoop, setClosedLoop] = useState(false)
    const [shuffle, setShuffle] = useState(false)
    const [liked, setLiked] = useState(false)
    const [inMyLibrary, setInMyLibrary] = useState(false)
    
    console.log('player inside webplayer is', player)
    useEffect(() => {
        spotifyApi.containsMySavedTracks([playingTrack.id])
        .then(res=>{
            setInMyLibrary(res.body[0])
        }).catch(error => {
            return
        })
    },[liked])
    const likeTrack = (track) => {
        if (!track) return
        spotifyApi.addToMySavedTracks([track.id])
        .then(res => {
            setLiked(true)  
        }).catch(error => {
            prompt('Oops! could not add to library. Try again in a bit!')
            return
        })
    }
    const unlikeTrack = (track) => {
        if (!track) return
        spotifyApi.removeFromMySavedTracks([track.id])
        .then(res => {
            setLiked(false)
        }).catch(error=>{
            prompt('Oops! could not remove from library. Try again in a bit!')
        })
    }

    useEffect(() => {
        if (!playerId) return
        spotifyApi.getMyDevices()
        .then(function(data) {
            setDevices(data.body.devices)
            console.log(devices)
        })
        .catch((error) => {
            setDevices([])
            console.log(error.message)
        })
        spotifyApi.getMyCurrentPlaybackState()
        .then(function(data) {
        if (data.body && data.body.is_playing) {
            console.log("User is currently playing something!");
            setUserPlayingStatus(true)
            } else {
                setUserPlayingStatus(false)
            console.log("User is not playing anything, or doing so in private.");
            }
        } )
        .catch((error) => {
            console.log(error.message)
        })
        spotifyApi.getMyCurrentPlayingTrack()
        .then((data) => {
            const track = data.body.item
        //     console.log('now playing is', data.body.item)
        //     const smallestAlbumImage = track.album.images.reduce(
        //                 (smallest, image) => {
        //                     if (image.height < smallest.height) return image
        //                     return smallest
        //                 },
        //                 track.album.images[0]
        //             )
        //             setPlayingTrack(
        //                 {
        //                 preview_url:track?.preview_url || '',
        //                 artist: track.artists[0].name,
        //                 artistId: track.artists[0].id,
        //                 title: track.name,
        //                 albumTitle:track.album.name,
        //                 uri: track.uri,
        //                 albumUrl: smallestAlbumImage.url,
        //                 id:track.id,
        //                 duration:`${Math.round(track.duration_ms/60000)}:${Math.round(track.duration_ms/1000)%60}`
        //             }
        //             ) 
        // }).catch((error) => {
        //     console.log(error.message)
        })
    }, [playerId])

   
    useEffect(() => {
        console.log('playing track uri is', playingTrack.uri)
        if (playingTrack.length === 0) return 
        // spotifyApi.play({ 
        //     uris:[playingTrack.uri] 
        // }).then(() => {
        //     setIsPaused(false)
        //     setIsActive(true)
            
        // }).catch((error) => {
        //     console.log(error.message)
        // })
    }, [playingTrack])

    // player.addListener('player_state_changed', ( state => {
    //     if (!state) return
    //     setPlayingTrack(state.track_window.current_track)
    //     setIspPaused(state.paused)
    //     player.getCurrentState().then(state => {
    //         (!state) ? setIsActive(false) : setIsActive(true)
    //     })
    // }))
    const togglePlay = () => {
        if (playingTrack.length === 0) return
        if (isPaused) {
            spotifyApi.play()
            .then(() => {
                setIsPaused(false)
                setIsActive(true)
            }).catch((error) => {
                console.log(error.message)
            })
        }else if (!isPaused){
            spotifyApi.pause()
            .then(() => {
                setIsPaused(true)
                setIsActive(false)
            }).catch((error) => {
                console.log(error.message)
            })
        }
    }
    const transferPlay = (device) => {
        spotifyApi.transferMyPlayback([device.id])
        .then((res) => {
            console.log('transferring playback', res)
        })
        .catch((error)=>{
            console.log(error.message)
        })
    }
    return(
        <div className='container'>
            <div className='trackWrapper'>
                <img src={playingTrack.albumUrl} 
                className='playingTrackCover'
                alt='' />
                <div className='playingTrackInfo'>
                    <div className='playingTrackName'>
                        {playingTrack.title}
                    </div>
                    <div className='playingTrackArtist'>
                        {playingTrack.artist}
                    </div>
                </div>
            </div>
            {
                shuffle ? 
                <button 
                    id='shuffleOn' 
                    className='playerBtn'
                    onClick={() => {
                        spotifyApi.setShuffle(false)
                        setShuffle(false)
                        }}>shuffle On<FontAwesomeIcon icon={faShuffle} />
                </button>
                :
                <button 
                    id='shuffleOff' 
                    className='playerBtn'
                    onClick={() => {
                        spotifyApi.setShuffle(true)
                        setShuffle(true)
                        }}>shuffle Off<FontAwesomeIcon icon={faShuffle} />
                </button>

            }
            
            <button 
            id='backward' 
            className='playerBtn'
            onClick={() => spotifyApi.skipToPrevious()}
            ><FontAwesomeIcon icon={faBackwardStep}/></button>
            {
                isPaused ? 
                <button id='play' 
                className='playerBtn'
                onClick={() => spotifyApi.play()}
                ><FontAwesomeIcon icon={faPlayCircle}/></button>
                :
                <button 
                id='pause' 
                className='playerBtn'
                onClick={() => spotifyApi.pause()}
                ><FontAwesomeIcon icon={faPauseCircle}/></button>

            }
            <button 
            id='forward' 
            className='playerBtn'
            onClick={() => spotifyApi.skipToNext()}
            > <FontAwesomeIcon icon={faForwardStep}/></button>
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
                ><FontAwesomeIcon icon={faRepeat}/></button>
                
            }
            <button id='lyrics' className='playerBtn'> <GiMicrophone /></button>
            {
                showDevices ?
                devices.map(device => {
                    return (
                        <div 
                        className='deviceInfo'
                        onClick={() => transferPlay(device)}>
                            {device.name}
                        </div>
                    )
                })
                :
                <></>
            }
            <button 
            id='devices' 
            className='playerBtn'
            onClick={() => setShowDevices(!showDevices)}
            ><FontAwesomeIcon icon={faComputer} /></button>
            {
                userPlayingStatus ?
                <div id='playingDevice' ></div>
                :
                <></>
            }
            {
                inMyLibrary ?
                <button 
                id='likedHeart' 
                className='playerBtn'
                onClick={() => likeTrack(playingTrack)}
                ><FaHeart /></button>
                :
                <button 
                id='unlikedHeart' 
                className='playerBtn'
                 onClick={() => unlikeTrack(playingTrack)}
                ><FaHeart /></button>


            }
            
            
            
           
            
            
            
            
            
            
           
            

            
            
        </div>
    )
}