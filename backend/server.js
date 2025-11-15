// backend/server.js
const app = require('./app');

// Import table creation functions
const { createCoursesAddedTable } = require('./models/coursesAdded');
const { createUsersTable } = require('./models/Users');
const { createReviewsTable } = require('./models/reviewsMade');

// Create tables on server startup
createCoursesAddedTable();
createUsersTable();
createReviewsTable();

app.listen(3001, () => {
    console.log("Server is running on port 3001");
});