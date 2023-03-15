import { useState, useEffect } from "react"
import { FaHeart } from 'react-icons/fa'

export default function Progress({spotifyApi, setPlayingTrack, playingTrack ,setIsPaused, setShuffle, setRepeat, setReset, setActiveDevice, setVolume , reset}){
    const [progressParams, setProgressParams] = useState()
     const [liked, setLiked] = useState(false)
    const [inMyLibrary, setInMyLibrary] = useState(false)
    
    useEffect(() => {
        spotifyApi.getMyCurrentPlaybackState()
        .then((data) => {
            const {is_playing, item, progress_ms, repeat_state, shuffle_state, device} = data.body
            const largestAlbumImage = data.body.item?.album.images.reduce(
                (largest, image) => {
                    if (image.height > largest.height) return image
                    return largest
                },
                data.body.item?.album.images[0]
                )
                setProgressParams({is_playing:is_playing, item:item, albumImage:largestAlbumImage ,progress_ms:progress_ms, repeat_state:repeat_state, shuffle_state:shuffle_state, device:device})
            }).catch(error => {
                console.log(error)
                setReset(!reset)
            })

            if (progressParams?.item){
                document.getElementById('progressBar').style.width = `${(progressParams?.progress_ms/progressParams?.item.duration_ms) * 100}%`
            }
    },[progressParams, reset])
    

    useEffect(() => {
        if (!progressParams) return
        if (!progressParams.item) return
        let track = progressParams?.item
        setPlayingTrack(
            {
                type:'track',
                title: track.name,
                albumTitle:track.album.name,
                uri: track.uri,
                id:track.id,
                imageUrl: progressParams?.albumImage?.url,
                preview_url:track?.preview_url || '',
                artist: track.artists[0].name,
                artistId: track.artists[0].id,
                duration:`${Math.round(track.duration_ms/60000)}:${Math.round(track.duration_ms/1000)%60}`
             }
        )

    },[progressParams?.item?.name])
    
    useEffect(() => {
        if (!progressParams) return
        setIsPaused(!progressParams?.is_playing)
    },[progressParams?.is_playing])
    

    useEffect(() => {
        if (!progressParams) return
        setRepeat(progressParams?.repeat_state)
    },[progressParams?.repeat_state])

    useEffect(() => {
        if (!progressParams) return
        setShuffle(progressParams?.shuffle_state)
    },[progressParams?.shuffle_state])

     useEffect(() => {
        if (!playingTrack) return
        spotifyApi.containsMySavedTracks([playingTrack.id])
        .then(res=>{
            setInMyLibrary(res.body[0])
        }).catch(error => {
            setReset(!reset)
        })
    },[playingTrack, liked, reset])
    useEffect(() => {
        if (!progressParams) return
        console.log('device is',progressParams?.device)
        setActiveDevice(progressParams?.device)

    },[progressParams?.device?.name])
    useEffect(() => {
        if (!progressParams) return
        setVolume(progressParams?.device?.volume_percent)
    },[progressParams?.device?.volume_percent])

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

    const updateProgress = (e) => {
        const progressContiner = document.querySelector('.progressContainer')
        const positionMs = Math.round(e.nativeEvent.offsetX/progressContiner.clientWidth * progressParams?.item.duration_ms)
        spotifyApi.seek(positionMs)
        .then(function() {
            console.log('Seek to ' + positionMs);
        }).catch(error => {
            console.log(error.message)
        })
    }

    return(
        <div className='progress'>
            <div className='trackWrapper'>
                <div className='img-box playingTrackCover'>
                    <img src={progressParams?.albumImage?.url} 
                    className='cover'
                    alt='' />
                </div>
                <div className='playingTrackInfo'>
                    <div className='playingTrackName'>
                        {progressParams?.item?.name}
                    </div>
                    <div className='playingTrackArtist'>
                        { progressParams?.item?.artists.map(artist => {
                            return <div className='artistName'>{artist.name}</div>
                        })}
                    </div>
                </div>
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
            <div className='progressContainer'
            onClick={(e) => updateProgress(e)}
            >
                <div id='progressBar'></div>
            </div>
        </div>

    )
}