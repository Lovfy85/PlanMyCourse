// app.js
const express = require('express');

// route imports
const coursesRoutes = require('./routes/courses');
const prerequisitesRoutes = require('./routes/prerequisites');
const userRoutes = require('./routes/users');
const coursesAddedRoutes = require('./routes/coursesadded');
const authRoutes = require('./routes/auth');
const reviewsMadeRoutes = require('./routes/reviewsmade');

// middleware imports
const cors = require('cors');
const app = express();

// middleware
app.use(cors());
app.use(express.json());

// routes
app.use('/courses', coursesRoutes);
app.use('/prerequisites', prerequisitesRoutes);
app.use('/users', userRoutes);
app.use('/coursesadded', coursesAddedRoutes);
app.use('/reviewsmade', reviewsMadeRoutes);
app.use('/auth', authRoutes);

module.exports = app;