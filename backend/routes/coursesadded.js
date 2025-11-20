//Express is used in order to refer to that of using the routes in which to make to refer to endpoints used. 
const express = require('express');
const connectMade = require('../config.js');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware.js');

// GET 
// Get all the courses added to the courses added table
router.get('/', verifyToken, (req, res) => {
    const userId = req.user.userId;
    try{
        const query = `
            SELECT 
                ca.id,
                ca.taken,
                c.courseId,
                c.title,
                c.subject,
                c.number,
                c.class_name
            FROM CoursesAdded ca JOIN Courses c ON ca.courseId = c.courseId
            WHERE ca.userId = ?`
            
        connectMade.query(query, [userId], (err, results) => {
        if(err){
            console.error('There has been a query error.', err);
            res.status(500).send('There has been an error with getting the coursesadded table.');
            return;
        }
        res.json(results);
    });
    }
    catch{
        console.error('There seems to be no way of getting the courses that were added from the coursesadded table overall.');
    }
});

// Get course by courseId, only returns a true or false
router.get('/:courseId', (req, res) => {
    const courseId = req.params.courseId;

    const query = `SELECT * FROM CoursesAdded WHERE courseId = ?`;

    connectMade.query(query, [courseId], (err, results) => {
        if (err) {
            console.error('Error checking courseId:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        if (results.length > 0) {
            // course is already in the planner
            return res.status(200).json({ exists: true, course: results[0] });
        } else {
            // course not in planner
            return res.status(200).json({ exists: false });
        }
    });
});

// POST
// Insert courses to the CoursesAdded table 
router.post('/',verifyToken, (req, res) => {
    const userId = req.user.userId;
    const { courseId, taken} = req.body;
    // const userId = req.user.userId;
    const checkQuery = 'SELECT * FROM CoursesAdded WHERE courseId = ?';

    // Check for userId
    if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
    }

    // Check if courseId already exists
    connectMade.query(checkQuery, [courseId], (err, results) => {
        if (err) {
            console.error('Error checking courseId:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        if (results.length > 0) {
            return res.status(400).json({ error: 'Course ID already exists' });
        }

        // If not found, insert new course
        const insertQuery = 'INSERT INTO CoursesAdded (courseId, taken, userId) VALUES (?, ?, ?)';
        connectMade.query(insertQuery, [courseId, taken, userId], (err, result) => {
            if (err) {
                console.error('Error inserting course:', err);
                return res.status(500).json({ error: 'Failed to insert course' });
            }
            res.status(201).json({
                message: 'Course added successfully',
            });
        });
    });
});

// PUT
// Update taken from false to true, or true to false
router.put('/:id', verifyToken,(req, res) => {
    const userId = req.user.userId;
    const id = req.params.id
    const { taken } = req.body

    const query = `UPDATE CoursesAdded SET taken = ? WHERE id = ? AND userId = ?`;
    connectMade.query(query, [taken, id, userId], (err, result) => {
        if(err){
            res.send("Did not change taken value in CoursesAdded table")
            return
        }
        res.status(201).json({id, taken});
    })

})

// DELETE
// Deletes that of the course that was added in the table overall by referring to its id in the table. 
router.delete('/:id', verifyToken,(req, res) => {
    const userId = req.user.userId;
    const id = req.params.id;
    const query = `DELETE FROM CoursesAdded WHERE id = ? AND userId = ?`;
    connectMade.query(query, [id, userId], (err, result) => {
        if(err){
            res.send("Did not delete a course from CoursesAdded table")
            return;
        }
        res.json({message: "The course that was added before is now deleted."});
    })

});

module.exports = router;