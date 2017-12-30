'use strict';
const userDbConfig = require('../models/User/config');
const { appendTimestamps } = require('./migration_config');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('users', appendTimestamps(userDbConfig));
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('users');
  }
};
