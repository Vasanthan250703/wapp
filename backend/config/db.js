const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'workerdb',
  waitForConnections: true,
  connectionLimit: 10,
});

module.exports = pool.promise();
