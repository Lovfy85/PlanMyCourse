const express = require('express');
const connectMade = require('../config.js');
const router = express.Router();

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;  

router.post('/register', async (req, res) => {

    //Needs to have that of a username and password in order for that of the user to be a registered user in the website.
    const {username, password} = req.body;

    if(!username || !password){
        return res.status(400).json({message: "In order to register for a user for that of the website, you need to have a user"})
    }

    connectMade.query(`SELECT * FROM Users WHERE username = ?`, [username], async(err, results) => {
        if(err){
            console.error("There seems to be no existing username seen in the table.");
            return res.status(400).json({message: "There is an error within that of finding the user overall."});
        }

        if(results.length > 0){
            return res.status(400).json({message: "There seems to be a user that already has that name. Make another one."});
        }
    
        try{
            const hpass = await bcrypt.hash(password, 10);
        
            connectMade.query(`INSERT INTO Users (username, password) VALUES (?, ?)`, [username, hpass], (err,results) => {
                if(err){
                    console.error("Seems to be that of an error when registering that of a user.", err);
                    return res.status(400).json({message: "There seems to be an error making the user be registered."});
                }
                res.status(201).json({message: "Made a user successfully register overall"});
            });
        }
        catch (err){
            console.error("There seems to be an error when registering in the website based on a server malfunction.", err);
            res.status(500).json({message: "There just seems to be a server error overall."});
        }
    });
});

router.post('/login', (req, res) => {

    const {username, password} = req.body;
    
    connectMade.query(`SELECT * FROM Users WHERE username = ?`, [username], async (err, results) => {

        if(err){
            return res.status(500).json({message: "There seems to be an error in that of a server"});
        }

        if(results.length === 0){
            return res.status(401).json({message: "There seems to be an invalid match that of username and password."});
        }

        const userFound = results[0];
        const passwordFound = await bcrypt.compare(password, userFound.password);

        if(!passwordFound){
            return res.status(401).json({message: "The password seems to not be found by the user who is entering it."});
        }

        const tokenGiven = jwt.sign(
            {userId: userFound.userId, username: userFound.username},
            JWT_SECRET,
            {expiresIn: 946080000});
        res.json({message: "Registered User is now logged in the website.", tokenGiven});
    });
});

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

// // POST
// // Inserts a user into the Users table. 
// router.post('/', (req, res) => {
//     const {userId, username, password} = req.body;
//     const query = `INSERT INTO Users (username, password) Values (?,?)`;
//     connectMade.query(query, [username, password], (err, result) => {
//         if(err){
//             res.send("Did not insert that of a user successfully in Users table");
//             return;
//         }
//         res.status(201).json({userId, username, password});
//     });
// });

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

