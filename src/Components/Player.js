import SpotifyPlayer from "react-spotify-web-playback"

export default function Player({ accessToken, track, listOfTracks, playingStatus, changePlay, changePlayingTrack }) {
  const indexOfSelected = listOfTracks.indexOf(track)
  const trackUris = listOfTracks.map(track => {
    return track.uri
  })
  
  if (!accessToken) return null
  return (
    <SpotifyPlayer
      className='player'
      token={accessToken}
      showSaveIcon
      magnifySliderOnHover
      name='Euphonia'
      autoPlay = {false}
      callback={state => {
        if (!state.isPlaying) changePlay(false)
        if (state.isPlaying){
          changePlayingTrack(state.track)
        }
      }}
      play={playingStatus}
      offset={indexOfSelected}
      uris={trackUris ? trackUris : []}
      styles={{
      activeColor: '#FAAE7B',
      bgColor: '#0D0D25',
      color: '#fff',
      loaderColor: '#FAAE7B',
      sliderColor: '#FAAE7B',
      trackArtistColor: '#ccc',
      trackNameColor: '#fff',
    }}
    />
  )
}