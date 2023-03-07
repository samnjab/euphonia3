import React from "react"
import {useState, useEffect} from 'react'

import Playlists from './Playlists';
import SoloView from "./SoloView";

export default function TrackSearchResult({ track, preview_url, playTrack, selectTrack, spotifyApi, user, playingStatus, playingTrack, changePlay }) {
    const [viewSolo, setViewSolo] = useState(false)
    return ( 
      <div className='recoTrack'>
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
            <a src={preview_url} onClick={() => setViewSolo(true) }>
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