// Modules
import SpotifyWebApi from "spotify-web-api-node"
import { FaHeadset } from 'react-icons/fa'
// Hooks
import { useState, useEffect } from "react"
// Components
import useAuth from "./useAuth"
import ApiSearch from "./ApiSearch"
import DisplayMe from './DisplayMe'

const spotifyApi = new SpotifyWebApi({
    clientId: '0f4b9eb9ae8b479bb20f5cb8d21d54f9',
})

export default function Dashboard({ code, toggleTheme }) {
    const accessToken = useAuth(code)
    const [user, setUser] = useState({})
    const [lyrics, setLyrics] = useState("")
    const [begin, setBegin] = useState(false)

    const addUser= (user) =>{
        setUser(user)
    }
    useEffect(() => {
        setTimeout(() => {
            setBegin(true)
        },[7000])
    },[])

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
            <header className='App-header app'>
                {
                    !begin ?
                    <div className='loading'>
                       <p>Welcome to E3 <FaHeadset /> ...</p>
                        <div className="lds-sonic">
                            <div></div>
                            <div></div>
                            <div></div>
                        </div>
                    </div>
                    :
                    <>
                        <div className='navigationBar'>
                            <h1>E3<FaHeadset /></h1>
                            <i className='themeToggle' aria-hidden="true" onClick={() => toggleTheme()}>◑</i>
                            <DisplayMe accessToken={accessToken} spotifyApi={spotifyApi} addUser={addUser}/>
                        </div>
                        <main className='dashboard'>
                            <ApiSearch spotifyApi={spotifyApi} accessToken={accessToken} user={user} />
                        </main>
                    
                    </>
                    
                }
               
            </header>
        </>
  )
}