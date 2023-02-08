import React from "react"

export default function TrackSearchResult({ track, selectTrack}) {
    
    return ( 

      <div
          style={{ cursor: "pointer" }}
          className='trackSearchResult'
          onClick={()=>selectTrack(track)}
          >
          <img src={track.albumUrl}
            //    track preview stretch goal to be implemented after project due date
            // onMouseOver={()=>{
            //     playTrack(track)
            //     changePlay(true)
            //     }
            // } 
            className='cover'/>
          <div className='info'>
              <h5>{track.title}</h5>
              <h5>{track.artist}</h5>
          </div>
      </div>
    )
}