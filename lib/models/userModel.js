const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('User', {
  nomeCompleto: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  usuario: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  senha: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = User;