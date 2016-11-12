const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const twilio = require('twilio');
const { escape } = require('querystring');

const client = twilio();
const TwimlResponse = twilio.TwimlResponse;

const SERVER_BASE_URL = 'http://dk.ngrok.io';

const app = express();

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

app.use(bodyParser.urlencoded({ extended: false }));

app.post('/messages', (req, res, next) => {
  const message = req.body.Body;
  const from = req.body.From;
  const to = req.body.To;
  res.send('<Response><Message>Thanks for sending "' + message + '"</Message></Response>');

  client.makeCall({
    from: to,
    to: from,
    url: `${SERVER_BASE_URL}/call?song=${escape(message)}`
  }).then(() => {
    console.log('called!');
  }).catch(err => {
    console.error(err.message);
  });
});

app.post('/call', (req, res, next) => {
  const twiml = new TwimlResponse();
  const song = req.query.song;

  searchSong(song).then(getMp3Url).then(url => {
    twiml.play(url);
    res.send(twiml.toString());
  }).catch(err => {
    console.error(err.message);
  });
});

app.listen(3000, () => {
  console.log('Listening on 3000');
});