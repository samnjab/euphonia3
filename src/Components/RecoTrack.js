import React from "react"
import {useState, useEffect, useRef} from 'react'

import Playlists from './Playlists';

export default function TrackSearchResult({ track, selectItem, spotifyApi, user, changeTrackTo }) {
    return ( 
      <div className='recoTrack'>
          <audio src={track.preview_url} id={`${track.uri}`}></audio>
            <a  
            onClick={() => changeTrackTo(track)}
            onMouseEnter ={() =>{
                const audioElement = document.getElementById(`${track.uri}`)
                audioElement.play()
            }}
            onMouseLeave ={() => {
                const audioElement = document.getElementById(`${track.uri}`)
                audioElement.pause()
            }}
            >
                <div className='img-box'>
                    <img src={track.imageUrl} className='cover' />
                </div>
            </a>
      </div>
    )
}