const express = require('express');
const connectMade = require('../config.js');
const router = express.Router();

// GET
// Gets all users.
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

// Get a user by their Id
router.get('/:userId', (req, res) => {
    const userId = req.params.userId;

    try{
        connectMade.query('SELECT * FROM Users WHERE userId = ?', [userId], (err, results) => {
            if(err){
                console.error('There has been an error getting a user from the courses table.');
                res.status(500).send('Cannot get that of a selected user from their userId from the Users table.');
                return;
            }
            res.json(results);
        });
    }
    catch{
        console.error('User may not exist inside that of Users table.');
        res.status(500).send('User is not gotten from the users table.');
    }
});

// DELETE
// Delete a user by their ID
router.delete('/:userId', (req, res) => {
    const userId = req.params.userId;
    const query = `DELETE FROM Users WHERE userId = ?`;
    connectMade.query(query,[userId], (err, result) =>{
        if(err){
            res.send("Did not delete user from Users table from their userId");
            return;
        }
        res.json({message: "User that was in Users table is now gone."});
    });
});

module.exports = router;

