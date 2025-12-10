const express = require('express');
const connectMade = require('../config.js');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware.js');

// POST 
// This is so that the logged in user can make that of rating a course without having to make a comment towards that of the selected course.
router.post('/reviews', verifyToken, (req, res) => {
    const { post, rating, courseId } = req.body;
    const userId = req.user.userId;

    // Validate presence of required fields
    if (rating === undefined || rating === null) {
        return res.status(400).json({ message: 'A star rating is required.' });
    }
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
        return res.status(400).json({ message: 'A star rating must be an integer between 1 and 5.' });
    }
    if (!post || String(post).trim() === '') {
        return res.status(400).json({ message: 'A comment is required.' });
    }

    // Ensure user hasn't already posted a review for this course
    connectMade.query(
        'SELECT * FROM Reviews WHERE userId = ? AND courseId = ?',
        [userId, courseId],
        (err, existing) => {
            if (err) {
                console.error('Error checking existing review', err);
                return res.status(500).json({ message: 'Could not verify existing reviews.' });
            }

            if (existing.length > 0) {
                return res.status(400).json({ message: 'You have already reviewed this course. Please edit or delete your existing review.' });
            }

            // Insert new review
            connectMade.query(
                'INSERT INTO Reviews (post, rating, userId, courseId) VALUES (?, ?, ?, ?)',
                [post.trim(), rating, userId, courseId],
                (insertErr, insertRes) => {
                    if (insertErr) {
                        console.error('Error inserting review', insertErr);
                        return res.status(500).json({ message: 'Could not create review.' });
                    }

                    const gottenQuery = `
                        SELECT R.reviewId, R.post, R.rating, R.createdAt, U.username, C.class_name, C.courseId
                        FROM Reviews R
                        JOIN Users U ON R.userId = U.userId
                        JOIN Courses C ON R.courseId = C.courseId
                        WHERE R.reviewId = ?
                    `;

                    connectMade.query(gottenQuery, [insertRes.insertId], (selErr, rows) => {
                        if (selErr) {
                            console.error('Error fetching created review', selErr);
                            return res.status(500).json({ message: 'Review created but could not be retrieved.' });
                        }
                        return res.status(201).json(rows[0]);
                    });
                }
            );
        }
    );
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

// PUT
// Edit a review comment (owner only)
router.put('/review/:reviewId', verifyToken, (req, res) => {
    const { reviewId } = req.params;
    const { post } = req.body;
    const userId = req.user.userId;

    if (!post || String(post).trim() === '') {
        return res.status(400).json({ message: 'A comment is required.' });
    }

    connectMade.query('SELECT * FROM Reviews WHERE reviewId = ? AND userId = ?', [reviewId, userId], (selErr, rows) => {
        if (selErr) {
            console.error('Error checking review ownership', selErr);
            return res.status(500).json({ message: 'Could not verify review ownership.' });
        }
        if (!rows || rows.length === 0) {
            return res.status(404).json({ message: 'Review not found or not owned by user.' });
        }

        connectMade.query('UPDATE Reviews SET post = ? WHERE reviewId = ?', [post.trim(), reviewId], (updErr) => {
            if (updErr) {
                console.error('Error updating review comment', updErr);
                return res.status(500).json({ message: 'Could not update review comment.' });
            }

            const gottenQuery = `
                SELECT R.reviewId, R.post, R.rating, R.createdAt, U.username, C.class_name, C.courseId
                FROM Reviews R
                JOIN Users U ON R.userId = U.userId
                JOIN Courses C ON R.courseId = C.courseId
                WHERE R.reviewId = ?
            `;

            connectMade.query(gottenQuery, [reviewId], (selErr2, selRows) => {
                if (selErr2) {
                    console.error('Error fetching updated review', selErr2);
                    return res.status(500).json({ message: 'Review updated but could not be retrieved.' });
                }
                res.json(selRows[0]);
            });
        });
    });
});

// PUT
// Edit a star rating (owner only)
router.put('/rating/:reviewId', verifyToken, (req, res) => {
    const { reviewId } = req.params;
    const { rating } = req.body;
    const userId = req.user.userId;

    if (rating === undefined || rating === null) {
        return res.status(400).json({ message: 'A star rating is required.' });
    }
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
        return res.status(400).json({ message: 'A star rating must be an integer between 1 and 5.' });
    }

    connectMade.query('SELECT * FROM Reviews WHERE reviewId = ? AND userId = ?', [reviewId, userId], (selErr, rows) => {
        if (selErr) {
            console.error('Error checking review ownership for rating update', selErr);
            return res.status(500).json({ message: 'Could not verify review ownership.' });
        }
        if (!rows || rows.length === 0) {
            return res.status(404).json({ message: 'Review not found or not owned by user.' });
        }

        connectMade.query('UPDATE Reviews SET rating = ? WHERE reviewId = ?', [rating, reviewId], (updErr) => {
            if (updErr) {
                console.error('Error updating review rating', updErr);
                return res.status(500).json({ message: 'Could not update review rating.' });
            }

            const gottenQuery = `
                SELECT R.reviewId, R.post, R.rating, R.createdAt, U.username, C.class_name, C.courseId
                FROM Reviews R
                JOIN Users U ON R.userId = U.userId
                JOIN Courses C ON R.courseId = C.courseId
                WHERE R.reviewId = ?
            `;

            connectMade.query(gottenQuery, [reviewId], (selErr2, selRows) => {
                if (selErr2) {
                    console.error('Error fetching updated rating', selErr2);
                    return res.status(500).json({ message: 'Rating updated but could not be retrieved.' });
                }
                res.json(selRows[0]);
            });
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