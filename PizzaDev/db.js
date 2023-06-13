
const mysql = require('mysql2/promise');

async function getConnection() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'Alex210703',
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