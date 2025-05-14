const { DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define('Message', {
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    fileUrl: {
      type: DataTypes.STRING,
    },
  });

  return Message;
};