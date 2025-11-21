const express = require('express');
const connectMade = require('../config.js');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware.js');

// POST
// This is so that the logged in user can make that of comments for a specific course that they selected.
router.post('/', verifyToken, (req, res) => {

    //Needs that of the course's id in order for the user to make a comment to that specific course, the content they will submit inside the review 
    // and the user's id to make sure who made such comment.
    const {post, courseId} = req.body;
    const userId = req.user.userId;

    //This is to insert that of the reviews made into the table with:
    // The content of the post, the one who made the review and where that review will be placed in the specified course.
    connectMade.query(`INSERT INTO Reviews (post, userId, courseId) VALUES (?, ?, ?)`, [post, userId, courseId], (err, results) => {

        //Just sends an error if the user cannot simply make that of a comment inside that of a selected course.
        if(err){
            console.error("There seems to be that of an error of making a comment with the logged in user.", err);
            return res.status(500).json({message: "Making a comment cannot be done."});
        }

        res.status(201).json({message: "Review made is successful.", reviewId: results.insertId, userId, courseId});
    });
});

//Will implement a GET endpoint that gets comments ONLY for a specific course.

// GET
// This is to get all comments that are made from all courses with all the users that made such comments.
router.get('/', (req, res) => {

    //This is to select all those who made reviews for any class that has them. Will provide an error if the reviews stored in the table 
    // cannot be gotten whatsoever.
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