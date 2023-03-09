import react from 'react';
import { useState, useEffect } from 'react';
import {Routes, Route, useNavigate} from 'react-router-dom';
import Canvas from './Components/Canvas';
import Header from './Components/Header';
import Login from "./Components/Login";
import Dashboard from "./Components/Dashboard";
import './App.css'

function App() {
    const navigate = useNavigate()
    const [code, setCode] = useState(new URLSearchParams(window.location.search).get("code"))
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark')
    const [windowDims, setWindowDims] = useState([window.innerWidth, window.innerHeight])
    const themes = ['lightPink', 'darkPink', 'lightBlue', 'darkBlue']
    
    useEffect(() => {
        console.log('code is', code)
        if (code) navigate('/app')
    },[code])

    useEffect(() => {
    localStorage.setItem('theme', theme)
    document.body.className = localStorage.getItem('theme');
  }, [theme])

  window.addEventListener('resize', ( )=> {
    setWindowDims([document.documentElement.clientWidth, document.documentElement.clientHeight])
  })
    
  return (
    <div className={`App ${theme}`}>
        <div className='layout'>
            <i className='themeToggle' 
                aria-hidden="true"
                onClick={()=> {
                            let i = themes.indexOf(theme)
                            if (i < themes.length - 1) setTheme(themes[i + 1])
                            else setTheme(themes[0])
                        }}> ◑ </i>
            <Routes>
                <Route path='/' 
                    element={<>
                            {/* <Canvas windowDims={windowDims} theme={theme}/> */}
                            <Header />  
                            <Login />
                        
                            </> }/>
                <Route path='/app'
                    element={
                        <>
                            <header className='App-header'>
                                <h1> Euphonia</h1>
                                <h2>old favourites multiplied</h2>
                            </header>
                            <Dashboard code={code} />
                        </>
                    }/>
                    
            </Routes>
        </div>
       
       
        <footer><p>Powered by Spotify API</p><p>by Sam J. @ Juno</p></footer>
    </div>

  )
}

export default App