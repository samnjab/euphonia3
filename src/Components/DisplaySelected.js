import { useEffect, useRef } from 'react'
export default function DisplaySelected({ param, item, deselectItem , setSelectedItem, changeTrackTo}){

return(
     <div className={'selected'}>
        <div className='xmark'onClick={() => deselectItem(item, item.type)}>x</div>
        {
            param === 'track' ?
            <audio src={item.preview_url} id={`${item.uri}`}></audio>
            :
            <></>
        }
        <img 
        src={item.imageUrl} 
        className='cover'
        onMouseEnter ={() => {
                setSelectedItem(item)
                if (param === 'track'){
                    const audioElement = document.getElementById(`${item.uri}`)
                    audioElement.play()
                }
                }}
                onMouseLeave ={() => {
                setSelectedItem()
                if (param === 'track'){
                    const audioElement = document.getElementById(`${item.uri}`)
                    audioElement.pause()
                }
            }}
        onClick={() => changeTrackTo(item)}
        ></img>
        <div className='info'>
            <h5 className='title'>{item.title}</h5>
            {
                item.artist ?
                <h5 className='artist'>{item.artist}</h5>
                :
                <></>
            }
        </div>

    </div>
)



}