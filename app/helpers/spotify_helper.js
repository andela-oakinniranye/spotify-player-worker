const spotifyConfig = require('../config/components/spotify');

const spotify = spotifyConfig.Spotify();

const extractRelevantData = (data) => {
  const { access_token: accessToken, expires_in: expiresIn, refresh_token: refreshToken  } = data.body;
  const expiryMilliSec = new Date().getTime() + (expiresIn * 1000);
  const expiryTime = new Date(expiryMilliSec);

  return {
    accessToken,
    expiresIn,
    expiryTime,
    refreshToken,
  }
}

const getUserData = (accessToken) => {
  spotify.setAccessToken(accessToken);

  return spotify.getMe();
}

const getAuthUrl = () => {
  const { DEFAULT_SCOPES } = spotifyConfig;
  const state = 'just-a-sample-state';
  return spotify.createAuthorizeURL(DEFAULT_SCOPES, state);
}

const getTokenFromCode = (code) => {
  return new Promise((resolve, reject) => {
    return spotify.authorizationCodeGrant(code).then((data) => {
      const relevantData = extractRelevantData(data);
      return getUserData( relevantData.accessToken ).then((userData) => {
        const { uri: spotifyId } = userData.body;
        const fullData = Object.assign({}, relevantData, { spotifyId } );

        return resolve(fullData);
      })
    }).catch((err) => {
      return reject(err)
    });
  })
}

const reauth = (spotifyId, refreshToken) => {
  return new Promise((resolve, reject) => {
    spotify.setRefreshToken(refreshToken)
    return spotify.refreshAccessToken().then((data) => {
      const relevantData = extractRelevantData(data);
      const fullData = Object.assign({}, relevantData, { spotifyId, refreshToken } );

      return resolve(fullData);
    }).catch((err) => {
      return reject(err);
    });
  });
}

const getCurrentlyPlayingMusic = (spotifyId, accessToken) => {
  return new Promise((resolve, reject) => {
    spotify.setAccessToken(accessToken)
    return spotify.getMyCurrentPlayingTrack().then((data) => {
      resolve(data);
    }).catch((err) => {
      reject(err);
    })
  });
}

module.exports = {
  spotify,
  getAuthUrl,
  getTokenFromCode,
  reauth,
  getCurrentlyPlayingMusic,
}
