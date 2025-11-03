//Uses that of MySQL2 to set up that of the database.
const mysql = require('mysql2');

//This to set up that of the environment variables that are referred to the .env file in backend to be used in MySQL.
const dotenv = require('dotenv');
dotenv.config();

//This creates that of the MYSQL database connection which intializes that of the environment variables.
const connectMade = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost', 
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || 'ar.rubia',
    database: process.env.DB_NAME || 'coursesdb',
    port: process.env.DB_PORT
});

//It is a function to run whether or not if it is getting connected or not to the database.
function connectStuff(){
    connectMade.connect((err) => {
        if (err){
            console.error('The database could not be connected to.');

            //Runs that of the function after 5 seconds to make sure that the database is not really working.
            setTimeout(connectStuff, 5000);
        }
        console.log('Connected to database.');
    });
}

//Calls that of the function.
connectStuff();

//Makes sure that of the config.js file runs when server is going to run.
module.exports = connectMade;
