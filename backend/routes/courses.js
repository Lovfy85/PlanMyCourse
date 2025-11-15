const express = require('express');
const connectMade = require('../config.js');
const router = express.Router();

// GET
// Get all courses
router.get('/', (req, res) => {
    try{
        connectMade.query('SELECT * FROM Courses', (err, results) => {
        if(err){
            console.error('There has been a query error.', err);
            res.status(500).send('There has been an error with getting the courses table.');
            return;
        }
        res.json(results);
    });
    }
    catch{
        console.error('There seems to be no way of getting the courses from the courses table overall.');
        res.status(500).send('Courses table seems to not be gotten at all.');
    }
});

// Get a course by name, subject or level
router.get('/search', (req,res) => {
    const searchTerm = req.query.term;
    if (!searchTerm) {
        res.status(400).json({error: "Search term is required"})
        return
    }

    const isNumber = !isNaN(Number(searchTerm));
    let query = '';
    let params = [];

    if (isNumber) {
        // search by level
        query = `SELECT * FROM Courses WHERE FLOOR(number / 100) * 100 = ?`;
        params = [Number(searchTerm)];
    } else {
        // search by subject or class_name
        query = `SELECT * FROM Courses WHERE class_name LIKE ? OR subject = ?`;
        params = [`${searchTerm}%`, searchTerm];
    }

    connectMade.query(query, params, (err, results) => {
        if(err){
            console.error('Error getting courses', err);
            res.status(500).send('Error fetching courses.');
            return;
        }
        res.json(results);
    });
});

// Get by class_name
router.get('/name/:name', (req,res) => {
    connectMade.query(`SELECT * FROM Courses WHERE class_name = ?`, [req.params.name], (err, results) => {
        if(err){
            console.error('There has been an error getting the course from the courses table.');
            res.status(500).send('Seems to be that of course to be selected is not at all being seen in the courses table.');
            return;
        }
        res.json(results);
    });
});

// Get by courseId
router.get('/id/:id', (req,res) => {
    connectMade.query(`SELECT * FROM Courses WHERE courseId = ?`, [req.params.name], (err, results) => {
        if(err){
            console.error('There has been an error getting the course from the courses table.');
            res.status(500).send('Seems to be that of course to be selected is not at all being seen in the courses table.');
            return;
        }
        res.json(results);
    });
});

//Get courses in that of an alphabetical order by that of their class name.
router.get('/sort/alphabetical', (req, res) => {
    connectMade.query(`SELECT * FROM Courses ORDER BY class_name ASC`, (err, results) => {
        if(err){
            console.error('There has been an error getting that of the courses for the course catalogue through that alphabetical.');
            res.status(500).send('Seems to be that of courses to be sorted through alphabetical order cannot be done.');
            return;
        }
        res.json(results);
    });
});

//Get courses in that of an alphabetical order by that of their class name.
router.get('/sort/number', (req, res) => {
    connectMade.query(`SELECT * FROM Courses ORDER BY number ASC`, (err, results) => {
        if(err){
            console.error('There has been an error getting that of the courses for the course catalogue through that of course number.');
            res.status(500).send('Seems to be that of courses to be sorted through course number order cannot be done.');
            return;
        }
        res.json(results);
    });
});

//Get courses in which it sorts the catalogue in alphabetical order but have of the taken courses be displayed first and the untaken courses 
// to be displayed down below.
router.get('/sort/addedtoplanner', (req, res) => {
    const query = `
        SELECT 
            c.*,
            IF(ca.taken IS NULL, 0, 1) AS added
        FROM Courses c
        LEFT JOIN CoursesAdded ca ON c.courseId = ca.courseId
        ORDER BY taken DESC, class_name ASC
    `

    connectMade.query(query, (err, results) => {
        if(err){
            console.error('There has been an error getting that of the courses for the course catalogue that are seperated whether it is taken or not.');
            res.status(500).send('Seems to be that of courses to be sorted by the first half being taken courses and second half being untaken courses.');
            return;
        }
        res.json(results);
    });
})

module.exports = router;