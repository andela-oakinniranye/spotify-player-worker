const Sequelize = require('sequelize');

const config = {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
  spotifyId: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  refreshToken: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  accessToken: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  expiryTime: {
    type: Sequelize.DATE,
    allowNull: false,
  }
};

module.exports = config
