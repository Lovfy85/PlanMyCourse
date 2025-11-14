const express = require('express');
const connectMade = require('../config.js');
const bcrypt = require('bcrypt');
const router = express.Router();

// POST
// Inserts a user into the Users table. 
router.post('/', async (req, res) => {
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
    });

    // Insert new user
    connectMade.query('INSERT INTO Users (username, password) VALUES (?, ?)',[username, hashedPassword], (err, result) => {
        if(err){
            res.status(500).send('Error inserting new user.');
            return;
        }
        res.status(201).json({ message: "User created successfully", username: username });
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;

