import { useEffect, useRef } from 'react'
export default function DisplaySelected({ param, item, deselectItem }){

return(
     <div 
        className={'selected'}
        onClick={(item) => deselectItem(item, item.type)}
        >
        <img src={item.imageUrl} className='cover'></img>
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