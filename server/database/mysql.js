const mysql = require("mysql2/promise");
require("dotenv").config();

const connectionDetails = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT || 3306,
  connectionLimit: 10, // Adjust this value based on your needs
};

console.log('Connection details:', {
  host: connectionDetails.host,
  user: connectionDetails.user,
  database: connectionDetails.database,
  port: connectionDetails.port
  // Don't log the password
});

const pool = mysql.createPool(connectionDetails);

async function getConnection() {
  try {
    const connection = await pool.getConnection();
    console.log("Got connection from pool");
    return connection;
  } catch (err) {
    console.error("Error getting connection from pool:", err);
    throw err;
  }
}

// Test the connection when the module is loaded
pool.getConnection()
  .then(connection => {
    console.log("Successfully connected to MySQL database");
    connection.release();
  })
  .catch(err => {
    console.error("Error connecting to MySQL database:", err);
  });

module.exports = { getConnection };