const request = require('request');

const { BASE_NOTIFICATION_URL = 'http://localhost:4002' } = require('../config/constants/VARIABLES');
const  NOTIFICATION_ENDPOINT = 'notifications/publish';

const getNotificationURL = () => {
  return `${BASE_NOTIFICATION_URL}/${NOTIFICATION_ENDPOINT}`;
}

class WebhookService {
  static pushNotification(data) {
    const notificationURL = getNotificationURL();
    return new Promise((resolve, reject) => {
      return request.post(notificationURL, {
        form: data
       },
       (err, response, body) => {
         if (err) return reject(err);
         return resolve(response.body);
       }
     );

    })
  }
}

module.exports = WebhookService;
