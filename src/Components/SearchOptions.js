import {useRef} from 'react'
export default function SearchOptions({ searchBy }) {
    const searchOptions = useRef(['track', 'artist', 'album', 'playlist'])
    return(
        <div className='searchOptionsContainer'>
            <div className='selectedOption'>
            </div>
            <ul className='listOfOptions'>
                 {
                    searchOptions.current.map(searchOption => {
                        return <li className='option' id={`${searchOption}`} onClick={(e) => searchBy(e)}>{searchOption}</li>
                    })
                }
            </ul>
        </div>
    )

}