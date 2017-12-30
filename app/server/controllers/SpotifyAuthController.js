const spotifyHelper = require('../../helpers/spotify_helper');
const jwtHelper = require('../../helpers/jwt');
const models = require('../../models').getModels();

const authWithSpotify = (req, res, next) => {
  const authUrl = spotifyHelper.getAuthUrl();
  console.log(authUrl);

  res.redirect(authUrl);
}

const handleSpotifyCallback = (req, res, next) => {
  const { code } = req.query;

  spotifyHelper.getTokenFromCode(code).then((data) => {
    const { spotifyId, refreshToken, accessToken, expiryTime } = data;
    models.User.findAndUpdateOrCreate({spotifyId} , {
      spotifyId,
      refreshToken,
      accessToken,
      expiryTime,
    }).then((user) => {
      const { spotifyId, id } = user.dataValues;
      const userData = {spotifyId, id}
      const numDays = 2;
      const expirationTime = Math.floor(Date.now() / 1000) + (numDays * (60 * 60 * 24 ))
      jwtHelper.signJwt(userData, expirationTime).then((token) => {
        res.status(200).json({token});
      })
    })
  });
}

module.exports = {
  authWithSpotify,
  handleSpotifyCallback,
}
