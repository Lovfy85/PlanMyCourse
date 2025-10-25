const express = require('express');
const {connectMade2} = require('../config.js')
const router = express.Router();

//Will use cookies soon based on that of the dependency installed.

router.get('/getusers', (req, res) => {
    try{
        connectMade2.query('SELECT * FROM Users', (err, results) => {
        if(err){
            console.error('There has been a query error.', err);
            res.status(500).send('There has been an error with getting the users database.');
            return;
        }
        res.json(results);
    });
    }
    catch{
        console.error('There seems to be no way of getting the users from the users database overall.');
    }
});

module.exports = router;

