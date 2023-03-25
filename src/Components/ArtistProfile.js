import { useState, useEffect } from 'react'
export default function ArtistProfile({ item, spotifyApi }){
    const [artist, setArtist] = useState()
    const [topTracks, setTopTracks] = useState([])
    const [albums, setAlbums] = useState([])
    const [relatedArtists, setRelatedArtists] = useState([])
     useEffect(() => {
        if (!item) return
        spotifyApi.getArtist(item.artistId)
        .then(data => {
            console.log('artist of item is', data.body)
            const largestImage = data.body.images.reduce(
                (largest, image) => {
                    if (image.height > largest.height) return image
                    return largest
                },
                data.body.images[0]
            )
            setArtist(
                {
                    title:data.body.name,
                    uri:data.body.uri,
                    id:data.body.id,
                    imageUrl:largestImage.url
                }
            )
        })
    }, [item])

    useEffect(() => {
        if (!artist) return
        spotifyApi.getArtistTopTracks(artist.id, 'ES')
        .then(data => {
            console.log('top tracks', data.body)
        }).catch(error => {
            console.log(error.message)
        })
        spotifyApi.getArtistAlbums(artist.id)
        .then(data => {
            console.log('artist albums', data.body)
        }).catch(error => {
            console.log(error.message)
        })
         spotifyApi.getArtistRelatedArtists(artist.id)
        .then(data => {
            console.log('related Artists', data.body)
        }).catch(error => {
            console.log(error.message)
        })

    }, [artist])

    return(
        <div className='artistProfile'>
            <img src=''></img>

        </div>
    )
}