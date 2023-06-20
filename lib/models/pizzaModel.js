const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Pizza = sequelize.define('Pizza', {
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  descricao: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  precoBrotinho: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  precoMedia: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  precoGrande: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  foto:{
    type: DataTypes.STRING,
    allowNull: false,
  }
});

module.exports = Pizza;