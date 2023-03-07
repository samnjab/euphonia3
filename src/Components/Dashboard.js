// Modules
import SpotifyWebApi from "spotify-web-api-node"
// Hooks
import { useState, useEffect } from "react"
// Components
import useAuth from "./useAuth"
import Player from "./Player"
import ApiSearch from "./ApiSearch"
import ToggleSwitch from "./ToggleSwitch"
import DisplayMe from './DisplayMe'

const spotifyApi = new SpotifyWebApi({
    clientId: '0f4b9eb9ae8b479bb20f5cb8d21d54f9',
})

export default function Dashboard({ code }) {
    const accessToken = useAuth(code)
    const [user, setUser] = useState({})

    const [lyrics, setLyrics] = useState("")
    const [searchParam, setSearchParam] = useState('track')
    
    const addUser= (user) =>{
        setUser(user)
    }
    

    const searchBy = (e) => {
        if (e.target.checked){
            setSearchParam('artist')
        }else{
            setSearchParam('track')
        }
    }

    // useEffect(() => {
    //     if (!playingTrack) return
    //     axios
    //     .get("http://localhost:3001/lyrics", {
    //         params: {
    //           track: playingTrack.title,
    //           artist: playingTrack.artist,
    //         },
    //     })
    //     .then(res => {
    //       setLyrics(res.data.lyrics)
    //     })
    // }, [playingTrack])

    // useEffect(() => {
    //     if (!accessToken) return
    //     spotifyApi.setAccessToken(accessToken)
    // }, [accessToken])
    
    

    return (
        <section className='dashboard'>
            <div className='wrapper'>
                <div className='topRow'>
                    <DisplayMe accessToken={accessToken} spotifyApi={spotifyApi} addUser={addUser}/>
                    <ToggleSwitch 
                    label='Track/Artist'
                    searchBy={searchBy}
                    />
                </div>
                <ApiSearch param={searchParam} spotifyApi={spotifyApi} accessToken={accessToken} user={user} />
            </div>
        </section>
  )
}