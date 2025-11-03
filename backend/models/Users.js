//Refers towards that of the connection of the main database in MySQL. 
const connectMade = require("../config");

//Starts up that of the users table while the other tables are starting up and that of the server as well.
const createUsersTable = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS Users (
        userId INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255),
        password VARCHAR(255)
        )
    `;

    try{
        await connectMade.execute(query);
        console.log("Users table created");
    }
    catch (err){
        console.error("There is an error in making the Users table", err);
    }
}

//Makes sure that this table is initialized can be referred to towards that of the server.js.
module.exports = {
    createUsersTable
}

