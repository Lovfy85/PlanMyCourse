//Express is used in order to refer to that of using the routes in which to make to refer to endpoints used. 
const express = require('express');

//These are to refer to the nodejs files in that of 'routes' folder to which gets that of the endpoints in those nodejs files.
const coursesRoutes = require('./routes/courses');
const prerequisitesRoutes = require('./routes/prerequisites');
const userRoutes = require('./routes/users');
const coursesAddedRoutes = require('./routes/coursesadded');
const authRoutes = require('./routes/auth');
//This is used to make sure that of there can be a connection of the server.js with that of the frontend overall. 
const cors = require('cors');

//These refer to that of the tables made that are for the courses added (the planner) and that of the users (which they will be implemented in the 
// the project soon).
const { createCoursesAddedTable } = require('./models/coursesAdded');
const { createUsersTable } = require('./models/Users');

const app = express();

//This is to apply that of a connection of server.js with that of the frontend overall. 
app.use(cors());

//Turns that of http requests into that of JSON data to be sent back.
app.use(express.json());

//These endpoints are used to refer that of other endpoints that are from that of their respective nodejs files. 
app.use('/courses', coursesRoutes);
app.use('/prerequisites', prerequisitesRoutes);
app.use('/users', userRoutes);
app.use('/coursesadded', coursesAddedRoutes);
app.use('/auth', authRoutes);

//Calls that of the tables that were made in 'models' folder, which are the tables of CoursesAdded Table and Users Table. 
createCoursesAddedTable()
createUsersTable()

//This is to send that of the message to the terminal (which is towards that of the container that runs port 3001) to say that the server is up and running. 
app.listen(3001, () => {
    console.log("Server is running on port 3001");
});