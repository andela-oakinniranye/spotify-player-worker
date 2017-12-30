const Router = require('express').Router();

const { ENDPOINTS } = require('../config/constants/ENDPOINTS.js');
const BaseController = require('./controllers/BaseController');
const SpotifyAuthController = require('./controllers/SpotifyAuthController');

Router.get(ENDPOINTS.base, BaseController);
Router.get(ENDPOINTS.spotifyAuth, SpotifyAuthController.authWithSpotify);
Router.get(ENDPOINTS.spotifyCallback, SpotifyAuthController.handleSpotifyCallback);

module.exports = Router;
