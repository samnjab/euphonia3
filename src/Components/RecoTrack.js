import React from "react"
import {useState, useEffect, useRef} from 'react'

import Playlists from './Playlists';
import SoloView from "./SoloView";

export default function TrackSearchResult({ track, selectTrack, spotifyApi, user, changeTrackTo }) {
    const [viewSolo, setViewSolo] = useState(false)
    const keepPlaying = useRef(false)
    return ( 
      <div className='recoTrack'>
          <audio src={track.preview_url} id={`${track.uri}`}></audio>
            <a  
            onClick={() => {
                setViewSolo(true)
                changeTrackTo(track)
                // keepPlaying.current = true
            } }
            onMouseEnter ={() =>{
                const audioElement = document.getElementById(`${track.uri}`)
                audioElement.play()
            }}
            onMouseLeave ={() => {
                if (!keepPlaying.current){
                    const audioElement = document.getElementById(`${track.uri}`)
                    audioElement.pause()
                }
            }}
            >
                <div className='img-box'>
                    <img src={track.albumUrl} className='cover' />
                </div>
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