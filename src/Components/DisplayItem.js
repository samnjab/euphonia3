import { useEffect, useRef } from 'react'
export default function DisplayItem({ item, selectTrack, selectArtist, selectAlbum, selectPlaylist }) {
  const typeToFunction = [{ type:'track', function:selectTrack }, { type:'artist', function:selectArtist }, { type:'album', function:selectAlbum }, { type:'playlist', function:selectPlaylist }]
  const selectFunction = useRef()
  useEffect(() => {
    selectFunction.current = typeToFunction.filter(pair => {
      return pair.type === item.type
    })
  }, [item])
    return ( 
      <div
          style={{ cursor: "pointer" }}
          className='searchResult'
          onClick={()=> selectFunction.current[0].function(item)}
          >
          <img 
            src={item.imageUrl}
            className='cover'/>
          <div className='info'>
              <h5>{item.title}</h5>
              {
                  item.artist ?
                  <h5>{item.artist}</h5>
                  :
                  <></>
              }
          </div>
      </div>
    )
}