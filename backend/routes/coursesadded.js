//Express is used in order to refer to that of using the routes in which to make to refer to endpoints used. 
const express = require('express');
const connectMade = require('../config.js');
const router = express.Router();

// Get all the courses added to the courses added table
router.get('/', (req, res) => {
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
            FROM CoursesAdded ca JOIN Courses c ON ca.courseId = c.courseId`
        connectMade.query(query, (err, results) => {
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

//Insert that of the courses added to the table 
router.post('/', (req, res) => {
    const { courseId, taken } = req.body;
    const checkQuery = 'SELECT * FROM CoursesAdded WHERE courseId = ?';

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
        const insertQuery = 'INSERT INTO CoursesAdded (courseId, taken) VALUES (?, ?)';
        connectMade.query(insertQuery, [courseId, taken], (err, result) => {
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

//This is to update that of whether or not the course added to the table is being taken or not. 
router.put('/:id', (req, res) => {
    const id = req.params.id
    const { taken } = req.body

    const query = `UPDATE CoursesAdded SET taken = ? WHERE id = ?`
    connectMade.query(query, [taken, id], (err, result) => {
        if(err){
            res.send("Did not change taken value in CoursesAdded table")
            return
        }
        res.status(201).json({id, taken});
    })

})

// Deletes that of the course that was added in the table overall by referring to its id in the table. 
router.delete('/:id', (req, res) => {
    const id = req.params.id;
    const query = `DELETE FROM CoursesAdded WHERE id = ?`;
    connectMade.query(query, [id], (err, result) => {
        if(err){
            res.send("Did not delete a course from CoursesAdded table")
            return;
        }
        res.json({message: "The course that was added before is now deleted."});
    })

})

module.exports = router;