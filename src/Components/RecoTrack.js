import React from "react"
import {useState, useEffect, useRef} from 'react'

import Playlists from './Playlists';

export default function RecoTrack({ track, selectItem, spotifyApi, user, changeTrackTo, setSelectedItem }) {
    return ( 
      <div className='recoTrack'>
          <audio src={track.preview_url} id={`${track.uri}`}></audio>
            <a  
            onClick={() => changeTrackTo(track)}
            onMouseEnter ={() =>{
                setSelectedItem(track)
                const audioElement = document.getElementById(`${track.uri}`)
                audioElement.play()
            }}
            onMouseLeave ={() => {
                setSelectedItem()
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