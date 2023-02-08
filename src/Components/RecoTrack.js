import React from "react"
import {useState, useEffect} from 'react'

import { FaPlay, FaPlus, FaHeart, FaArrowUp, FaPause } from "react-icons/fa";
import Playlists from './Playlists'

export default function TrackSearchResult({ track, playTrack, selectTrack, spotifyApi, user, playingStatus, playingTrack, changePlay }) {
    const [addClicked, setAddClicked] = useState(false)
    // const [playingStatus, setPlayingStatus]= useState(false)
    const [inMyLibrary, setInMyLibrary] = useState(false)
    const [added, setAdded] = useState(false)

    useEffect(()=>{
        spotifyApi.containsMySavedTracks([track.id])
        .then(res=>{
            setInMyLibrary(res.body[0])
        }).catch(error=>{
            return
        })

    },[added])
    
    function handleAddTrack(){
        spotifyApi.addToMySavedTracks([track.id])
        .then(res => {
            setAdded(true)  
        }).catch(error => {
            prompt('Oops! could not add to library. Try again in a bit!')
            return
        })
    }

    function handleRemovetrack(){
        spotifyApi.removeFromMySavedTracks([track.id])
        .then(res => {
            setAdded(false)
        }).catch(error=>{
            prompt('Oops! could not remove from library. Try again in a bit!')
        })
    }
    function addToPlaylist(){
        addClicked ? setAddClicked(false) : setAddClicked(true)
    }
    return ( 

      <div className='recoTrack'>
            <div 
            className='iconBox'>
                {   playingTrack.id !== track.id ?
                        <FaPlay
                            className='play'
                            onClick={()=>{
                            playTrack(track)
                            changePlay(true)
                    }
                } />
                    :
                    (
                        playingStatus ?
                        <FaPause 
                        className='pause'
                        onClick={()=>{
                            changePlay(false)
                        }}
                        />
                        :
                        <FaPlay
                        className='play' 
                        onClick={()=>{
                            changePlay(true)
                        }}
                        />
                    )
                }
            </div>
                
            <img src={track.albumUrl} className='cover' />
            <div className='info'>
                <h5>{track.title}</h5>
                <h5 className='artist'>{track.artist}</h5>
            </div>
            <div className="icons">
                <div className='iconBox'>
                    {
                        inMyLibrary ?
                        <FaHeart className='liked' onClick={handleRemovetrack}/>
                        :
                        <FaHeart className='like' onClick={handleAddTrack}/>

                    }
                </div>
                <div className='iconBox'>
                    <FaPlus className='plus' onClick={addToPlaylist}/>
                </div>
                {
                    addClicked ?
                    <Playlists track={track} spotifyApi={spotifyApi} user={user}/>
                    :
                    <></>
                }
                <div className='iconBox'>
                    <FaArrowUp className='play'onClick={()=>selectTrack(track)}/>
                </div>

            </div>
            <h5 className="album">{track.albumTitle}</h5>
            <p className='duration'>{track.duration}</p>
      </div>
    )
}