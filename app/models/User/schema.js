/**
 * User Schema module
 */
const Sequelize = require('sequelize');
const config = require('./config');
const tableName = 'users';

module.exports = (sequelizeDB, modelName) => {
  const User = sequelizeDB.define(modelName, config, {
    tableName,
  });

  User.findAndUpdateOrCreate = (where, values) => {
    return User.findOne({ where })
                .then((record) => {
                  if ( record ) {
                    return record.update(values);
                  } else {
                    return User.create(values);
                  }
                });
  };

  return User;
};
