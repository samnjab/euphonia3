import { useEffect, useRef } from 'react'
export default function DisplayItem({ item, selectItem }) {
  
    return ( 
      <div
          style={{ cursor: "pointer" }}
          className='searchResult'
          onClick={()=> selectItem(item, item.type)}
          >
          <img 
            src={item.imageUrl}
            className='cover'/>
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