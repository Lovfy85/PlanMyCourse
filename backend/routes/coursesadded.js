const express = require('express');
const connectMade = require('../config.js');
const router = express.Router();

router.get('/added', (req, res) => {
    try{
        connectMade.query('SELECT * FROM Coursesadded', (err, results) => {
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

module.exports = router;