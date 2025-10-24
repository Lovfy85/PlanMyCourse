const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

const connectMade = mysql.createConnection({
    host: process.env.DB_HOST, 
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

connectMade.connect((err) => {
    if (err){
        console.error('The courses database could not be connected to.');
    }
    console.log('Connected towards that of the courses database.');
});

module.exports = connectMade;