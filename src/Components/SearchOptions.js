import { useEffect, useRef, useState } from 'react'
export default function SearchOptions({ searchBy, param }) {
    const searchOptions = useRef(['track', 'artist', 'album', 'playlist'])
    const [displayOptions, setDisplayOptions] = useState([])
    useEffect(() => {
        setDisplayOptions(searchOptions.current.filter(option => {
            return option !== param
        }))
    }, [param])
    return(
        <div className='searchOptionsContainer'>
            <ul className='listOfOptions'>
                {
                     displayOptions.map(option => {
                        return <li className='option' id={`${option}`} onClick={(e) => searchBy(e)}> {option}</li>
                    })
                }
            </ul>
            <div className='selectedOption'>
                {param}
            </div>
        </div>
    )

}