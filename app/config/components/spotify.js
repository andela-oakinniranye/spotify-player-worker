const {
  SPOTIFY_CLIENT_ID, 
  SPOTIFY_CLIENT_SECRET,
  SPOTIFY_REDIRECT_URI
 } = require('../constants/VARIABLES');

const SpotifyWebApi = require('spotify-web-api-node');

const DEFAULT_SCOPES = ['user-read-playback-state', 'user-read-currently-playing'];

const Spotify = () => {
  return new SpotifyWebApi({
    clientId : SPOTIFY_CLIENT_ID,
    clientSecret : SPOTIFY_CLIENT_SECRET,
    redirectUri : SPOTIFY_REDIRECT_URI
  });
};

module.exports = {
  Spotify,
  DEFAULT_SCOPES,
};
