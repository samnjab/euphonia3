import React from "react"
import {useState, useEffect} from 'react'

import Playlists from './Playlists';
import SoloView from "./SoloView";

export default function TrackSearchResult({ track, preview_url, playTrack, selectTrack, spotifyApi, user, playingStatus, playingTrack, changePlay }) {
    const [viewSolo, setViewSolo] = useState(false)
    console.log('track is', track)
    

    return ( 
      <div className='recoTrack'>
          <audio src={preview_url} id={`${track.uri}`}></audio>
          <div onClick={() => {
                let audioElement = document.getElementById(`${track.uri}`)
                console.log(audioElement)
                audioElement.play()
              } }>Play track preview</div>
            <div ></div>
            <div 
            className='iconBox'>
                {   playingTrack.id !== track.id ?
                    <i className="fa-solid fa-play play"
                        onClick= {()=> {
                            playTrack(track)
                            changePlay(true)
                            }}>
                    </i>    
                    :
                    (
                        playingStatus ?
                        <i className="fa-solid fa-pause pause" 
                            onClick={()=>{
                                changePlay(false)
                            }}>
                        </i>
                        :
                        <i className="fa-solid fa-play play" 
                        onClick={()=>{
                            changePlay(true)
                            }}>   
                        </i>
                    )
                }
            </div>
            {console.log('preview url', preview_url)}
            <a src={preview_url} 
            onClick={() => setViewSolo(true) }
            onHover ={()=>{
                const audioElement = document.getElementById(`${track.uri}`)
                console.log(audioElement)
                audioElement.play()
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