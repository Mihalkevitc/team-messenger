const { DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const Chat = sequelize.define('Chat', {
    name: {
      type: DataTypes.STRING,
    },
    isTeamChat: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  });

  return Chat;
};