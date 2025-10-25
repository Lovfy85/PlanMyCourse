const express = require('express');
const {connectMade} = require('../config.js')
const router = express.Router();

router.get('/getcourses', (req, res) => {
    try{
        connectMade.query('SELECT * FROM Courses', (err, results) => {
        if(err){
            console.error('There has been a query error.', err);
            res.status(500).send('There has been an error with getting the course database.');
            return;
        }
        res.json(results);
    });
    }
    catch{
        console.error('There seems to be no way of getting the users from the courses database overall.');
    }
});

module.exports = router;