const express = require('express');
const connectMade = require('../config.js');
const router = express.Router();

router.get('/', (req, res) => {
    try{
        connectMade.query('SELECT * FROM CoursesAdded', (err, results) => {
        if(err){
            console.error('There has been a query error.', err);
            res.status(500).send('There has been an error with getting the coursesadded table.');
            return;
        }
        res.json(results);
    });
    }
    catch{
        console.error('There seems to be no way of getting the courses that were added from the coursesadded table overall.');
    }
});

router.post('/', (req, res) => {
    const { courseId } = req.body;
    const query = `INSERT INTO CoursesAdded (courseId) Values (?)`;
    connectMade.query(query, [courseId], (err, result) => {
        if(err){
            res.send("Did not insert properly to CoursesAdded table")
            return;
        }
        res.json(req.body)
    })

})

module.exports = router;