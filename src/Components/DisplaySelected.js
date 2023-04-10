import { useEffect, useRef } from 'react'
export default function DisplaySelected({ param, item, setPreviewItem ,deselectItem , setSelectedItem, changeTrackTo}){
    console.log('preview url for selected', item.preview_url)

return(
     <div className={'selected'}>
        <div className='xmark' onClick={() => deselectItem(item, item.type)}>x</div>
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
                setPreviewItem(item)
                if (param === 'track'){
                    const audioElement = document.getElementById(`${item.uri}`)
                    audioElement.play()
                }
                }}
                onMouseLeave ={() => {
                if (param === 'track'){
                    const audioElement = document.getElementById(`${item.uri}`)
                    audioElement.pause()
                }
            }}
        onClick={() => {
            changeTrackTo(item)
            console.log('setting item to', item)
            setSelectedItem(item)
        }}
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