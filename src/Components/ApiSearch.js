// Modules
import React from 'react'
import { useState, useEffect, useRef } from 'react'
// Components
import SearchOptions from "./SearchOptions"
import RecoTrack from './RecoTrack'
import Preview from './Preview'
import WebPlayer from "./WebPlayer"
import Slider from './Slider'
import Error from './Error'
import DisplayItem from './DisplayItem'
import DisplaySelected from './DisplaySelected'
import ArtistProfile from './ArtistProfile'
import findGenres from './findGenres'
import highestFreq from './highestFreq'
export default function ApiSearch({ spotifyApi, accessToken, user }){

    const [param, setParam] = useState('track')
    const [search, setSearch] = useState('')
    const [searchResults, setSearchResults] = useState([])
    const [paramToSelection, setParamToSelection] = useState({'track':[], 'artist':[], 'album':[], 'playlist':[]})
    const [selectedItem, setSelectedItem] = useState()
    const [previewItem, setPreviewItem] = useState()
    const [albumTracks, setAlbumTracks] = useState({title:'', tracks:[]})
    const [playlistTracks, setPlaylistTracks] = useState({title:'', tracks:[]})
    const [genreSeeds, setGenreSeeds] = useState([])
    const [artistSeeds, setArtistSeeds] = useState([])
    const [revealStatus, setRevealStatus] = useState(false)
    const [recommendations, setRecommendations] = useState([])
    const [player, setPlayer] = useState()
    const [apiReady,setApiReady] = useState(false)
    const [playerId, setPlayerId] = useState('')
    const [changeTrackTo, setChangeTrackTo] = useState()
    const [playingTracks, setPlayingTracks] = useState([])
    const [recoParams, setRecoParams] = useState({popularity:{}, energy:{}, tempo:{}, valence:{},acousticness:{}, danceability:{}, instrumentalness:{}, speechiness:{}})

  

    // UseEffects
     useEffect(() => {
        const settingAccessToken = async() => {
            await spotifyApi.setAccessToken(accessToken)
            setApiReady(true)
        }
        if (!accessToken) return
        settingAccessToken()
    }, [accessToken])

    // useEffect(() => {
    //     if (!accessToken) return
    //     const script = document.createElement('script')
    //     script.src = "https://sdk.scdn.co/spotify-player.js"
    //     script.async = true
    //     document.body.appendChild(script)
    //     window.onSpotifyWebPlaybackSDKReady = () => {
    //         const player = new window.Spotify.Player({
    //             name: 'Euphonia',
    //             getOAuthToken:cb => {cb(accessToken)},
    //             volume:0.5
    //         })
    //         setPlayer(player)
    //     }
    // },[accessToken])

    useEffect(() => {
        if (!player) return
        if(!apiReady) return
        player.addListener('ready', ({device_id}) => {
            setPlayerId(device_id)
        })
        player.addListener('not_ready', ({device_id}) => {
            console.log('device id has gone offline', device_id)
        })
        player.connect()
    }, [apiReady, player])

    useEffect(() => {
        setSearch('')
    },[param])


    useEffect(() => {
        if (!search) {
            setSearchResults([])
            return 
        }
        if (!accessToken) return
        let start = true
        if (param === 'track') {
            spotifyApi.searchTracks(search)
            .then(res => {
                if (!start) return
                setSearchResults(
                    res.body.tracks.items.map(track => {
                        const smallestAlbumImage = track.album.images.reduce(
                            (smallest, image) => {
                                if (image.height < smallest.height) return image
                                return smallest
                            },
                            track.album.images[0]
                        )
                        return {
                            type:'track',
                            title: track.name,
                            albumTitle: track.album.name,
                            uri: track.uri,
                            id:track.id,
                            imageUrl: smallestAlbumImage?.url || '',
                            artist: track.artists[0].name,
                            artistId: track.artists[0].id
                        }
                    })
                )
            })
        }
        else if (param === 'artist'){
                spotifyApi.searchArtists(search)
                .then(res => {
                if (!start) return
                setSearchResults(
                    res.body.artists.items.map(artist => {
                        const largestArtistImage = artist.images.reduce(
                            (largest, image) => {
                                if (image.height > largest.height) return image
                                return largest
                            },
                            artist.images[0]
                        )
                        return {
                            type:'artist',
                            title: artist.name,
                            uri: artist.uri,
                            id: artist.id,
                            imageUrl: largestArtistImage?.url || ''
                        }
                    })
                )
            })
        }
        else if(param === 'album'){
            spotifyApi.searchAlbums(search)
            .then(res => {
                if (!start) return
                setSearchResults(
                    res.body.albums.items.map(album => {
                        const largestAlbumImage = album.images.reduce(
                            (largest, image) => {
                                if (image.height > largest.height) return image
                                return largest
                            },
                            album.images[0]
                        )
                        return {
                            type:'album',
                            title: album.name,
                            uri: album.uri,
                            id: album.id,
                            imageUrl:largestAlbumImage?.url || '',
                            artist: album.artists[0].name,
                            artistId: album.artists[0].id,
                            // genres:album.artists[0].genres
                        }
                    })
                )
            })
        }
        else if (param === 'playlist'){
            spotifyApi.searchPlaylists(search)
            .then(res => {
                if (!start) return
                setSearchResults(
                    res.body.playlists.items.map(playlist => {
                        const largestPlaylistImage = playlist.images.reduce(
                            (largest, image) => {
                                if (image.height > largest.height) return image
                                return largest
                            },
                            playlist.images[0]
                        )
                        return {
                            type:'playlist',
                            title: playlist.name,
                            uri: playlist.uri,
                            id: playlist.id,
                            imageUrl:largestPlaylistImage?.url || '',
                            owner: playlist.owner.display_name,
                            description: playlist.description
                        }
                    })
                )
            })
        }
        return () => (start = false)
    }, [search, accessToken])

    useEffect(() => {
        if(!accessToken) return
        let selected = false
        for (let param in paramToSelection){
            if (paramToSelection[param].length !== 0) selected= true
        }
        if (!selected){
             setRecommendations([])
            return 
        }
        let start = true
        console.log('genre seeds are', genreSeeds)
        const seedTracks = paramToSelection['track'].map(track => {
            return track.id
        })
        console.log('seed track are', seedTracks)
        const seedArtists = paramToSelection['artist'].map(artist=>{
            return artist.id
        })
        if (playlistTracks.tracks.length !== 0 || albumTracks.tracks.length !== 0){
            for (let i=0; i < Math.min(artistSeeds.length, 5); i++){
                seedArtists.push(artistSeeds[i].ref)
            }
        }
        console.log('seedArtists', seedArtists)
        if (seedTracks.length === 0 && seedArtists.length === 0) return
        const requestParams = {}
        for (let key in recoParams){
            if (recoParams[key]?.min){
                requestParams[`min_${key}`] = recoParams[key].min
            }
            if (recoParams[key]?.max){
                requestParams[`max_${key}`] = recoParams[key].max
            }
        }
        spotifyApi.getRecommendations({
            seed_tracks: seedTracks,
            seed_artists:seedArtists,
            genre_seeds: genreSeeds.map(genre => {return genre.genre}),
            ...requestParams,
            limit:50
        }).then(data => {
            if (!start) return
            setRecommendations(
                data.body?.tracks?.map(track => {
                    const largestAlbumImage = track.album.images.reduce(
                        (largest, image) => {
                            if (image.height > largest.height) return image
                            return largest
                        },
                        track.album.images[0]
                    )
                    return {
                        type:'track',
                        title: track.name,
                        albumTitle:track.album.name,
                        uri: track.uri,
                        id:track.id,
                        imageUrl: largestAlbumImage.url,
                        preview_url:track?.preview_url || '',
                        artist: track.artists[0].name,
                        artistId: track.artists[0].id,
                        duration:`${Math.round(track.duration_ms/60000)}:${Math.round((Math.round(track.duration_ms/1000)%60)/10)}${(Math.round(track.duration_ms/1000)%60)%10}`
                    }
                })
            )
        }).catch(error => {
            console.log(error.message)
            return 
        })
        return () => start = false
    },[paramToSelection, recoParams, genreSeeds, albumTracks])

    const handleRecoParam = (recoParam, lower, upper) => {
        let min = lower/100
        let max = upper/100
        if (recoParam ==='popularity'){
            min = lower
            max = upper  
        }else if(recoParam==='tempo'){
            min = lower * 1.6 + 40
            max = upper * 1.6 + 40
        }
        setRecoParams(
            {
                ...recoParams,
                [recoParam]:{min:min, max:max}
            }

        )
    }
    useEffect(() => {
        if (playlistTracks.tracks.length === 0) return
        let artistIds = playlistTracks.tracks.map(track => {
            return track.artistId
        })
        let genres = []
        spotifyApi.getArtists([...new Set(artistIds)])
        .then(data => {
            data.body.artists.forEach(artist => {
                artist.genres.forEach(genre => {
                    genres.push(genre)
                })
            })
            let unorderedGenres = findGenres(genres)
            const genresInOrder = []
            let max = highestFreq(unorderedGenres)
            genresInOrder.push(max)
            for (let i=0; i< unorderedGenres.length - 1 ; i++){
                unorderedGenres.splice(unorderedGenres.indexOf(max), 1)
                max = highestFreq(unorderedGenres)
                genresInOrder.push(max)
            }
            console.log('genres in order', genresInOrder)
            setGenreSeeds(genresInOrder.slice(0,5))
            console.log('extracted genres', genresInOrder.slice(0,5))

            let unorderedArtists = itemFreq(artistIds)
            const artistsInOrder = []
            let topArtist = highestFreq(unorderedArtists)
            artistsInOrder.push(topArtist)
            for (let i=0; i< unorderedArtists.length - 1; i++){
                unorderedArtists.splice(unorderedArtists.indexOf(topArtist), 1)
                topArtist = highestFreq(unorderedArtists)
                artistsInOrder.push(topArtist)
            }
            console.log('top artists', artistsInOrder)
            setArtistSeeds(artistsInOrder)
        })

    }, [playlistTracks])

    useEffect(() => {
        if (albumTracks.tracks.length === 0) return
        spotifyApi.getArtist(albumTracks.tracks[0].artistId)
        .then(data => {
            let genres = data.body.genres
            console.log('artist genres', genres)
            let re = /r&b/gi
            let re2 = /rock&roll/gi
            genres.forEach((genre,i, array) => {
                if (re.test(genre)) array.splice(i, 1, 'r-n-b')
                if (re2.test(genre)) array.splice(i, 1, 'rock-n-roll')
            })
            genres = findGenres(genres)
            console.log('filtered genres are', genres)
            setGenreSeeds(genres)
        })
    },[albumTracks])
   
    
    // Functions
    const itemFreq = (array) => {
        let summarayArray = [...new Set(array)]
        const freqArray = []
        summarayArray.forEach(ref => {
            let score = 0
            array.forEach(item => {
                if (ref === item) score += 1
            })
            freqArray.push({ref:ref, freq:score})
        })
        return freqArray

    }
    const selectItem = (item, param) => {
        const exists = paramToSelection[param].filter(selecteditem =>{
            return selecteditem.uri === item.uri
        })
        if(exists.length === 0){
            if (param === 'album') {
                setParamToSelection({...paramToSelection, [param]:[item], 'playlist':[]})
                setPlaylistTracks({title:'', tracks:[]})
            }else if (param === 'playlist'){
                setParamToSelection({'artist':[], 'track':[], 'album':[], [param]:[item]})
                setAlbumTracks({title:'', tracks:[]})
            }
            else{
                setParamToSelection({...paramToSelection, [param]:[...paramToSelection[param], item], 'playlist':[]})
                setPlaylistTracks({title:'', tracks:[]})
            }
        }
        setSearch('')
        setRevealStatus(false)
        if (param === 'album'){
            spotifyApi.getAlbum(item.id)
            .then(data => {
                setArtistSeeds([{ref:data.body.artists[0].id, freq:1}])
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
                        duration:`${Math.round(track.duration_ms/60000)}:${Math.round((Math.round(track.duration_ms/1000)%60)/10)}${(Math.round(track.duration_ms/1000)%60)%10}`
                    }
                })
                setAlbumTracks({ title: data.body.name, tracks:tracks})
            }).catch(error => {
                console.log(error.message)
            })
        } else if (param === 'playlist') {
            spotifyApi.getPlaylist(item.id)
            .then(data => {
                let tracks = data.body.tracks.items.map(item => {
                    const trackImage= item.track.album.images.reduce(
                        (largest, image) => {
                            if (image.height > largest.height) return image
                            return largest
                        },
                        item.track.album.images[0]
                    )
                    return {
                        type:'track',
                        title: item.track.name,
                        uri: item.track.uri,
                        id:item.track.id,
                        preview_url: item.track?.preview_url || '',
                        imageUrl: trackImage.url,
                        albumTitle: item.track.name,
                        artist: item.track.artists[0].name,
                        artistId: item.track.artists[0].id,
                        // genres:item.track.artists[0].genres,
                        duration:`${Math.round(item.duration_ms/60000)}:${Math.round((Math.round(item.duration_ms/1000)%60)/10)}${(Math.round(item.duration_ms/1000)%60)%10}`
                    }    
                })
                
                setPlaylistTracks({title:item.title, tracks:tracks})
            }).catch(error => {
                console.log(error.message)
            })
            

        }
        
    }
    const deselectItem = (item, param) => {
        setParamToSelection(
            {...paramToSelection, 
                [param]: paramToSelection[param].filter(toBeRemovedItem => {
                    return item !== toBeRemovedItem
                })
            })
        if(param === 'album') setAlbumTracks({title:'', tracks:[]})
        if (param === 'playlist') setPlaylistTracks({title:'', tracks:[]})
    }
    
    const handleChangeTrack = (track) => {
        setChangeTrackTo(track)
        setPlayingTracks(recommendations)
    }
    
    
    
   
    
    
    
   

    // lyrics stretch goal to be implemented after project due date:

    // function playTrack(track) {
    //     // setPlayingTrack(track)
    //     setSearch("")
    //     setLyrics("")
    // }

    return(
        <div className='apiSearch'>
            <section className='search'>
                <form 
                className='searchBox'
                onSubmit={(e) => e.preventDefault()}>
                    <input
                            type="text"
                            placeholder={`Search by ${param.slice(0,1).toUpperCase() + param.slice(1).toLowerCase()}`}
                            value={search}
                            onChange={e => {
                                setRevealStatus(true)
                                setSearch(e.target.value)
                            } }
                        />
                </form>
                <SearchOptions searchBy={(e) => setParam(e.target.id)} param={param}/>
                <div className='sliders'>
                    <Slider min={0} max={100} handleRecoParam={handleRecoParam} recoParam={'popularity'} />
                    <Slider min={0} max={100} handleRecoParam={handleRecoParam} recoParam={'energy'} />
                    <Slider min={0} max={100} handleRecoParam={handleRecoParam} recoParam={'tempo'} />
                    <Slider min={0} max={100} handleRecoParam={handleRecoParam} recoParam={'valence'} />
                    <Slider min={0} max={100} handleRecoParam={handleRecoParam} recoParam={'acousticness'} />
                    <Slider min={0} max={100} handleRecoParam={handleRecoParam} recoParam={'instrumentalness'} />
                    <Slider min={0} max={100} handleRecoParam={handleRecoParam} recoParam={'danceability'} />
                    <Slider min={0} max={100} handleRecoParam={handleRecoParam} recoParam={'speechiness'} />
                </div>
            </section>
            <div className='searchResults'>
            {   revealStatus ? (
                    searchResults.map(searchResult => {
                        return <DisplayItem 
                                item={searchResult} 
                                selectItem={selectItem}
                                /> 
                    })
                )  
                : <></>
            }
            </div>
            {
                paramToSelection[param].length !== 0 ?
                <section className='selectedItems'>
                    <h4>Selected {`${param}s`}</h4>
                    {
                        paramToSelection[param].map(item => {
                            return <DisplaySelected
                                    param={param}
                                    item={item}
                                    deselectItem={deselectItem}
                                    setSelectedItem={setSelectedItem}
                                    changeTrackTo= {handleChangeTrack} 
                                    />
                        })
                    }

                </section>
                :
                <></>
            }
            {
                selectedItem ?
                <ArtistProfile 
                item={selectedItem} 
                setSelectedItem={setSelectedItem}
                setPreviewItem={setPreviewItem}
                setAlbumTracks={setAlbumTracks}
                setParam={setParam} 
                spotifyApi={spotifyApi} 
                changeTrackTo={changeTrackTo}/>
                :
                <></>
            }
            {
                param === 'album' && albumTracks.tracks.length !== 0 ?
                <section className='previewTracks'>
                    <h4>{albumTracks.title} Preview</h4>
                    {
                        albumTracks.tracks.map(track => {
                            return <RecoTrack 
                            track={track} 
                            preview_url={track.preview_url}
                            setPreviewItem={setPreviewItem}
                            user={user}
                            changeTrackTo= {handleChangeTrack} 
                            selectItem={selectItem}
                            spotifyApi={spotifyApi} 
                            setSelectedItem={setSelectedItem}
                            key={track.uri}/>
                        })
                    }

                </section>
                :
                <></>
            }
            {
                param === 'playlist' && playlistTracks.tracks.length !== 0 ?
                <section className='previewTracks'>
                    <h4>{playlistTracks.title} Preview</h4>
                    {
                        playlistTracks.tracks.map(track => {
                            return <RecoTrack 
                            track={track} 
                            preview_url={track.preview_url}
                            setPreviewItem={setPreviewItem}
                            user={user}
                            changeTrackTo= {handleChangeTrack} 
                            selectItem={selectItem}
                            spotifyApi={spotifyApi} 
                            key={track.uri}/>
                        })
                    }

                </section>
                : 
                <></>
            }

            {
            recommendations.length !==0 ? 
            <section className='recommendations'>
                <h4>Suggested Tracks</h4>
                {recommendations.map(track => {
                    return <RecoTrack 
                                track={track} 
                                preview_url={track.preview_url}
                                setPreviewItem={setPreviewItem}
                                user={user}
                                changeTrackTo= {handleChangeTrack} 
                                selectItem={selectItem}
                                spotifyApi={spotifyApi} 
                                key={track.uri}/>
                    })
                }
            </section>
            :  <></>
                    
            }
            {
                previewItem ?
                <section className='previewSection'>
                    <Preview item={previewItem} />
                </section>
                :
                <></>
            }

            {/* {
                playerId && apiReady ?
                <WebPlayer 
                player={player}
                playerId={playerId}
                spotifyApi={spotifyApi}
                changeTrackTo={changeTrackTo}
                selectItem={selectItem}
                setChangeTrackTo={setChangeTrackTo}
                listOfTracks={playingTracks}
                />
                :
                <></>
            } */}
            
            {/* stretch goal to be implemented after project due date */}
                {/* {searchTrackResults.length === 0 && (
                <div style={{ whiteSpace: "pre" }}>
                {lyrics}
                </div>
                )} */}
        </div>
    )
}