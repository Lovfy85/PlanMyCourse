const express = require('express');
const connectMade = require('../config.js');
const router = express.Router();

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

//To get that of the a course's description just by its name alone.
router.get('/:class_name', (req,res) => {

    const class_name = req.params.class_name;

    try{
        connectMade.query('SELECT * FROM Courses WHERE class_name = ?', [class_name], (err, results) => {
        if(err){
            console.error('There has been an error getting the course from the courses table.');
            res.status(500).send('Seems to be that of course to be selected is not at all being seen in the courses table.');
            return;
        }
        res.json(results);
    });
    }
    catch{
        console.error('That course may not exist according to the course table.');
        res.status(500).send('That course name cannot be seen at all in the course table.');
    }
});

module.exports = router;