const express = require('express');
const connectMade = require('../config.js');
const router = express.Router();

//Will use cookies soon based on that of the dependency installed.

router.get('/', (req, res) => {
    try{
        connectMade.query('SELECT * FROM Users', (err, results) => {
        if(err){
            console.error('There has been a query error.', err);
            res.status(500).send('There has been an error with getting the users table.');
            return;
        }
        res.json(results);
    });
    }
    catch{
        console.error('There seems to be no way of getting the users from the users table overall.');
    }
});

module.exports = router;

