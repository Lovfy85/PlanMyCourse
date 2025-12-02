const express = require('express');
const connectMade = require('../config.js');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware.js');

// POST 
// This is so that the logged in user can make that of rating a course without having to make a comment towards that of the selected course.
router.post('/rating', verifyToken, (req, res) => {
    const {rating, courseId} = req.body;
    const userId = req.user.userId;

    if (!rating || rating < 1 || rating > 5){
        return res.status(400).json({message: "The star rating has to be only between values of 1-5. Anything else than that is invalid."});
    }

    connectMade.query(`SELECT * FROM Reviews WHERE userId = ? AND courseId = ? AND rating IS NOT NULL`, [userId, courseId], (err, results) => {
        if(err){
            console.error("There seems to be that of an error of making a star rating for a course overall.", err);
            return res.status(500).json({message: "Making that of a start rating towards that of a course cannot be done overall."});
        }

        if(results.length > 0){
            connectMade.query(`UPDATE REVIEWS SET rating = ? WHERE reviewId = ?`, [rating, results[0].reviewId], (updateErr) => {
                if(updateErr){
                    return res.status(500).json({message: "You cannot update that of the star rating."});
                }
                return res.status(200).json({...results[0], rating});
            });
        }

        else{

            connectMade.query(`INSERT INTO REVIEWS (rating, userId, courseId) VALUES (?, ?, ?)`, [rating, userId, courseId], (error, results2) => {
                if(error){
                    console.error("There seems to be that of an error of making a star rating for a course overall.", error);
                    return res.status(500).json({message: "Making that of a start rating towards that of a course cannot be done overall."});
                }

                const gottenQuery = `
                    SELECT R.reviewId, R.rating, R.createdAt, U.username, C.class_name, C.courseId
                    FROM Reviews R
                    JOIN Users U ON R.userId = U.userId
                    JOIN Courses C on R.courseId = C.courseId
                    WHERE R.reviewId = ?
                `

                connectMade.query(gottenQuery, [results2.insertId], (error1, rows) => {
                    if(error1){
                        console.error("There seems to be that of an error of making a star rating for a course overall.", error);
                        return res.status(500).json({message: "Making that of a start rating towards that of a course cannot be done overall."});
                    }
                    res.status(201).json(rows[0]);
                });
            });
        }
    });
});

// POST
// This is so that the logged in user can make that of comments for a specific course that they selected.
router.post('/review', verifyToken, (req, res) => {

    //Needs that of the course's id in order for the user to make a comment to that specific course, the content they will submit inside the review 
    // and the user's id to make sure who made such comment.
    const {post, courseId} = req.body;
    const userId = req.user.userId;

    if(!post){
        return res.status(400).json({message: "The comment to be made for a course cannot be made overall. You need to put something in overall."});
    }

    //This is to insert that of the reviews made into the table with:
    // The content of the post, the one who made the review and where that review will be placed in the specified course.
    connectMade.query(`INSERT INTO Reviews (post, userId, courseId) VALUES (?, ?, ?)`, [post, userId, courseId], (err, results) => {

        //Just sends an error if the user cannot simply make that of a comment inside that of a selected course.
        if(err){
            console.error("There seems to be that of an error of making a comment with the logged in user.", err);
            return res.status(500).json({message: "Making a comment cannot be done."});
        }
        
        const gottenQuery = `
            SELECT R.reviewId, R.post, R.createdAt, U.username, C.class_name, C.courseId
            FROM Reviews R
            JOIN Users U ON R.userId = U.userId
            JOIN Courses C on R.courseId = C.courseId
            WHERE R.reviewId = ?
        `;
        
        connectMade.query(gottenQuery, [results.insertId], (error1, rows) => {
            if(error1){
                console.error("There seems to be that of an error of making a star rating for a course overall.", error);
                return res.status(500).json({message: "Making that of a start rating towards that of a course cannot be done overall."});
            }
            res.status(201).json(rows[0]);
        });
    });
});

// GET
// This is to get all star ratings directed from THE SELECTED COURSE ONLY made by signed-in users.
router.get('/rating/:courseId', (req, res) => {

    const {courseId} = req.params;

    const query = `
        SELECT R.reviewId, R.rating, R.createdAt, U.username, C.class_name
        FROM Reviews R
        JOIN Users U ON R.userId = U.userId
        JOIN Courses C ON R.courseId = C.courseId
        WHERE R.courseId = ? AND R.rating IS NOT NULL
    `

    connectMade.query(query, [courseId], (err, results) => {
        if(err){
            console.error("There seems to be that of an error of getting that of the star ratings for that of a selected course.");
            return res.status(500).json({message: "Getting that of the star ratings for a selected course is not possible. "})
        }
        res.json(results);
    });
});


