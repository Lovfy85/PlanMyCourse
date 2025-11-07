const express = require('express');
const connectMade = require('../config.js');
const router = express.Router();

//To get all courses
router.get('/:string', (req, res) => {
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

//To get that of the a course's by name via parameter
router.get('/:name', (req,res) => {

    connectMade.query(`SELECT * FROM Courses WHERE class_name = ?`, [req.params.name], (err, results) => {
        if(err){
            console.error('There has been an error getting the course from the courses table.');
            res.status(500).send('Seems to be that of course to be selected is not at all being seen in the courses table.');
            return;
        }
        res.json(results);
    });
});

//To get that of the a course's by name, subject or level
router.get('/search', (req,res) => {

    const searchTerm = req.query.term;
    if (!searchTerm) {
        res.status(400).json({error: "Search term is required"})
        return
    }

    var query = `SELECT * FROM Courses WHERE 
                    class_name LIKE ? 
                  OR subject LIKE ?
                  OR courseId LIKE ?
                  OR FLOOR(number / 100) * 100 = ?
                  `;
    
    var searchValue = `%${searchTerm}`;
    if (Number(searchTerm)) {
        searchValue = `${Number(searchTerm)}`;
    }

    connectMade.query(query, [searchValue, searchValue, searchValue, searchValue], (err, results) => {
        if(err){
            console.error('There has been an error getting the course from the courses table.');
            res.status(500).send('Seems to be that of course to be selected is not at all being seen in the courses table.');
            return;
        }
        res.json(results);
    });
});

<<<<<<< HEAD
=======
//To get that of the a course's by name via parameter
router.get('/:name', (req,res) => {
    connectMade.query(`SELECT * FROM Courses WHERE class_name = ?`, [req.params.name], (err, results) => {
        if(err){
            console.error('There has been an error getting the course from the courses table.');
            res.status(500).send('Seems to be that of course to be selected is not at all being seen in the courses table.');
            return;
        }
        res.json(results);
    });
});


>>>>>>> f730b1251bb9de6f197d76639a5d10406603be00
module.exports = router;