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

router.post('/', (req, res) => {
    const {userName, userPassword} = req.body;
    const query = `INSERT INTO Users (userName, userPassword) Values (?,?)`;
    connectMade.query(query, [userName, userPassword], (err, result) => {
        if(err){
            res.send("Did not insert that of a user successfully in Users table");
            return;
        }
        res.status(201).json({id: result.insertId, userName, userPassword});
    });
});

router.get('/:userID', (req, res) => {
    const userID = req.params.userID;

    try{
        connectMade.query('SELECT * FROM Users WHERE userID = ?', [userID], (err, results) => {
            if(err){
                console.error('There has been an error getting a user from the courses table.');
                res.status(500).send('Cannot get that of a selected user from their userID from the Users table.');
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

router.delete('/:userID', (req, res) => {
    const userID = req.params.userID;
    const query = `DELETE FROM Users WHERE userID = ?`;
    connectMade.query(query,[userID], (err, result) =>{
        if(err){
            res.send("Did not delete user from Users table from their userID");
            return;
        }
        res.json({message: "User that was in Users table is now gone."});
    });
});

module.exports = router;

