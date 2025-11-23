const connectMade = require("../config");

//Starts up that of the reviews table while the other tables are starting up and that of the server as well.
const createReviewsTable = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS Reviews (
        reviewId INT AUTO_INCREMENT PRIMARY KEY,
        post TEXT NOT NULL,
        rating TINYINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
        userId INT,
        courseId INT,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES Users(userId),
        FOREIGN KEY (courseId) REFERENCES Courses(courseId)
        )
    `;

    try{
        await connectMade.execute(query);
        console.log("Reviews table created");
    }
    catch(err){
        console.error("There is an error in making in Reviews Table.", err);
    }
}

module.exports = {
    createReviewsTable
}