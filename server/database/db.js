const mysql = require("mysql2");

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_PASSWORD
});

// db.connect((err) => {
//     if (err) {
//         console.err("Failed to connect to database.");
//         return;
//     }

//     console.log("Successfully connected to database.");
// })

module.exports = db;