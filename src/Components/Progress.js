import { useState, useEffect } from "react"

export default function Progress({spotifyApi}){
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
            console.log('progressParams are', progressParams )
        })
    },[progressParams])

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
                        {/* {playingTrack?.artist} */}
                    </div>
                </div>
            </div>
        </div>

    )
}