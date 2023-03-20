  export default function findGenres(genres){
    const availableGenres = [
    "acoustic",
    "afrobeat",
    "alt-rock",
    "alternative",
    "ambient",
    "anime",
    "black-metal",
    "bluegrass",
    "blues",
    "bossanova",
    "brazil",
    "breakbeat",
    "british",
    "cantopop",
    "chicago-house",
    "children",
    "chill",
    "classical",
    "club",
    "comedy",
    "country",
    "dance",
    "dancehall",
    "death-metal",
    "deep-house",
    "detroit-techno",
    "disco",
    "disney",
    "drum-and-bass",
    "dub",
    "dubstep",
    "edm",
    "electro",
    "electronic",
    "emo",
    "folk",
    "forro",
    "french",
    "funk",
    "garage",
    "german",
    "gospel",
    "goth",
    "grindcore",
    "groove",
    "grunge",
    "guitar",
    "happy",
    "hard-rock",
    "hardcore",
    "hardstyle",
    "heavy-metal",
    "hip-hop",
    "holidays",
    "honky-tonk",
    "house",
    "idm",
    "indian",
    "indie",
    "indie-pop",
    "industrial",
    "iranian",
    "j-dance",
    "j-idol",
    "j-pop",
    "j-rock",
    "jazz",
    "k-pop",
    "kids",
    "latin",
    "latino",
    "malay",
    "mandopop",
    "metal",
    "metal-misc",
    "metalcore",
    "minimal-techno",
    "movies",
    "mpb",
    "new-age",
    "new-release",
    "opera",
    "pagode",
    "party",
    "philippines-opm",
    "piano",
    "pop",
    "pop-film",
    "post-dubstep",
    "power-pop",
    "progressive-house",
    "psych-rock",
    "punk",
    "punk-rock",
    "r-n-b",
    "rainy-day",
    "reggae",
    "reggaeton",
    "road-trip",
    "rock",
    "rock-n-roll",
    "rockabilly",
    "romance",
    "sad",
    "salsa",
    "samba",
    "sertanejo",
    "show-tunes",
    "singer-songwriter",
    "ska",
    "sleep",
    "songwriter",
    "soul",
    "soundtracks",
    "spanish",
    "study",
    "summer",
    "swedish",
    "synth-pop",
    "tango",
    "techno",
    "trance",
    "trip-hop",
    "turkish",
    "work-out",
    "world-music"
  ]
    const genreFrequency = {}
    availableGenres.forEach(availableGenre => {
        let score = 0
        let re = new RegExp(availableGenre, 'gi')
        genres.forEach(genre => {
            if (re.test(genre)) score += 1
        })
        genreFrequency[availableGenre] = score
    })
    console.log('genre frequency', genreFrequency)
    const extractedGenres = []
    for (let genre in genreFrequency){
        if (genreFrequency[genre] > 0) extractedGenres.push({genre:genre, freq:genreFrequency[genre]}) 
    }
     console.log('extracted before sort', extractedGenres)
    // for (let i=0; i < extractedGenres.length - 1; i++){
    //     if (extractedGenres[i+1].freq > extractedGenres[i].freq){
    //         console.log('swapping')
    //         let temp = {...extractedGenres[i]}
    //         extractedGenres[i] = {...extractedGenres[i+1]}
    //         extractedGenres[i+1] = temp
    //     }
    // }
    // console.log('extracted', extractedGenres)
    return extractedGenres

  }