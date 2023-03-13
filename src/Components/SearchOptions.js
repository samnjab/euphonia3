import { useRef, useState } from 'react'
export default function SearchOptions({ searchBy, searchParam }) {
    const searchOptions = useRef(['track', 'artist', 'album', 'playlist'])
    return(
        <div className='searchOptionsContainer'>
            <ul className='listOfOptions'>
                {
                     searchOptions.current.map(searchOption => {
                        return <li className='option' id={`${searchOption}`} onClick={(e) => searchBy(e)}> {searchOption}</li>
                    })
                }
            </ul>
            <div className='selectedOption'>
                {searchParam}
            </div>
        </div>
    )

}