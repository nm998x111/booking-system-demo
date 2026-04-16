require("dotenv").config();
const mysql = require("mysql");

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  multipleStatements: true,
});

/* const connectDB = async () => {
    try {
          db.connect(function () {
            console.log("Succesfully connected to the MySQL database!");
          });
    } catch (err) {
        console.error(err);
    }
} */

/*const checkForConnection = () => {
    con.ping(function(err) {
        if (err) checkForConnection();
        return true;
    })
}*/

module.exports = { /*connectDB,*/ db /*, checkForConnection*/ };
