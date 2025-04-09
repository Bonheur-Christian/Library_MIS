require('dotenv').config();
const mysql = require("mysql2/promise")

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database:process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0

})

pool.getConnection()

    .then((connection) => {
        console.log("Connected to database");
        connection.release();

    }).catch((err) => {
        console.log("failed to connect to db ", err);

    })

module.exports = pool;
