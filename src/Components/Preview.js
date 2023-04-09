import { useState, useEffect } from 'react'
import { FaHeart, FaPlus, FaCheckCircle, FaCircle } from 'react-icons/fa'

export default function Preview ({ item, spotifyApi, user, playlists }){
     const [inLibrary, setInLibrary] = useState(false)
     const [added, setAdded] = useState(false)
     const [reveal, setReveal] = useState(false)
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
    
    const addToLibrary = (item) => {
        spotifyApi.addToMySavedTracks([item.id])
        .then(data => {
            setAdded(!added)
            console.log('added')
        }).catch(error => {
            console.log(error.message)
        })
    }
    const removeFromLibrary = (item) => {
        spotifyApi.removeFromMySavedTracks([item.id])
        .then(data => {
            setAdded(!added)
            console.log('removed')
        }).catch(error => {
            console.log(error.message)
        })
    }
    const addToPlaylist = (playlistId, itemUri) => {
        spotifyApi.addTracksToPlaylist(playlistId, [itemUri])
        .then(data => {
            console.log('added to playlist', playlistId)
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
                                    playlists.map(playlist => {
                                        return (
                                            <li className='playlist' key={playlist.id}>
                                                <FaCircle onClick={() => addToPlaylist(playlist.id, item.uri)}/>
                                                <FaCheckCircle />
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