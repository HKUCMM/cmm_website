var mysql = require('mysql2');

var db = mysql.createConnection({
    host:'cmm-website-db.czr2qjvs9lj9.ap-southeast-1.rds.amazonaws.com',
    user:'admin',
    password:'234516qwe',
    database:'cmm_website_db'
});

db.connect((err) => {
    if (err) {
      console.error('Error connecting to MySQL:', err);
      return;
    }
  
    console.log('Connected to MySQL database');
  });

  module.exports = { db };