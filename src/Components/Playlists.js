import {useEffect, useState} from 'react'
import { FaCheck } from "react-icons/fa";
export default function Playlists({track, spotifyApi, user}){
    const [playlists, setPlaylists] = useState([])
    useEffect(()=>{
        spotifyApi.getUserPlaylists(user.id).then(res=>{
            setPlaylists(res.body.items)
        }).catch(error=>{
            return
        })
    },[])
    return(
        <ul className='playlists'>

            {   playlists ?
                    playlists.map(playlist=>{
                        return (
                            <li className='playlist' key={playlist.id}>
                                <div className='iconBox'>
                                    {/* <FaCheck className='check' 
                                    onClick={()=>addTrack(track)}/> */}
                                </div>
                                {playlist.name}
                            </li>
                        )
                    })
                :
                <></>
            }
            
        </ul>
    )
}