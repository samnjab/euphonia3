// Modules
import SpotifyWebApi from "spotify-web-api-node"
// Hooks
import { useState, useEffect } from "react"
// Components
import useAuth from "./useAuth"
import ApiSearch from "./ApiSearch"
import ToggleSwitch from "./ToggleSwitch"
import SearchOptions from "./SearchOptions"
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
        <>
            <header className='App-header'>
                <DisplayMe accessToken={accessToken} spotifyApi={spotifyApi} addUser={addUser}/>
                <h1> Euphonia</h1>
                <h2>old favourites multiplied</h2>
            </header>
            <section className='dashboard'>
                <div className='wrapper'>
                    <SearchOptions searchBy={(e) => setSearchParam(e.target.id)} searchParam={searchParam}/>
                    <ApiSearch param={searchParam} spotifyApi={spotifyApi} accessToken={accessToken} user={user} />
                </div>
            </section>
        </>
  )
}