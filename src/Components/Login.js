import React from "react"
import axios from "axios"


const AUTH_URL =
  "https://accounts.spotify.com/authorize?client_id=0f4b9eb9ae8b479bb20f5cb8d21d54f9&response_type=code&redirect_uri=http://localhost:3000&scope=streaming%20app-remote-control%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state%20user-read-currently-playing%20user-read-playback-position%20user-read-recently-played%20user-top-read"

  const signIn = () => {
    axios.get('/api/express/client_credentials', {mode: 'cors'})
    .then(res => {
      console.log('sign in', res)
    }).catch(error => {
      console.log(error.message)
    })

  }

export default function Login() {
  return (
    <div className="login">
        <a className="btn btn-success btn-lg" href={AUTH_URL}>
          Login With Spotify
        </a>
        <button onClick={() => signIn()}>client credentials</button>
    </div>
  )
}

// https://euphonia3.vercel.app/