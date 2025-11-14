const express = require('express');
const connectMade = require('../config.js');
const bcrypt = require('bcrypt');
const router = express.Router();
const jwt = require('jsonwebtoken');
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
            process.env.JWT_SECRET,
            {expiresIn: 946080000});
        res.json({message: "Registered User is now logged in the website.", tokenGiven});
    });
});

module.exports = router;

