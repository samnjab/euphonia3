import { useState, useEffect } from 'react'
export default function ArtistProfile({ item, spotifyApi, changeTrackTo }){
    const [artist, setArtist] = useState()
    const [topTracks, setTopTracks] = useState([])
    const [albums, setAlbums] = useState([])
    const [relatedArtists, setRelatedArtists] = useState([])
     useEffect(() => {
        if (!item) return
        console.log(item.type)
        let id = ''
        if (item.type === 'artist') id = item.id
        else if (item.type === 'track' || item.type === 'album') id = item.artistId
        else return
        spotifyApi.getArtist(id)
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
                    imageUrl:largestImage.url,
                    followers:`${Math.floor(data.body.followers.total/1000000)},${Math.floor((data.body.followers.total%1000000)/1000)},${Math.floor(((data.body.followers.total%1000000)%1000)/100)}${Math.floor((((data.body.followers.total%1000000)%1000)%100)/10)}${Math.floor((((data.body.followers.total%1000000)%1000)%100)%10)}`
                }
            )
        })
    }, [item])

    useEffect(() => {
        if (!artist) return
        // Artist Top Tracks
        spotifyApi.getArtistTopTracks(artist.id, 'ES')
        .then(data => {
            const tracks = data.body.tracks.map(track => {
                const largestImage = track.album.images.reduce(
                    (largest, image) => {
                        if (image.height > largest.height) return image
                        return largest 
                    }
                )
                return (
                    {
                        type:'track',
                        title: track.name,
                        albumTitle:track.album.name,
                        uri: track.uri,
                        id:track.id,
                        imageUrl: largestImage.url,
                        preview_url:track?.preview_url || '',
                        artist: track.artists[0].name,
                        artistId: track.artists[0].id,
                        duration:`${Math.round(track.duration_ms/60000)}:${Math.round((Math.round(track.duration_ms/1000)%60)/10)}${(Math.round(track.duration_ms/1000)%60)%10}`

                    }
                )
            })
            setTopTracks(tracks)
        }).catch(error => {
            console.log(error.message)
        })
        // end of Artist Top Tracks

        // Artist Albums
        const getArtistAlbums = async(id) => {
            let albumsArray = await spotifyApi.getArtistAlbums(id)
            .then(data => {
                return data.body.items.map(album => {
                    const largestImage = album.images.reduce(
                        (largest, image) => {
                            if (image.height > largest.height) return image 
                            return largest
                        }
                    )
                    return (
                        {
                            type:'album',
                            title:album.name,
                            uri:album.uri,
                            id:album.id,
                            imageUrl:largestImage.url,
                            artist:album.artists[0].name,
                            artistId:album.artists[0].id
                        })
                    })
            }).catch(error => {
                console.log(error.message)
                return []
            })
            return albumsArray
        }
        const getAlbumTracks = async(albums) => {
            const promiseArray = albums.map(async(album) => {
                return await spotifyApi.getAlbum(album.id)
            })
            await Promise.all(promiseArray).then(dataArray => {
                dataArray.forEach((data,i) => {
                    let tracks = data.body.tracks.items.map(track => {
                       return {
                           type:'track',
                           title: track.name,
                           uri: track.uri,
                           id:track.id,
                           preview_url:track?.preview_url || '',
                           imageUrl: item.imageUrl,
                           albumTitle:item.title,
                           artist: track.artists[0].name,
                           artistId: track.artists[0].id,
                           duration:`${Math.round(track.duration_ms/60000)}:${Math.round(track.duration_ms/1000)%60}`
                       }
                   })
                   albums[i].tracks = tracks
                })
            }).catch(error => {
                console.log(error.message)
                // albums[i].tracks = []
            })
        }
        const displayAlbums = async () => {
            let albumsArray = await getArtistAlbums(artist.id)
            console.log('albums array', albumsArray)
            // albumsArray = await getAlbumTracks(albumsArray)
            await getAlbumTracks(albumsArray)
            console.log('2nd albums array', albumsArray)
            setAlbums(albumsArray)
        }
        displayAlbums();
        // end of Artist Albums

        // related Artists 
         spotifyApi.getArtistRelatedArtists(artist.id)
        .then(data => {
            console.log('related Artists', data.body.artists)
            setRelatedArtists(data.body.artists.map(artist => {
                const largestImage = artist.images.reduce(
                    (largest, image) => {
                        if (image.height > largest.height) return image 
                        return largest
                    }
                )
                return (
                    {
                        type:'artist',
                        title:artist.name,
                        uri:artist.uri,
                        id:artist.id,
                        imageUrl:largestImage.url,
                        popularity:artist.popularity,
                        followers:`${Math.floor(artist.followers.total/1000000)},${Math.floor((artist.followers.total%1000000)/1000)},${Math.floor(((artist.followers.total%1000000)%1000)/100)}${Math.floor((((artist.followers.total%1000000)%1000)%100)/10)}${Math.floor((((artist.followers.total%1000000)%1000)%100)%10)}`
                    }
                )

            }))
        }).catch(error => {
            console.log(error.message)
        })
        // end of related Artists
    }, [artist])

    return(
        <section className='artistProfile'>
            <img className='cover' src={artist?.imageUrl}></img>
            <p className='title'>{artist?.title}</p>
            <p className='artist'>Followers: {artist?.followers}</p>
            <h5>Top Tracks</h5>
            {
                topTracks ?
                <div className='topTracks'>
                   { topTracks.map(track => {
                       return(
                            <div className='recoTrack'>
                                <audio src={track.preview_url} id={`${track.uri}`}></audio>
                                    <a  
                                    onClick={() => {
                                        changeTrackTo(track)
                                    }}
                                    onMouseEnter ={() =>{
                                        const audioElement = document.getElementById(`${track.uri}`)
                                        audioElement.play()
                                    }}
                                    onMouseLeave ={() => {
                                        const audioElement = document.getElementById(`${track.uri}`)
                                        audioElement.pause()
                                    }}
                                    >
                                        <img src={track.imageUrl} className='cover' />
                                    </a>
                            </div>
                       )

                   })
                   }
                </div>
                :
                <></>
            }
            <h5>Albums</h5>
            {
                albums.length !== 0 ?
                <div className='artistAlbums'>
                    {
                        albums.map(album => {
                            return(
                            <div className='recoTrack'>
                                <audio src={album?.tracks[0].preview_url} id={`${album.uri}`}></audio>
                                    <a  
                                    onClick={() => {
                                        changeTrackTo(album?.tracks[0])
                                    }}
                                    onMouseEnter ={() =>{
                                        const audioElement = document.getElementById(`${album.uri}`)
                                        audioElement.play()
                                    }}
                                    onMouseLeave ={() => {
                                        const audioElement = document.getElementById(`${album.uri}`)
                                        audioElement.pause()
                                    }}
                                    >
                                        <img src={album.imageUrl} className='cover' />
                                    </a>
                            </div>
                       )

                        })
                    }

                </div>
                :
                <></>
            }
            {
                relatedArtists.length !== 0 ?
                <>
                    <h5>Related Artists</h5>
                    <div className='relatedArtists'>
                        {
                            relatedArtists.map(artist => {
                                return(
                                    <div className='relatedArtist'>
                                        <div className='img-box'>
                                            <img src={artist.imageUrl} className='cover'/>
                                        </div>
                                        <p className='title'>{artist.title}</p>
                                        {/* <p className='artist'>{artist.followers}</p> */}
                                    </div>
                                )
                            })
                        }

                    </div>
                </>
                :
                <></>
            }


        </section>
    )
}