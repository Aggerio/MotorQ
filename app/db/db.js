const mysql = require('mysql2/promise');

// Create a pool of connections to improve performance
const pool = mysql.createPool({
  host: 'localhost', // Update this if your database is hosted elsewhere
  user: 'dev',
  password: 'dev',
  database: 'MotorQ', // Replace with your database name
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = pool;