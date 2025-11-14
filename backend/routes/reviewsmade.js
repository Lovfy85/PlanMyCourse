const express = require('express');
const connectMade = require('../config.js');
const jwt = require('jsonwebtoken');

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;

function getToken(req, res, next){
    const authenticationThings = req.headers.authorization;

    if(!authenticationThings){
        return res.status(401).json({message: "There was no token gotten."});
    }

    const gottenToken = authenticationThings.split(" ")[1];

    jwt.verify(gottenToken, JWT_SECRET, (err, decoded) => {
        if(err){
            return res.status(401).json({message: "The gotten token seems to be invalid."});
        }

        req.user = decoded;
        next();
    });
}

router.post('/', getToken, (req, res) => {
    const {post} = req.body;
    const userId = req.user.userId;

    connectMade.query(`INSERT INTO Reviews (post, userId) VALUES (?, ?)`, [post, userId], (err, results) => {
        if(err){
            console.error("There seems to be that of an error of making a comment with the logged in user.");
            return res.status(500).json({message: "Making a comment cannot be done."});
        }

        res.status(201).json({message: "Review made is successful.", reviewId: results.insertId, userId});
    });
});

router.get('/', (req, res) => {
    const query = `
        SELECT R.reviewId, R.post, U.username
        FROM Reviews R
        JOIN Users U ON R.userId = U.userId
    `

    connectMade.query(query, (err, results) => {
        if(err){
            return res.status(500).json({message: "Could not get all that of the reviews made"});
        }
        res.json(results);
    });
});

module.exports = router;