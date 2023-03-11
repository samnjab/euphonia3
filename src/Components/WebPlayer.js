import { useEffect, useState, useRef } from "react"
import { FaHeart, FaMicrophone, FaPlay, FaPause} from 'react-icons/fa'
import { GiMicrophone } from "react-icons/gi"
import {HiMicrophone} from 'react-icons/hi'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShuffle, faComputer, faRepeat, faRotate, faPlayCircle, faPauseCircle, faBackwardStep, faForwardStep } from '@fortawesome/free-solid-svg-icons'
import Progress from "./Progress"

export default function WebPlayer({player, playerId, spotifyApi, changeTrackTo, setChangeTrackTo}){
    const initialPlayngStatus = useRef(false)
    const [playingTrack, setPlayingTrack] = useState()
    const [isPaused, setIsPaused] = useState(false)
    const [showDevices, setShowDevices] = useState(false)
    const [devices, setDevices] = useState([])
    const [repeat, setRepeat] = useState('context')
    const [shuffle, setShuffle] = useState(false)
    const [liked, setLiked] = useState(false)
    const [inMyLibrary, setInMyLibrary] = useState(false)
    const [reset, setReset] = useState(false)

    
    useEffect(() => {
        spotifyApi.getMyCurrentPlaybackState()
        .then((data) => {
            initialPlayngStatus.current = data.body.is_playing
            if (!data.body.is_playing){
                spotifyApi.transferMyPlayback([playerId])
                .then((res) => {
                        console.log('transferring playback')
                    })
                    .catch((error)=>{
                        console.log(error.message)
                    })
            }
        }).catch((error) => {
            console.log(error.message)
            setReset(!reset)
        })
    }, [])

    useEffect(() => {
        if (!playingTrack) return
        spotifyApi.containsMySavedTracks([playingTrack.id])
        .then(res=>{
            setInMyLibrary(res.body[0])
        }).catch(error => {
            setReset(!reset)
        })
    },[playingTrack, liked, reset])

    const likeTrack = (track) => {
        if (!track) return
        spotifyApi.addToMySavedTracks([track.id])
        .then(res => {
            setLiked(true) 
            console.log('liking', res.body) 
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
            console.log('data from devices', data)
            setDevices(data.body.devices)
        })
        .catch((error) => {
            setDevices([])
            console.log(error.message)
            setReset(!reset)
        })
        
    }, [playerId, reset])
    

   
    useEffect(() => {
        if (!changeTrackTo) return 
        spotifyApi.play({ 
            uris:[changeTrackTo.uri] 
        }).then(() => {
            setReset(!reset)
            setChangeTrackTo()
        }).catch((error) => {
            console.log(error.message)
            setReset(!reset)
        })
    }, [changeTrackTo, reset])

    
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
        <div className='MusicContainer'>
            <Progress 
            spotifyApi={spotifyApi} 
            setPlayingTrack={setPlayingTrack}
            setIsPaused={setIsPaused} 
            setRepeat={setRepeat} 
            setShuffle={setShuffle}
            reset={reset}
            setReset={setReset}
            />
            <div className='playerNav'>
                {
                shuffle ? 
                <button 
                    className='playerBtn'
                    onClick={() => {
                        spotifyApi.setShuffle(false)
                        setShuffle(false)
                        }}>shuffle On<FontAwesomeIcon id='shuffleOn' icon={faShuffle} />
                </button>
                :
                <button 
                    className='playerBtn'
                    onClick={() => {
                        spotifyApi.setShuffle(true)
                        setShuffle(true)
                        }}>shuffle Off<FontAwesomeIcon  id='shuffleOff' icon={faShuffle} />
                </button>

            }
            
            <button 
            className='playerBtn'
            onClick={() => spotifyApi.skipToPrevious()}
            ><FontAwesomeIcon  id='backward' icon={faBackwardStep}/></button>
            {
                !isPaused ? 
                <button 
                className='playerBtn'
                onClick={() => {
                    spotifyApi.pause()
                    setIsPaused(true)
                }}
                ><FontAwesomeIcon id='pause' icon={faPauseCircle}/></button>
                :
                <button  
                className='playerBtn'
                onClick={() => {
                    spotifyApi.play()
                    setIsPaused(false)
                }}
                ><FontAwesomeIcon id='play' icon={faPlayCircle}/></button>

            }
            <button 
            className='playerBtn'
            onClick={() => spotifyApi.skipToNext()}
            > <FontAwesomeIcon id='forward' icon={faForwardStep}/></button>
            {
                repeat === 'context' ?
                <button 
                className='playerBtn'
                onClick={() => {
                    setRepeat('track')
                }}
                ><FontAwesomeIcon id='repeatLoop' icon={faRepeat}/>loop</button>
                :
                repeat === 'track' ?
                <button 
                className='playerBtn'
                onClick={() => {
                    setRepeat('off')
                }}
                ><FontAwesomeIcon id='repeatOne' icon={faRotate}/>one</button>
                :
                <button
                className='playerBtn'
                onClick={() => {
                    setRepeat('context')
                }}
                ><FontAwesomeIcon id='repeatOff' icon={faRepeat}/>off</button>
                
            }
            <button id='lyrics' className='playerBtn'>Lyrics</button>
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
            className='playerBtn'
            onClick={() => setShowDevices(!showDevices)}
            ><FontAwesomeIcon  id='devices' icon={faComputer} /></button>
            {
                !isPaused ?
                <div id='playingDevice' ></div>
                :
                <></>
            }
            {
                inMyLibrary ?
                <button  
                className='playerBtn'
                onClick={() => unlikeTrack(playingTrack)}
                ><FaHeart  id='likedHeart' /></button>
                :
                <button 
                className='playerBtn'
                 onClick={() => likeTrack(playingTrack)}
                ><FaHeart  id='unlikedHeart'/></button>


            }
            </div>            
        </div>
    )
}