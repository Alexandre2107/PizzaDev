
const mysql = require('mysql2/promise');
require('dotenv/config');

async function getConnection() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: 'pizzadev'
    });
    return connection;
}

async function query(sql = '', values = [])
{
    const conn = await getConnection();
    const result = await conn.query(sql, values);
    conn.end();
    return result[0];
}

// CommonJS
module.exports = { query }

const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('pizzadev', process.env.DB_USER, process.env.DB_PASSWORD, {
  host: 'localhost',
  dialect: 'mysql',
});

module.exports = sequelize;