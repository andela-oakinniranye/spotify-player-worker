const events = require('events');
const EventEmitter = events.EventEmitter;

const spotifyHelper = require('../helpers/spotify_helper');
const models = require('../models').getModels();

const getUsersWithExpiredAccessTokens = () => {
  return models.User.findAll({
    where: {
      expiryTime: {
        lte: new Date(),
      }
    }
  });
};

class UpdateAccessTokenWorker extends EventEmitter {
  constructor() {
    super();
    this.addListeners()
  }

  perform() {
    return getUsersWithExpiredAccessTokens().then((users) => {
      users.map((user) => {
        this.emit('reauthenticateUser', user);
      });
    })
  }

  coordinateReauthentication(user) {
    const { spotifyId, refreshToken } = user.dataValues;
    return spotifyHelper.reauth(spotifyId, refreshToken).then((updatedData) => {
      this.emit('updatedUserData', user, updatedData)
    });
  }

  handleUpdatedUserData(user, updatedData) {
    const { spotifyId } = updatedData;
    return user.update(updatedData).then((user) => {
      this.emit('updatedUser', user);
    });
  }

  handleUpdatedUserNotification(user) {
    console.log('Updated the records for user: ', user.dataValues.spotifyId);
  }

  addListeners() {
    this.on('reauthenticateUser', this.coordinateReauthentication);
    this.on('updatedUserData', this.handleUpdatedUserData);
    this.on('updatedUser', this.handleUpdatedUserNotification);
  }
}


// const eventEmitter = new events.EventEmitter();

// const coordinateReauthentication = (user) => {
//   const { spotifyId, refreshToken } = user.dataValues;
//   spotifyHelper.reauth(spotifyId, refreshToken).then((updatedData) => {
//     eventEmitter.emit('updatedUserData', user, updatedData)
//   });
// }
//
// const handleUpdatedUserData = (user, updatedData) => {
//   const { spotifyId } = updatedData;
//   return user.update(updatedData).then((user) => {
//     eventEmitter.emit('updatedUser', user);
//   });
// }
//
// const handleUpdatedUserNotification = (user) => {
//   console.log('Updated the records for user: ', user.dataValues.spotifyId);
// }
//
// const reauthenticate = () => {
//   getUsersWithExpiredAccessTokens().then((users) => {
//     users.map((user) => {
//       eventEmitter.emit('reauthenticateUser', user);
//     });
//   })
// }
// eventEmitter.on('reauthenticateUser', coordinateReauthentication);
// eventEmitter.on('updatedUserData', handleUpdatedUserData);
// eventEmitter.on('updatedUser', handleUpdatedUserNotification);

module.exports = UpdateAccessTokenWorker


// models.User.findOne({where: { spotifyId }}).then((user) => {
//   user.update(updatedData);
// })

// const reauthenticate = (expiredTokens) => {
//   return new Promise((resolve, reject) => {
//     getUsersWithExpiredAccessTokens().then((users) => {
//       const userReauthPromise = users.map((user) => {
//         const { spotifyId, refreshToken } = user.dataValues;
//         return new Promise((resolve, reject) => {
//           spotifyHelper.reauth(spotifyId, refreshToken).then((updatedData) => {
//             user.update(updatedData).then(resolve).catch(reject);
//           });
//         });
//         // user.dataValues
//       });
//
//       Promise.all(userReauthPromise).then(resolve).catch(reject);
//     });
//   })
// }