// GET
// This is to get all course reviews directed from THE SELECTED COURSE ONLY made by signed-in users. 
router.get('/review/:courseId', (req, res) => {

    const {courseId} = req.params;

    const query = `
        SELECT R.reviewId, R.post, R.createdAt, U.username, C.class_name
        FROM Reviews R
        JOIN Users U ON R.userId = U.userId
        JOIN Courses C ON R.courseId = C.courseId
        WHERE R.courseId = ? AND R.post IS NOT NULL
    `
    connectMade.query(query, [courseId], (err, results) => {
        if(err){
            console.error("There seems to be that of an error of getting that of the review comments for that of a selected course.");
            return res.status(500).json({message: "Getting that of the review comments for a selected course is not possible. "})
        }
        res.json(results);
    });
});

// DELETE
// A user can delete that of their own comment made in a course they commented in.
router.delete('/review/:reviewId', verifyToken, (req, res) => {
    
    const {reviewId} = req.params;
    const userId = req.user.userId;

    console.log("Going to remove reviewId:", reviewId, "for userId: ", userId);

    connectMade.query(`SELECT * FROM Reviews WHERE reviewId = ? AND userId = ? AND post IS NOT NULL`, [reviewId, userId], (err, result) => {
        if(err){
            console.error("There seems to be an error in getting that of review comment to be deleted for that of the targeted course.");
            return res.status(500).json({message: "Could not get that of the review comment to be deleted for that of the targeted course."});
        }

        if(result.length === 0){
            return res.status(400).json({message: "Could not find that of the review comment to be deleted."});
        }

        connectMade.query(`DELETE FROM Reviews WHERE reviewId = ?`, [reviewId], (error) => {
            if(error){
                console.error("Deleted that of the review comment towards that of a course.", error);
                return res.status(500).json({message: "There seems to be an error in deleting that of review comment for a specified course."});
            }

            res.json({message: "Removed that of the review comment from the course selected", reviewId});
        });
    });
});

// DELETE
// A user can remove that of their star rating they gave to that of a course overall. 
router.delete('/rating/:reviewId', verifyToken, (req, res) => {
    
    const {reviewId} = req.params;
    const userId = req.user.userId;

    console.log("Going to remove reviewId:", reviewId, "for userId: ", userId);

    connectMade.query(`SELECT * FROM Reviews WHERE reviewId = ? AND userId = ? AND rating IS NOT NULL`, [reviewId, userId], (err, result) => {
        if(err){
            console.error("There seems to be an error in getting that of star rating to be removed for that of the targeted course.");
            return res.status(500).json({message: "Could not get that of the star rating to be removed for that of the targeted course."});
        }

        if(result.length === 0){
            return res.status(400).json({message: "Could not find that of the star rating to be removed."});
        }

        connectMade.query(`DELETE FROM Reviews WHERE reviewId = ?`, [reviewId], (error) => {
            if(error){
                console.error("Removed that of the star rating towards that of a course.", error);
                return res.status(500).json({message: "There seems to be an error in removing that of the star rating for a specified course."});
            }

            res.json({message: "Removing that of the star rating from the course selected", reviewId});
        });
    });
});


// GET
// This is to get all star ratings directed from all courses done by signed-in users.
router.get('/rating', (req, res) => {

    //This is to select all those who made star rating reviews for any class that has them.
    const query = `
        SELECT R.reviewId, R.rating, R.createdAt, U.username, C.class_name, C.courseId
        FROM Reviews R
        JOIN Users U ON R.userId = U.userId
        JOIN Courses C ON R.courseId = C.courseId
        WHERE R.rating IS NOT NULL
    `
    connectMade.query(query, (err, results) => {
        if(err){
            return res.status(500).json({message: "Could not get all that of the star ratings accumulated for the courses."});
        }
        res.json(results);
    });
});

// GET 
// This is to get all review posts made directed from all courses done by signed-in users.
router.get('/review', (req, res) => {

    const query = `
        SELECT R.reviewId, R.post, R.createdAt, U.username, C.class_name, C.courseId
        FROM Reviews R
        JOIN Users U ON R.userId = U.userId
        JOIN Courses C ON R.courseId = C.courseId
        WHERE R.post IS NOT NULL
    `
    connectMade.query(query, (err, results) => {
        if(err){
            return res.status(500).json({message: "Could not get all that of the review posts accumulated for the courses."});
        }
        res.json(results);
    });
});

module.exports = router;