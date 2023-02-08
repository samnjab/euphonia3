import React from "react"
import { useState, useEffect } from 'react'
import TrackSearchResult from './TrackSearchResult'
import ArtistSearchResult from './ArtistSearchResult'
import DisplayTrack from "./DisplayTrack"
import DisplayArtist from "./DisplayArtist"
import RecoTrack from './RecoTrack'
import Player from './Player'
import Slider from './Slider'
import Error from './Error'
export default function ApiSearch({ param, spotifyApi, accessToken, user}){
    const [trackSearch, setTrackSearch] = useState('')
    const [artistSearch, setArtistSearch] = useState('')
    const [searchTrackResults, setSearchTrackResults] = useState([])
    const [searchArtistResults, setSearchArtistResults] = useState([])
    const [revealStatus, setRevealStatus] = useState(false)
    const [selectedTracks, setSelectedTracks] = useState([])
    const [selectedArtists, setSelectedArtists] = useState([])
    const [recommendations, setRecommendations] = useState([])
    const [playingTrack, setPlayingTrack] = useState([])
    const [playingTracks, setPlayingTracks] = useState([])
    const [playingStatus, setPlayingStatus]= useState(false)
    const [recoParams, setRecoParams] = useState({popularity:{}, energy:{}, tempo:{}, valence:{},acousticness:{}, danceability:{}, instrumentalness:{}, speechiness:{}})

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
    

    const handlePlayTrack = (track) => {
        setPlayingTrack(track)
        setPlayingTracks(recommendations)
    }

    const changePlay = (e) => {
        (e) ? setPlayingStatus(true) : setPlayingStatus(false)
    }
    
    const deselectTrack = (toBeRemovedTrack) =>{
        setSelectedTracks(
            selectedTracks.filter(track => {
                return track !== toBeRemovedTrack
            })
        )
    }
    const deselectArtist = (toBeRemovedArtist) =>{
        setSelectedArtists(
            selectedArtists.filter(artist => {
                return artist !== toBeRemovedArtist
            })
        )
    }

    const selectTrack = (track) =>{
        const exists = selectedTracks.filter(selectedTrack =>{
            return selectedTrack.uri === track.uri
        })
        if(exists.length == 0){
            setSelectedTracks([...selectedTracks, track])
        }
        setTrackSearch([])
        setRevealStatus(false)
    }
    const selectArtist = (artist) => {
        const exists = selectedArtists.filter(selectedArtist =>{
            return selectedArtist.uri === artist.uri
        })
        if (exists.length == 0){
            setSelectedArtists([...selectedArtists, artist])
        }
        setArtistSearch([])
        setRevealStatus(false)
    }
    useEffect(() => {
        if(!accessToken) return
        if(selectedTracks.length == 0 && selectedArtists.length == 0) {
            setRecommendations([])
            return 
        }
        let start = true
        const seedTracks = selectedTracks.map(track => {
            return track.id
        })
        const seedArtists = selectedArtists.map(artist=>{
            return artist.id
        })
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
            // seed_artists:seedArtists,
            seed_tracks: seedTracks,
            seed_artists:seedArtists,
            ...requestParams
            

        }).then(data => {
            if (!start) return
            const recommendations = data.body;
            setRecommendations(
                data.body?.tracks?.map(track => {
                    const smallestAlbumImage = track.album.images.reduce(
                        (smallest, image) => {
                            if (image.height < smallest.height) return image
                            return smallest
                        },
                        track.album.images[0]
                    )
                    return {
                        artist: track.artists[0].name,
                        artistId: track.artists[0].id,
                        title: track.name,
                        albumTitle:track.album.name,
                        uri: track.uri,
                        albumUrl: smallestAlbumImage.url,
                        id:track.id,
                        duration:`${Math.round(track.duration_ms/60000)}:${Math.round(track.duration_ms/1000)%60}`
                    }
                })
            )

        }).catch(error=>{
            return 
        })
    
        
        
        return () => start = false

    },[selectedTracks, selectedArtists, recoParams])
    
    useEffect(() => {
        if (!accessToken) return
        spotifyApi.setAccessToken(accessToken)
    }, [accessToken])

    // lyrics stretch goal to be implemented after project due date:

    // function playTrack(track) {
    //     // setPlayingTrack(track)
    //     setSearch("")
    //     setLyrics("")
    // }

    useEffect(() => {
        if (!trackSearch) return setSearchTrackResults([])
        if (!accessToken) return
        let start = true
        spotifyApi.searchTracks(trackSearch)
        .then(res => {
            if (!start) return
            setSearchTrackResults(
                res.body.tracks.items.map(track => {
                    const smallestAlbumImage = track.album.images.reduce(
                        (smallest, image) => {
                            if (image.height < smallest.height) return image
                            return smallest
                        },
                        track.album.images[0]
                    )
                    return {
                        artist: track.artists[0].name,
                        artistId: track.artists[0].id,
                        title: track.name,
                        uri: track.uri,
                        albumUrl: smallestAlbumImage.url,
                        id:track.id
                    }
                })
            )
        })

        return () => (start = false)
    }, [trackSearch, accessToken])
    
    useEffect(() => {
        if (!artistSearch) return setSearchArtistResults([])
        if (!accessToken) return
        let start = true
        spotifyApi.searchArtists(artistSearch)
        .then(res => {
            if (!start) return
            setSearchArtistResults(
                res.body.artists.items.map(artist => {
                    let pickedImg = artist.images[0]
                    try{
                        const smallestArtistImage = artist.images.reduce(
                            (smallest, image) => {
                                if (image.height < smallest.height) return image
                                return smallest
                            },
                            artist.images[0]
                        )
                        pickedImg = smallestArtistImage.url 
                    }
                    catch{
                        pickedImg = artist.images[0]
                    }
                    return {
                        id: artist.id,
                        name: artist.name,
                        uri: artist.uri,
                        artistImg: pickedImg
                    }
                })
            )
            
        })

        return () => (start = false)
    }, [artistSearch, accessToken])

    return(
        <div className='apiSearch'>
            <form 
            className='searchBox'
            onSubmit={(e) => e.preventDefault()}>
                <input
                        type="text"
                        placeholder={param==='artist' ? 'Search by Artist' : 'Search by Track'}
                        value={param==='artist' ? artistSearch : trackSearch}
                        onChange={e => param==='artist' ? setArtistSearch(e.target.value) : setTrackSearch(e.target.value) }
                        onClick={e => {
                            revealStatus ? setRevealStatus(false) : setRevealStatus(true)
                        }}
                    />
            </form>
            
            <div className='searchResults'>
            {   revealStatus ? (
                    param ==='artist' ? 
                    searchArtistResults.map(artist => {
                        return <ArtistSearchResult 
                        artist={artist}
                        key={artist.uri}
                        selectArtist={selectArtist}
                        /> 
                    })
                    :
                    searchTrackResults.map(track => {

                        return <TrackSearchResult
                        track={track}
                        key={track.uri}
                        selectTrack={selectTrack}
                        playTrack= {handlePlayTrack}
                        changePlay={changePlay}
                    />
                    })
                )  
                : <></>
            }
            </div>
            <div className='selected'>
                {   
                    param === 'artist' ? 
                    selectedArtists.map(artist => {
                        return <DisplayArtist 
                                artist = {artist}
                                deselectArtist={deselectArtist} 
                                key={artist.uri}
                                /> 
                    })
                    : selectedTracks.map(track => {
                        return <DisplayTrack 
                                track={track} 
                                deselectTrack={deselectTrack}
                                key={track.uri}
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
            
            <div className='recommendations'>
                {
                recommendations ? 
                recommendations.map(track => {
                    return <RecoTrack 
                            track={track} 
                            user={user}
                            playTrack= {handlePlayTrack} 
                            playingStatus={playingStatus}
                            playingTrack={playingTrack}
                            changePlay={changePlay}
                            selectTrack={selectTrack}
                            spotifyApi={spotifyApi} 
                            key={track.uri}/>
                })
                :  <Error message={'No recos!'}/>
                    
                }
            </div>
            {
                playingTracks ?
                <Player 
                accessToken={accessToken} 
                track={playingTrack} 
                listOfTracks={playingTracks}
                playingStatus={playingStatus} 
                changePlay={changePlay} 
                changePlayingTrack={(track)=> setPlayingTrack(track)}/>
                :
                <></>

            }
            {/* stretch goal to be implemented after project due date */}
                {/* {searchTrackResults.length === 0 && (
                <div style={{ whiteSpace: "pre" }}>
                {lyrics}
                </div>
                )} */}

        </div>

        
    )
}