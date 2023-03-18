// Modules
import React from 'react'
import { useState, useEffect, useRef } from 'react'
// Components
import RecoTrack from './RecoTrack'
import WebPlayer from "./WebPlayer"
import Slider from './Slider'
import Error from './Error'
import DisplayItem from './DisplayItem'
import DisplaySelected from './DisplaySelected'
export default function ApiSearch({ param, spotifyApi, accessToken, user}){

    const [search, setSearch] = useState('')
    const [searchResults, setSearchResults] = useState([])
    const [paramToSelection, setParamToSelection] = useState({'track':[], 'artist':[], 'album':[], 'playlist':[]})
    const [albumTracks, setAlbumTracks] = useState({title:'', tracks:[]})
    const [playlistTracks, setPlaylistTracks] = useState({title:'', tracks:[]})
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

    useEffect(() => {
        if (!accessToken) return
        const script = document.createElement('script')
        script.src = "https://sdk.scdn.co/spotify-player.js"
        script.async = true
        document.body.appendChild(script)
        window.onSpotifyWebPlaybackSDKReady = () => {
            const player = new window.Spotify.Player({
                name: 'Euphonia',
                getOAuthToken:cb => {cb(accessToken)},
                volume:0.5
            })
            setPlayer(player)
        }
    },[accessToken])

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
                            artistId: album.artists[0].id
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
        for (param in paramToSelection){
            if (paramToSelection[param].length !== 0) selected= true
        }
        if (!selected){
             setRecommendations([])
            return 
        }
        let start = true
        const seedTracks = [...paramToSelection['track'].map(track => {
            return track.id
        }), ...playlistTracks.tracks.map(track => {
            return track.id
        })]
        console.log('seed track are', seedTracks)
        const seedArtists = paramToSelection['artist'].map(artist=>{
            return artist.id
        })
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
            ...requestParams
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
                        duration:`${Math.round(track.duration_ms/60000)}:${Math.round(track.duration_ms/1000)%60}`
                    }
                })
            )
        }).catch(error => {
            return 
        })
        return () => start = false
    },[paramToSelection, recoParams, playlistTracks, albumTracks])

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
    
    // Functions
    const selectItem = (item, param) => {
        const exists = paramToSelection[param].filter(selecteditem =>{
            return selecteditem.uri === item.uri
        })
        if(exists.length === 0) setParamToSelection({...paramToSelection, [param]:[...paramToSelection[param], item]})
        setSearch('')
        setRevealStatus(false)
        if (param === 'album'){
            spotifyApi.getAlbum(item.id)
            .then(data => {
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
                        duration:`${Math.round(item.track.duration_ms/60000)}:${Math.round(item.track.duration_ms/1000)%60}`
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
            <form 
            className='searchBox'
            onSubmit={(e) => e.preventDefault()}>
                <input
                        type="text"
                        placeholder={`Search by ${param}`}
                        value={search}
                        onChange={e => {
                            setRevealStatus(true)
                            setSearch(e.target.value)
                        } }
                    />
            </form>
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
            <div className='selected'>
                {
                    paramToSelection[param].map(item => {
                        return <DisplaySelected
                                param={param}
                                item={item}
                                deselectItem={deselectItem}
                                />
                    })
                }

            </div>
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
            {
                param === 'album' && albumTracks.tracks.length !== 0 ?
                <div className='albumTracks'>
                    <h4>{albumTracks.title}</h4>
                    {
                        albumTracks.tracks.map(track => {
                            return <RecoTrack 
                            track={track} 
                            preview_url={track.preview_url}
                            user={user}
                            changeTrackTo= {handleChangeTrack} 
                            selectItem={selectItem}
                            spotifyApi={spotifyApi} 
                            key={track.uri}/>
                        })
                    }

                </div>
                :
                <></>
            }
            {
                param === 'playlist' && playlistTracks.tracks.length !== 0 ?
                <div className='playlistTracks'>
                    <h4>{playlistTracks.title}</h4>
                    {
                        playlistTracks.tracks.map(track => {
                            return <RecoTrack 
                            track={track} 
                            preview_url={track.preview_url}
                            user={user}
                            changeTrackTo= {handleChangeTrack} 
                            selectItem={selectItem}
                            spotifyApi={spotifyApi} 
                            key={track.uri}/>
                        })
                    }

                </div>
                : 
                <></>
            }
            <div className='recommendations'>
                {
                recommendations ? 
                recommendations.map(track => {
                    return <RecoTrack 
                            track={track} 
                            preview_url={track.preview_url}
                            user={user}
                            changeTrackTo= {handleChangeTrack} 
                            selectItem={selectItem}
                            spotifyApi={spotifyApi} 
                            key={track.uri}/>
                })
                :  <Error message={'No recos!'}/>
                    
                }
            </div>
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