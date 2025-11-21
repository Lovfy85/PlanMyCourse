const express = require('express');
const connectMade = require('../config.js');
const bcrypt = require('bcrypt');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { verifyToken } = require('../middleware/authMiddleware.js');
require('dotenv').config();

// SIGNUP
router.post('/signup', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check required fields first
    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required." });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if username already exists
    connectMade.query('SELECT * FROM Users WHERE username = ?',[username], (err, existingUsers) => {
      if(err){
          res.status(500).send('Error checking existing users.');
          return;
      }
      if (existingUsers.length > 0) {
        return res.status(400).json({ error: "Username already exists." });
      }
      // Insert new user
      connectMade.query('INSERT INTO Users (username, password) VALUES (?, ?)',[username, hashedPassword], (err, result) => {
        if(err){
            res.status(500).send('Error inserting new user.');
            return;
        }
        res.status(201).json({ message: "User created successfully", username: username });
     });

    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});


// LOGIN
router.post('/login', (req, res) => {

    //In order for that of the registered user to login that of the website, they need to input their username and their password. Make sure they do.
    const {username, password} = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: "Username and password is required" });
    }
    
    // Check if user exists
    connectMade.query(`SELECT * FROM Users WHERE username = ?`, [username], async (err, results) => {

        // Check for server error
        if(err){
            return res.status(500).json({error: "Server error"});
        }

        //If that of the username cannot be found, then that means that the username does not exist.
        if(results.length === 0){
            return res.status(401).json({error: "Invalid username or password."});
        }

        //This is to find that of the username and that of the username's password. If the password for that username is not found, that means that the password given is invalid for that username.
        const userFound = results[0];
        const passwordFound = await bcrypt.compare(password, userFound.password);
        if (!passwordFound) {
            return res.status(401).json({ error: "Invalid username or password." });
        }

        //If found, make sure that the user can login into the website freely, which that of the token given to the user for the website expires in 30 years.
        const tokenGiven = jwt.sign(
            {userId: userFound.userId, username: userFound.username},
            process.env.JWT_SECRET,
            {expiresIn: "1d"}
        );
        res.cookie("jwt", tokenGiven, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 // 1 day
        });
        res.json({message: "Registered User is now logged in the website.", tokenGiven});
    });
});

// LOGOUT
router.get('/logout', (req, res) => {

    // Delete the JWT cookie to log out the user
    res.clearCookie('jwt');
    res.json({message: "Log out successful."});
});

// Check current user
router.get('/me', verifyToken,(req, res) => {
    res.json({ userId: req.user.userId, username: req.user.username });
});  

module.exports = router;

