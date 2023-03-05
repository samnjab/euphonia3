const app = require('express')();
const { v4 } = require('uuid');
const SpotifyWebApi = require("spotify-web-api-node")

app.get('/api/express/code/:code', (req, res) => {
  const { code } = req.params;
  res.set('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate');
  
  // res.end(`Item: ${code}`);
  const spotifyApi = new SpotifyWebApi({
    redirectUri: 'http://localhost:3000',
    clientId: '0f4b9eb9ae8b479bb20f5cb8d21d54f9',
    clientSecret: '33016e8082384da09b7f06052f543674',
  })
  // https://euphonia3.vercel.app/
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
      console.log(err)
      res.sendStatus(400)
    })
});
app.get('/api/express/refresh/:refreshToken', (req, res) => {
  const { refreshToken } = req.params;
  res.set('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate');
  const spotifyApi = new SpotifyWebApi({
    redirectUri: 'http://localhost:3000',
    clientId: '0f4b9eb9ae8b479bb20f5cb8d21d54f9',
    clientSecret: '33016e8082384da09b7f06052f543674',
    refreshToken,
  })
  res.set('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate');
  spotifyApi
    .refreshAccessToken()
    .then(data => {
      res.json({
        accessToken: data.body.accessToken,
        expiresIn: data.body.expiresIn,
      })
    })
    .catch(err => {
      console.log(err.message)
      res.sendStatus(400)
    })
});

module.exports = app;

