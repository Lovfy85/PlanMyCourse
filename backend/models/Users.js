//Will make that of the Users Table through here with MYSQL things.
const connectMade = require("../config");

const createUsersTable = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS Users (
        userID INT AUTO_INCREMENT PRIMARY KEY,
        userName VARCHAR(60),
        userPassword VARCHAR(60)
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

