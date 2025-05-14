const { DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const Team = sequelize.define('Team', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    projectLink: {
      type: DataTypes.STRING,
    },
  });

  return Team;
};