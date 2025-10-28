//Will make that of the Users Table through here with MYSQL things.
const connectMade = require("../config");

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

module.exports = {
    createUsersTable
}

