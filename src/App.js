import react from 'react'
import WebFont from 'webfontloader';
import { useEffect } from 'react'
import Login from "./Components/Login"
import Dashboard from "./Components/Dashboard"
import './App.css'

const code = new URLSearchParams(window.location.search).get("code")



function App() {
  useEffect(() => {
      WebFont.load({
          google: {
              families: ['Montserrat']
          }
      });
 }, [])

  return (
    <div className='App'>
        <header className='App-header'>
            <h1> Euphonia</h1>
            <h2>old favourites multiplied</h2>
        </header>
        <main>
            {code ? <Dashboard code={code} /> : <Login />}
        </main>
        <footer><p>Powered by Spotify API</p><p>by Sam J. @ Juno</p></footer>
    </div>

  )
}

export default App