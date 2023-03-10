import { useState, useEffect } from "react"

export default function Progress({spotifyApi, setIsPaused, setShuffle, setRepeat}){
    const [progressParams, setProgressParams] = useState()
    useEffect(() => {
        spotifyApi.getMyCurrentPlaybackState()
        .then((data) => {
            const {is_playing, item, progress_ms, repeat_state, shuffle_state} = data.body
            const largestAlbumImage = data.body.item.album.images.reduce(
                (largest, image) => {
                    if (image.height > largest.height) return image
                    return largest
                },
                data.body.item.album.images[0]
                )
                setProgressParams({is_playing:is_playing, item:item, albumImage:largestAlbumImage ,progress_ms:progress_ms, repeat_state:repeat_state, shuffle_state:shuffle_state})
            })
            document.getElementById('progressBar').style.width = `${(progressParams?.progress_ms/progressParams?.item.duration_ms) * 100}%`
    },[progressParams])
    
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

    const updateProgress = (e) => {
        // console.log('width is', this.clientWidth)
        console.log('client width', e.target.clientWidth)
        console.log('offsetX is', e.target.clientX)

    }

    return(
        <div className='progress'>
            <div className='trackWrapper'>
                <img src={progressParams?.albumImage.url} 
                className='playingTrackCover'
                alt='' />
                <div className='playingTrackInfo'>
                    <div className='playingTrackName'>
                        {progressParams?.item.name}
                    </div>
                    <div className='playingTrackArtist'>
                        { progressParams?.item.artists.map(artist => {
                            return <div className='artistName'>{artist.name}</div>
                        })}
                    </div>
                </div>
            </div>
            <div className='progressContainer'
            onClick={(e) => updateProgress(e)}
            >
                <div id='progressBar'></div>
            </div>
        </div>

    )
}