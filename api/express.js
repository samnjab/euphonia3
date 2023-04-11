const app = require('express')();
// const request = require('request');
require('dotenv').config();

const SpotifyWebApi = require("spotify-web-api-node")

app.get('/api/express/code/:code', (req, res) => {
  const { code } = req.params;
  res.set('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate');
  
  const spotifyApi = new SpotifyWebApi({
    redirectUri: 'https://euphonia3.vercel.app/app',
    clientId: process.env.clientId,
    clientSecret: process.env.clientSecret
  })
  // 'https://euphonia3.vercel.app/'
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
    redirectUri: 'https://euphonia3.vercel.app/app',
    clientId: process.env.clientId,
    clientSecret: process.env.clientSecret,
    refreshToken,
  })
  res.set('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate');
  spotifyApi
    .refreshAccessToken()
    .then(data => {
      res.json({
        accessToken: data.body.access_token,
        expiresIn: data.body.expires_in,
      })
    })
    .catch(err => {
      console.log(err.message)
      res.sendStatus(400)
    })
});
app.get('/api/express/client_credentials', (req, res) => {
  const authOptions = {
  url: 'https://accounts.spotify.com/api/token',
  headers: {
    'Authorization': 'Basic ' + (new Buffer (process.env.clientId + ':' + process.env.clientSecret).toString('base64'))
  },
  form: {
    grant_type: 'client_credentials'
  },
  json: true
};

request.post(authOptions, function(error, response, body) {
  if (!error && response.statusCode === 200) {
    res.set('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate');
    res.json({
      accessToken: body.access_token, 
      expiresIn:body.expires_in
    })
  } else{
    res.sendStatus(400)
  }
});
})

module.exports = app;

