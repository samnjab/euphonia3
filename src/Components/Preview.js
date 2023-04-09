import { useState, useEffect } from 'react'
import { FaHeart, FaPlus, FaCheckCircle, FaCircle } from 'react-icons/fa'

export default function Preview ({ item, spotifyApi, user, playlists, scan, setScan }){
     const [inLibrary, setInLibrary] = useState(false)
     const [added, setAdded] = useState(false)
     const [reveal, setReveal] = useState(false)
     const [exists, setExists] = useState([])
    useEffect(() => {
        if (!item || item.type !== 'track') return 
        spotifyApi.containsMySavedTracks([item.id])
        .then(data => {
            setInLibrary(data.body[0])
        }).catch(error => {
            console.log(error.message)
            setInLibrary(false)
        })
    }, [item, added])

    useEffect(() => {
        if (playlists.length === 0 || !item || item.type !== 'track') return 
        const existsArray = playlists.map(playlist => {
            let trackExists = false
            playlist.tracks.forEach(track => {
                if (track.uri == item.uri) {
                    trackExists = true
                    return
                }
            })
            return trackExists
        })
        setExists(existsArray)
    }, [item, playlists, scan])
   
    
    const addToLibrary = (item) => {
        spotifyApi.addToMySavedTracks([item.id])
        .then(data => {
            setAdded(!added)
        }).catch(error => {
            console.log(error.message)
        })
    }
    const removeFromLibrary = (item) => {
        spotifyApi.removeFromMySavedTracks([item.id])
        .then(data => {
            setAdded(!added)
        }).catch(error => {
            console.log(error.message)
        })
    }
    const addToPlaylist = (playlistId, itemUri) => {
        spotifyApi.addTracksToPlaylist(playlistId, [itemUri])
        .then(data => {
            setScan(!scan)
        }).catch(error => {
            console.log(error.message)
        })
    }
    const removedFromPlaylist = (playlistId, trackUri) => {
        spotifyApi.removeTracksFromPlaylist(playlistId, [{uri: trackUri}])
        .then(data => {
            setScan(!scan)
        }).catch(error => {
            console.log(error.message)
        })

    }
    

    return (
        <>
            {
                item ?
                <div className='preview'>
                    <div className='img-box'>
                        <img className='cover' src={item?.imageUrl} />
                    </div>
                    <p className='title'>{item?.title}</p>
                    <p className='artist'>{item?.artist}</p>
                    {
                        item.type === 'track' && inLibrary ?
                        <FaHeart 
                        className='saved'
                        onClick={() => removeFromLibrary(item)}
                        />
                        :
                        item.type === 'track' && !inLibrary ?
                        <FaHeart 
                        className='notSaved'
                        onClick={() => addToLibrary(item)}
                        />
                        :
                        <></>

                    }
                    {
                        item.type === 'track' ?
                        <div 
                        className='playlistParent'
                        onMouseOver={() => setReveal(true)}
                        onMouseLeave={() => setReveal(false)}
                        >
                            {
                                reveal ?
                                <ul className='playlists'>
                                    {   playlists.length !== 0 ?
                                    playlists.map((playlist, i) => {
                                        return (
                                            <li className='playlist' key={playlist.id}>
                                                {
                                                    exists[i] ?
                                                    <FaCheckCircle onClick={() => removedFromPlaylist(playlist.id, item.uri)}/>
                                                    :
                                                    <FaCircle onClick={() => addToPlaylist(playlist.id, item.uri)}/>

                                                }
                                                <p className='artist'>{playlist.name}</p>
                                            </li>
                                        )
                                    })
                                        :
                                        <></>
                                    }
                                </ul>
                                :
                                <></>
                            }

                            <FaPlus 
                            className='plus'
                            />

                        </div>
                        :
                        <></>
                    }

        
                </div>
                :
                <></>

            }
        </>
    )
}