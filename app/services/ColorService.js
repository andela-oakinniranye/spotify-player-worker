const request = require('request');

const { BASE_COLOR_URL = 'http://localhost:4001' } = require('../config/constants/VARIABLES');
const  COLOR_ENDPOINT = 'colors/get-color';

const getColorUrl = () => {
  return `${BASE_COLOR_URL}/${COLOR_ENDPOINT}`;
}

class ColorService {
  static getColor(user, payload) {
    const colorUrl = getColorUrl();
    // oatload album art
    const imageUrl = payload;
    return new Promise((resolve, reject) => {
      return request.get(colorUrl, {
        qs: {
          imageUrl
         }
       },
       (err, response, body) => {
         if (err) return reject(err);
         return resolve(response, body);
       }
     );

    })
  }
}

module.exports = ColorService;
