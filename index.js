const express = require('express');
const bodyParser = require('body-parser');
const twilio = require('twilio');
const fetch = require('node-fetch');
const { escape } = require('querystring');

const app = express();
const client = twilio();
const TwimlResponse = twilio.TwimlResponse;

const SERVER_BASE_URL = 'http://dk.ngrok.io';
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({extended: false}));

function searchSong(query) {
  return fetch(`https://api.spotify.com/v1/search?q=${escape(query)}&type=track&market=DE`)
    .then(response => response.json())
    .then(data => data.tracks.items[0]);
}

function getMp3Url(track) {
  return fetch(`https://api.spotify.com/v1/tracks/${track.id}`)
    .then(response => response.json())
    .then(data => data.preview_url);
}

app.post('/messages', (req, res, next) => {
  const song = req.body.Body;
  const twiml = new TwimlResponse();
  twiml.message(`One second we are searching for ${song}`);
  res.send(twiml.toString());

  client.makeCall({
    from: req.body.To,
    to: req.body.From,
    url: `${SERVER_BASE_URL}/call?song=${escape(song)}`
  }).then(data => {
    console.log('call dispatched');
  }).catch(err => {
    console.error(err.message);
  });
});

app.post('/call', (req, res, next) => {
  const song = req.query.song;
  const twiml = new TwimlResponse();

  searchSong(song).then(getMp3Url).then(url => {
    twiml.play(url);
    res.send(twiml.toString());
  });
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
})