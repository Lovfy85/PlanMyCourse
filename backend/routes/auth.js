const express = require('express');
const connectMade = require('../config.js');
const bcrypt = require('bcrypt');
const router = express.Router();

// POST
// Inserts a user into the Users table. 
router.post('/', async (req, res) => {
    try {
        const {username, password} = req.body;

        // hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // if required fields are missing
        if (!username || !password) {
            return res.status(400).json({ error: "Username and password are required." });
        }

        // Check if username already exists
        const existingUser = connectMade.query('SELECT * FROM Users WHERE username = ?', [username]);
        if (existingUser.length > 0) {
            return res.status(400).json({ error: "Username already exists." });
        }

        // insert new user
        connectMade.query(`INSERT INTO Users (username, password) VALUES (?, ?)`, [username, hashedPassword], (err, result) => {
        if(err){
            res.send("Did not insert that of a user successfully in Users table");
            return;
        }
            res.status(201).json({username: username, password: hashedPassword});
        });
        
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;

