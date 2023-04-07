import React from "react"
import {useState, useEffect, useRef} from 'react'


import Playlists from './Playlists';

export default function RecoTrack({ track, selectItem, setPreviewItem, setSelectedItem, changeTrackTo, spotifyApi, user }) {
   
    return ( 
      <div className='recoTrack'>
          <audio src={track.preview_url} id={`${track.uri}`}></audio>
            <a  
            onClick={() => {
                changeTrackTo(track)
                setSelectedItem(track)
            }}
            onMouseEnter ={() =>{
                const audioElement = document.getElementById(`${track.uri}`)
                audioElement.play()
                setPreviewItem(track)
            }}
            onMouseLeave ={() => {
                const audioElement = document.getElementById(`${track.uri}`)
                audioElement.pause()
                setPreviewItem()
            }}
            >
                
            <img src={track.imageUrl} className='cover' />
                
            </a>
      </div>
    )
}