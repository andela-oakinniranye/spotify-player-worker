const redisConfig = require('../config/components/redis');

const redis = redisConfig.Redis();

const validKey = (key) => {
  if (!redis.connected) {
    return false;
  }

  const keyIsString = (typeof key === 'string' || key instanceof String);
  const keyIsNotEmpty = key !== '';

  if (keyIsString && keyIsNotEmpty) return true;

  return false;
};

const setKey = (key, itemId) => {
  return new Promise((resolve, reject) => {
    if (validKey(key)) {
      redis.set(key, itemId);
      return resolve(true);
    }

    return reject(new Error('SET Invalid key being attempted'));
  })
};

const getKey = (key) => {
  return new Promise((resolve, reject) => {

    if (validKey(key)) {
      return redis.get(key, (err, itemId) => {
        if (err) return reject(err);

        return resolve(itemId);
      });
    }
    return reject(new Error('GET Invalid key being attempted'));
  })
}

module.exports = {
  setKey,
  getKey,
}
