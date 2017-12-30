const redis = require('redis');
const { REDIS_URL } = require('../constants/VARIABLES');


const Redis = () => {
  return redis.createClient({
    url: REDIS_URL,
    retry_strategy: (options) => {
      console.log('Retrying .....', options.attempt)
      if (options.attempt > 5) return false;
      return Math.min(options.attempt * 100, 3000);
    },
  });
}

module.exports = {
  Redis,
}
