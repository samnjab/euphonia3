import React from "react"


const AUTH_URL =
  "https://accounts.spotify.com/authorize?client_id=0f4b9eb9ae8b479bb20f5cb8d21d54f9&response_type=code&redirect_uri=http://localhost:3000&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state"

export default function Login() {
  return (
    <div className="login">
        <a className="btn btn-success btn-lg" href={AUTH_URL}>
          Login With Spotify
        </a>
    </div>
  )
}

// https://euphonia3.vercel.app/