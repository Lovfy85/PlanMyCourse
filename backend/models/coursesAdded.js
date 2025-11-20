//Refers towards that of the connection of the main database in MySQL. 
const connectMade =  require("../config");

//With the usage of async, async is used in order for the table to be starting up while the server is starting up. Does not stop the server
// from running when the table has to run first.
const createCoursesAddedTable = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS CoursesAdded (
        id INT AUTO_INCREMENT PRIMARY KEY,
        courseId INT,
        taken BOOLEAN DEFAULT FALSE,
        userId INT,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (courseId) REFERENCES Courses(courseId) ON DELETE CASCADE,
        FOREIGN KEY (userId) REFERENCES Users(userId) ON DELETE CASCADE
        )
    `;
    try {
        await connectMade.execute(query)
        console.log("CoursesAdded table created")
    }
    catch (err) {
        console.error("Error in creating CoursesAdded table", err)
    }
}


//Makes sure that this table is initialized can be referred to towards that of the server.js.
module.exports = {
    createCoursesAddedTable
}