import { useEffect, useState, useRef } from "react"
import {FaVolumeUp, FaSearch} from 'react-icons/fa'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShuffle, faComputer, faRepeat, faRotate, faPlayCircle, faPauseCircle, faBackwardStep, faForwardStep } from '@fortawesome/free-solid-svg-icons'
import Progress from "./Progress"

export default function WebPlayer({player, playerId, spotifyApi, changeTrackTo, setChangeTrackTo, selectItem, setPreviewItem}){
    const initialPlayngStatus = useRef(false)
    const [activeDevice, setActiveDevice] = useState()
    const [playingTrack, setPlayingTrack] = useState()
    const [isPaused, setIsPaused] = useState(false)
    const [showDevices, setShowDevices] = useState(false)
    const [devices, setDevices] = useState([])
    const [repeat, setRepeat] = useState('context')
    const [shuffle, setShuffle] = useState(false)
    const [volume, setVolume] = useState(50)
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

    useEffect(() => {
        document.getElementById('volumeBar').style.width = `${volume}%`
    }, [volume])

    
    const transferPlay = (device) => {
        spotifyApi.transferMyPlayback([device.id])
        .then((res) => {
            console.log('transferring playback', res)
        })
        .catch((error)=>{
            console.log(error.message)
        })
    }
    const updateVolume = (e) => {
        console.log('volume before set', volume)
        const volumeTrack = document.querySelector('.volumeTrack')
        spotifyApi.setVolume(Math.round(e.nativeEvent.offsetX/volumeTrack.clientWidth * 100))
        .then(function () {
          
        }).catch(error =>{
            console.log(error.message)
        })
    }
    return(
        <>
        <section 
        className='MusicContainer'
        onMouseEnter={() => setPreviewItem(playingTrack)}
        >
            <div className='wrapper'>
                <Progress 
                spotifyApi={spotifyApi} 
                playingTrack={playingTrack}
                setPlayingTrack={setPlayingTrack}
                setIsPaused={setIsPaused} 
                setRepeat={setRepeat} 
                setShuffle={setShuffle}
                setActiveDevice={setActiveDevice}
                setVolume={setVolume}
                reset={reset}
                setReset={setReset}
                />
                <div className='playerNav'>
                    <div 
                    onMouseOver={() => setShowDevices(true)}
                    onMouseLeave={() => setShowDevices(false)}
                    className='devicesContainer'>
                    {
                        !isPaused && activeDevice ?
                        <div id='playingDevice' >
                            <div id='soundBars'>
                                <div className="bar"></div>
                                <div className="bar"></div>
                                <div className="bar"></div>
                                <div className="bar"></div>
                                <div className="bar"></div>
                                <div className="bar"></div>
                            </div>
                        </div>
                        :
                        <></>
                    }    
                        {
                            showDevices ?
                            <ul 
                                className='deviceList'
                                onClick={() => setShowDevices(false)}
                                >
                                    {
                                        devices.map(device => {
                                            return (
                                                <li 
                                                onClick={() => transferPlay(device)}
                                                className={activeDevice.id === device.id ? 'activeDevice' : 'inactiveDevice'}
                                                >
                                                    {device.name}
                                                </li>
                                            )
                                        })
                                        
                                    }
                            </ul>
                            :
                            <></>
                        }
                    </div>
                    <button 
                    id='moveUp' 
                    className='playerBtn'
                    onClick={() => selectItem(playingTrack, playingTrack.type)}
                    ><FaSearch /></button>
                    <div className='mainNav'>
                            {
                            shuffle ? 
                            <button 
                                className='playerBtn'
                                onClick={() => {
                                    spotifyApi.setShuffle(false)
                                    setShuffle(false)
                                    }}><FontAwesomeIcon id='shuffleOn' icon={faShuffle} />
                            </button>
                            :
                            <button 
                                className='playerBtn'
                                onClick={() => {
                                    spotifyApi.setShuffle(true)
                                    setShuffle(true)
                                    }}><FontAwesomeIcon  id='shuffleOff' icon={faShuffle} />
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
                            ><FontAwesomeIcon id='repeatLoop' icon={faRepeat}/></button>
                            :
                            repeat === 'track' ?
                            <button 
                            className='playerBtn'
                            onClick={() => {
                                setRepeat('off')
                            }}
                            ><FontAwesomeIcon id='repeatOne' icon={faRotate}/></button>
                            :
                            <button
                            className='playerBtn'
                            onClick={() => {
                                setRepeat('context')
                            }}
                            ><FontAwesomeIcon id='repeatOff' icon={faRepeat}/></button>
                            
                        }
                    </div>
                    <div className='volumeContainer'>
                        <FaVolumeUp id='volume'/>
                        <div 
                        className='volumeTrack'
                        onClick={(e) => updateVolume(e)}>
                            <div id='volumeBar'></div>
                        </div>

                    </div>
                </div> 
            </div>
        </section>
        </>
        
    )
}