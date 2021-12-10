const mysql = require("mysql");
const dbConfig = require("../config/db.config.js");

// Create a connection to the database
const connection = mysql.createConnection({
  host: dbConfig.HOST,
  user: dbConfig.USER,
  password: dbConfig.PASSWORD,
  database: dbConfig.DB
});
connection.connect(); 

// open the MySQL connection
connection.query("SELECT 1 + 1 AS solution", function (error, rows, fields) {
  if (error) throw error;
  console.log("Successfully connected to the database.");
});

module.exports = connection;