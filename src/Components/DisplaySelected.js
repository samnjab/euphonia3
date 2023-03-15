import { useEffect, useRef } from 'react'
export default function DisplaySelected({ param, selectedTracks, selectedArtists, selectedAlbums, selectedPlaylists }){
const paramToSelection = useRef([{param:'track', selection: selectedTracks}, {param:'artist', selection: selectedArtists}, {param:'album', selection: selectedAlbums}, {param:'playlist', selection: selectedPlaylists}])
const selectionToDisplay = useRef()

useEffect(() => {
    selectionToDisplay.current = paramToSelection.filter(pair => {
        return pair.param === param
    })

}, [param])

return(
    <div className='selected'>
        {
            selectionToDisplay.map(item => {
                return(
                     <div className={`selected_${param}`}>
                        <img src={item.imageUrl} className='cover'></img>
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
            })
        }
       

    </div>
)



}