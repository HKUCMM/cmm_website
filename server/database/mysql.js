var mysql = require('mysql2');
<<<<<<< HEAD
require('dotenv').config();

var db = mysql.createConnection({
    host: process.env.DB_HOST,
    user:process.env.DB_USER,
    password:process.env.DB_PASSWORD,
    database:process.env.DB_DATABASE
=======
require("dotenv").config();

var db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
>>>>>>> a778d473f3b8fab34781a74a58930c24a4d3b3d5
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }  
  console.log('Connected to MySQL database');
});

<<<<<<< HEAD
  module.exports = { db };
=======
module.exports = { db };
>>>>>>> a778d473f3b8fab34781a74a58930c24a4d3b3d5
