import { useEffect, useState } from "react"
import { FaHeart, FaMicrophone, FaPlay, FaPause} from 'react-icons/fa'
import { FiShuffle, FiRepeat, FiRewind, FiMic } from 'react-icons/fi'
import { GiMicrophone } from "react-icons/gi"
import {HiMicrophone} from 'react-icons/hi'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShuffle, faComputer, faRepeat, faRotate, faPlayCircle, faPauseCircle, faBackwardStep, faForwardStep } from '@fortawesome/free-solid-svg-icons'
import Progress from "./Progress"

export default function WebPlayer({player, playerId, spotifyApi, setPlayingTrack, playingTrack}){
    const [isPaused, setIsPaused] = useState(false)
    const [showDevices, setShowDevices] = useState(false)
    const [devices, setDevices] = useState([])
    const [repeat, setRepeat] = useState('context')
    const [shuffle, setShuffle] = useState(false)
    const [liked, setLiked] = useState(false)
    const [inMyLibrary, setInMyLibrary] = useState(false)

    useEffect(() => {
        if (!playingTrack) return
        console.log('contains', playingTrack)
        spotifyApi.containsMySavedTracks([playingTrack.id])
        .then(res=>{
            setInMyLibrary(res.body[0])
        }).catch(error => {
            return
        })
    },[playingTrack, liked])

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
        })
        
    }, [playerId])
    

   
    useEffect(() => {
        console.log('playing track uri is', playingTrack?.uri)
        if (!playingTrack) return 
        // spotifyApi.play({ 
        //     uris:[playingTrack.uri] 
        // }).then(() => {
        //     setIsPaused(false)
        //     setIsActive(true)
            
        // }).catch((error) => {
        //     console.log(error.message)
        // })
    }, [playingTrack])

    
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
            setShuffle={setShuffle}/>
            <div className='playerNav'>
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
                !isPaused ? 
                <button 
                id='pause' 
                className='playerBtn'
                onClick={() => {
                    spotifyApi.pause()
                    setIsPaused(true)
                }}
                ><FontAwesomeIcon icon={faPauseCircle}/></button>
                :
                <button id='play' 
                className='playerBtn'
                onClick={() => {
                    spotifyApi.play()
                    setIsPaused(false)
                }}
                ><FontAwesomeIcon icon={faPlayCircle}/></button>

            }
            <button 
            id='forward' 
            className='playerBtn'
            onClick={() => spotifyApi.skipToNext()}
            > <FontAwesomeIcon icon={faForwardStep}/></button>
            {
                repeat === 'context' ?
                <button 
                id='repeatLoop'
                className='playerBtn'
                onClick={() => {
                    setRepeat('track')
                }}
                ><FontAwesomeIcon icon={faRepeat}/>loop</button>
                :
                repeat === 'track' ?
                <button 
                id='repeatOne'
                className='playerBtn'
                onClick={() => {
                    setRepeat('off')
                }}
                ><FontAwesomeIcon icon={faRotate}/>one</button>
                :
                <button
                id='repeatOff'
                className='playerBtn'
                onClick={() => {
                    setRepeat('context')
                }}
                ><FontAwesomeIcon icon={faRepeat}/>off</button>
                
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
                !isPaused ?
                <div id='playingDevice' ></div>
                :
                <></>
            }
            {
                inMyLibrary ?
                <button 
                id='likedHeart' 
                className='playerBtn'
                onClick={() => unlikeTrack(playingTrack)}
                ><FaHeart />liked</button>
                :
                <button 
                id='unlikedHeart' 
                className='playerBtn'
                 onClick={() => likeTrack(playingTrack)}
                ><FaHeart />unliked</button>


            }
            </div>            
        </div>
    )
}