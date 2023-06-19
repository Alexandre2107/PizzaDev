const sequelize = require("../config/db");
const {DataTypes} = require('sequelize');

const Message = sequelize.define('Message', {
    titulo: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    mensagem: {
       type: DataTypes.TEXT,
       allowNull: false,
    },
    email: {
       type: DataTypes.STRING,
       allowNull: false,
    }
})

module.exports = Message;