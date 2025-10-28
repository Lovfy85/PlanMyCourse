const connectMade =  require("../config");

const createCoursesAddedTable = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS CoursesAdded (
        id INT AUTO_INCREMENT PRIMARY KEY,
        courseId INT,
        taken BOOLEAN DEFAULT FALSE,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (courseId) REFERENCES Courses(courseId)
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

module.exports = {
    createCoursesAddedTable
}