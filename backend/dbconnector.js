require('dotenv').config();
const mariadb = require('mariadb')

const pool = mariadb.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectionLimit: process.env.DB_CON_LIMIT
});

async function query(sql, params){
    let connection;
    try {
        connection = await pool.getConnection();
        const res = await connection.query(sql, params);
        return res;
    } catch (error) {
        throw error;
    } finally {
        if (connection) connection.release();
    }
}

module.exports = { query };