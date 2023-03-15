import { useEffect, useRef } from 'react'
export default function DisplaySelected({ param, item, deselectItem }){

return(
     <div 
        className={`selected_${param}`}
        onClick={(item) => deselectItem(item, item.type)}
        >
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



}