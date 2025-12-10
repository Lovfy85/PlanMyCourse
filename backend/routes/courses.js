const express = require('express');
const connectMade = require('../config.js');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware.js');

// GET
// Get all courses
router.get('/', (req, res) => {
    try{
        const limit = parseInt(req.query.limit) || 20;
        const offset = parseInt(req.query.offset) || 0;
        connectMade.query('SELECT * FROM Courses LIMIT ?, ?', [offset, limit], (err, results) => {
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

// GET
// Get a course by name, subject or level
router.get('/search', (req,res) => {
    const searchTerm = req.query.term;
    const limit = parseInt(req.query.limit) || 20;
    const offset = parseInt(req.query.offset) || 0;
    if (!searchTerm) {
        res.status(400).json({error: "Search term is required"})
        return
    }

    const isNumber = !isNaN(Number(searchTerm));
    let query = '';
    let params = [];

    if (isNumber) {
        // search by level
        query = `SELECT * FROM Courses WHERE FLOOR(number / 100) * 100 = ? LIMIT ?, ?`;
        params = [Number(searchTerm), offset, limit];
    } else {
        // search by subject or class_name or title
        query = `SELECT * FROM Courses WHERE 
        class_name LIKE ? OR 
        subject LIKE ? OR
        title LIKE ?
        LIMIT ?, 
        ?`;
        params = [`%${searchTerm}%`, `%${searchTerm}`, `%${searchTerm}%`, offset, limit];
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

// GET
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

// GET
// Get by courseId
router.get('/id/:id', (req,res) => {
    connectMade.query(`SELECT * FROM Courses WHERE courseId = ?`, [req.params.id], (err, results) => {
        if(err){
            console.error('There has been an error getting the course from the courses table.');
            res.status(500).send('Seems to be that of course to be selected is not at all being seen in the courses table.');
            return;
        }
        res.json(results);
    });
});

// GET
//Get courses in that of an alphabetical order by that of their class name.
router.get('/sort/alphabetical', (req, res) => {
    const limit = parseInt(req.query.limit) || 20;
    const offset = parseInt(req.query.offset) || 0;
    connectMade.query(`SELECT * FROM Courses ORDER BY class_name ASC LIMIT ?, ?`, [offset, limit], (err, results) => {
        if(err){
            console.error('There has been an error getting that of the courses for the course catalogue through that alphabetical.');
            res.status(500).send('Seems to be that of courses to be sorted through alphabetical order cannot be done.');
            return;
        }
        res.json(results);
    });
});

// GET
//Get courses in that of an alphabetical order by that of their class name.
router.get('/sort/number', (req, res) => {
    const limit = parseInt(req.query.limit) || 20;
    const offset = parseInt(req.query.offset) || 0;
    connectMade.query(`SELECT * FROM Courses ORDER BY number ASC LIMIT ?, ?`, [offset, limit], (err, results) => {
        if(err){
            console.error('There has been an error getting that of the courses for the course catalogue through that of course number.');
            res.status(500).send('Seems to be that of courses to be sorted through course number order cannot be done.');
            return;
        }
        res.json(results);
    });
});

// GET
//Get courses in which it sorts the catalogue in alphabetical order but have of the courses that were added in the planner be displayed first and the 
// courses that are not added to the planner be displayed before. 
router.get('/sort/addedtoplanner', verifyToken, (req, res) => {
    const limit = parseInt(req.query.limit) || 20;
    const offset = parseInt(req.query.offset) || 0;
    const userId = req.user.userId;

    if(!userId){
        return res.status(400).send('You must be a logged in user to sort that of the course catalogue based on the courses added to your planner.')
    }

    const query = `
        SELECT 
            c.*,
            IF(ca.taken IS NULL, 0, 1) AS added
        FROM Courses c
        LEFT JOIN CoursesAdded ca 
            ON c.courseId = ca.courseId AND ca.userId = ?
        ORDER BY taken DESC, class_name ASC
        LIMIT ?, ?
    `;

    connectMade.query(query, [userId, offset, limit], (err, results) => {
        if(err){
            console.error('There has been an error getting that of the courses for the course catalogue that are seperated whether it is taken or not.');
            res.status(500).send('Seems to be that of courses to be sorted by the first half being taken courses and second half being untaken courses.');
            return;
        }
        res.json(results);
    });
})

module.exports = router;