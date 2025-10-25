const express = require('express');

const coursesRoutes = require('./routes/courses');
const userRoutes = require('./routes/users');

const app = express();
app.use(express.json());

app.use('/courses', coursesRoutes);
app.use('/users', userRoutes);

app.listen(3001, () => {
    console.log("Server is running on port 3001")
});