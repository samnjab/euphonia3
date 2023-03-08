import React from "react"
import {useState, useEffect, useRef} from 'react'

import Playlists from './Playlists';
import SoloView from "./SoloView";

export default function TrackSearchResult({ track, preview_url, playTrack, selectTrack, spotifyApi, user, playingStatus, playingTrack, changePlay }) {
    const [viewSolo, setViewSolo] = useState(false)
    const keepPlaying = useRef(false)
    return ( 
      <div className='recoTrack'>
          <audio src={preview_url} id={`${track.uri}`}></audio>
            <a  
            onClick={() => {
                setViewSolo(true)
                keepPlaying.current = true
            } }
            onMouseEnter ={() =>{
                const audioElement = document.getElementById(`${track.uri}`)
                console.log(audioElement)
                audioElement.play()
            }}
            onMouseLeave={() => {
                if (!keepPlaying){
                    const audioElement = document.getElementById(`${track.uri}`)
                    console.log(audioElement)
                    audioElement.pause()
                }
            }}
            >
                <img src={track.albumUrl} className='cover' />
            </a>
            { viewSolo ? 
            <SoloView 
            track={track}
            selectTrack={selectTrack}
            spotifyApi={spotifyApi}
            user={user}
             />
            : 
            <></>
            }
      </div>
    )
}