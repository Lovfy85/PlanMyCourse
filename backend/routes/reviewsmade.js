const express = require('express');
const connectMade = require('../config.js');
const router = express.Router();
const { getToken } = require('../middleware/authMiddleware.js');

router.post('/', getToken, (req, res) => {
    const {post, courseId} = req.body;
    const userId = req.user.userId;

    connectMade.query(`INSERT INTO Reviews (post, userId, courseId) VALUES (?, ?, ?)`, [post, userId, courseId], (err, results) => {
        if(err){
            console.error("There seems to be that of an error of making a comment with the logged in user.", err);
            return res.status(500).json({message: "Making a comment cannot be done."});
        }

        res.status(201).json({message: "Review made is successful.", reviewId: results.insertId, userId, courseId});
    });
});

router.get('/', (req, res) => {
    const query = `
        SELECT R.reviewId, R.post, U.username, C.class_name, C.courseId
        FROM Reviews R
        JOIN Users U ON R.userId = U.userId
        JOIN Courses C ON R.courseId = C.courseId
    `

    connectMade.query(query, (err, results) => {
        if(err){
            return res.status(500).json({message: "Could not get all that of the reviews made"});
        }
        res.json(results);
    });
});

module.exports = router;