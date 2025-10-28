const express = require('express');
const connectMade = require('../config.js');
const router = express.Router();

// get
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

// post
router.post('/', (req, res) => {
    const { courseId, taken } = req.body;
    const query = `INSERT INTO CoursesAdded (courseId, taken) Values (?, ?)`;
    connectMade.query(query, [courseId, taken], (err, result) => {
        if(err){
            res.send("Did not insert properly to CoursesAdded table")
            return;
        }
        res.status(201).json({id: result.insertId, courseId, taken});
    })

})

// put
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

// delete
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