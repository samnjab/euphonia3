import { useState, useEffect } from 'react'
import { FaHeart } from 'react-icons/fa'

export default function Preview ({item, spotifyApi, user}){
     const [inLibrary, setInLibrary] = useState(false)
    useEffect(() => {
        if (!item || item.type !== 'track') return 
        spotifyApi.containsMySavedTracks([item.id])
        .then(data => {
            setInLibrary(data.body[0])
        }).catch(error => {
            console.log(error.message)
            setInLibrary(false)
        })
    }, [item])

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
                        <FaHeart className='saved'/>
                        :
                        item.type === 'track' && !inLibrary ?
                        <FaHeart className='notSaved'/>
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