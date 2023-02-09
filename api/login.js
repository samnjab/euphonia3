const SpotifyWebApi = require("spotify-web-api-node")
export default function login(req, res){
    const code = req.body.code
    const spotifyApi = new SpotifyWebApi({
        redirectUri: 'https://localhost:3000',
        clientId: '0f4b9eb9ae8b479bb20f5cb8d21d54f9',
        clientSecret: '33016e8082384da09b7f06052f543674',
    })
    res.set('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate');
    spotifyApi
        .authorizationCodeGrant(code)
        .then(data => {
        res.json({
            accessToken: data.body.access_token,
            refreshToken: data.body.refresh_token,
            expiresIn: data.body.expires_in,
        })
        })
        .catch(err => {
        console.log(err.message)
        res.sendStatus(400)
        })
}