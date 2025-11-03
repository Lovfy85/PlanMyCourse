//Express is used in order to refer to that of using the routes in which to make to refer to endpoints used. 
const express = require('express');

//Refers towards that of the connection of the main database in MySQL. 
const connectMade = require('../config.js');

//Keyword used to then refer the usage of endpoints. 
const router = express.Router();

//This is to make sure that of this nodejs file with its endpoints can be used to refer towards that of the frontend.
const app = express();
const cors = require('cors');
app.use(cors());

//Gets that of the CoursesAdded Table in which contains that of the courses that were added. Those courses added to the table refers to a course's id,
// to which that course id then accesses that of all that selected course's information. 
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

//Insert that of the courses added to the table in which is inserted based on the course's id and sets if it is taken or not. 
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

//Deletes that of the course that was added in the table overall by referring to its id in the table. 
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

//Makes sure that these endpoints can be referred to towards that of the server.js
module.exports = router;