const events = require('events');
const EventEmitter = events.EventEmitter;

const spotifyHelper = require('../helpers/spotify_helper');
const redisHelper = require('../helpers/redis_helper');

const WebhookService = require('../services/WebhookService');
const models = require('../models').getModels();

const getUsersWithValidTokens = () => {
  return models.User.findAll({
    where: {
      expiryTime: {
        gte: new Date(),
      }
    }
  });
}

const getCurrentlyPlayingId = (spotifyId) => {
  return `currentlyPlaying:${spotifyId}`;
}

const isEmpty = (obj) => {
  return Object.keys(obj).length === 0 && obj.constructor === Object
}

class Notification {
  constructor(user, payload) {
    this.user = user;
    this.payload = payload;
  }

  extractRelevantData(user) {
    const { id, spotifyId } = user;
    return {
      id,
      spotifyId,
    };
  }

  get data() {
    const {
      user,
      payload: {
        body: payload
      }
    } = this;
    const userData = this.extractRelevantData(user);
    const event = 'CurrentlyPlaying:changed';

    return {
      event,
      user: userData,
      payload,
    }
  }

  notifyWebhookService() {
    const { data } = this;
    WebhookService.pushNotification(data).then((body) => {
      console.log('Successfully triggered Notification for: ', body);
    }).catch(console.log);
  }
}

class GetCurrentlyPlayingSongWorker extends EventEmitter {
  constructor() {
    super();
    this.addListeners();
  }

  perform() {
    return getUsersWithValidTokens().then((users) => {
      users.map((user) => {
        this.emit('fetchPlaybackForUser', user);
      })
    });
  }

  handleFetchUserPlayer(user) {
    const { spotifyId, accessToken } = user.dataValues;
    return spotifyHelper.getCurrentlyPlayingMusic(spotifyId, accessToken).then((currentlyPlaying) => {
      if ( isEmpty(currentlyPlaying.body) ) return false;

      this.emit('fetchedCurrentlyPlayingItem', user, currentlyPlaying)
    });
  }

  handleFetchedCurrentPlayer(user, currentlyPlaying) {
    const { spotifyId } = user.dataValues;
    const { album, id } = currentlyPlaying.body.item;
    const currentlyPlayingKey = getCurrentlyPlayingId(spotifyId);
    return redisHelper.getKey(currentlyPlayingKey).then((lastPlayedId) => {
      if ( lastPlayedId !== id ) {
        redisHelper.setKey(currentlyPlayingKey, id);
        this.emit('triggerUserPlayerChange', user, currentlyPlaying)
      };
    });
  }

  triggerCurrentlyPlayingNotification(user, currentlyPlaying) {
    const notification = new Notification(user, currentlyPlaying);
    notification.notifyWebhookService();
  }

  addListeners() {
    this.on('fetchPlaybackForUser', this.handleFetchUserPlayer);
    this.on('fetchedCurrentlyPlayingItem', this.handleFetchedCurrentPlayer);
    this.on('triggerUserPlayerChange', this.triggerCurrentlyPlayingNotification);
  }
}

module.exports = GetCurrentlyPlayingSongWorker;
