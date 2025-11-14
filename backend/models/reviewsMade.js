const connectMade = require("../config");

const createReviewsTable = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS Reviews (
        reviewId INT AUTO_INCREMENT PRIMARY KEY,
        post VARCHAR(255),
        userId INT,
        FOREIGN KEY (userId) REFERENCES Users(userId)
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