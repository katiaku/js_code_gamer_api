const mysql = require('mysql2');

const pool = mysql.createPool({
    // host: 'db-js-code-gamer.c9dnvksxuzcm.eu-north-1.rds.amazonaws.com',
    host: 'localhost',
    user: 'admin',
    password: 'KatIndMar',
    database: 'db-js-code-gamer',
    waitForConnections: true,
    connectionLimit: 10,
    maxIdle: 10,
    idleTimeout: 60000,
    queueLimit: 0
}).promise();

console.log('Conexión con la BBDD creada');

module.exports = { pool };
