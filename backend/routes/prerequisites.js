const express = require('express');
const connectMade = require('../config.js');
const router = express.Router();

// GET
// Get all course prerequisites.
router.get('/', (req, res) => {
    try{
        connectMade.query('SELECT * FROM Prerequisites', (err, results) => {
        if(err){
            console.error('There has been a query error.', err);
            res.status(500).send('There has been an error with getting the prerequisites table.');
            return;
        }
        res.json(results);
    });
    }
    catch{
        console.error('There seems to be no way of getting the prerequisites from the prerequisites table overall.');
        res.status(500).send('Prerequisites table seems to not be gotten at all.');
    }
});

// Get a courses prerequisites prerequisite
router.get('/recurse/:course', (req,res) => {
    const course = req.params.course;

    const query = `
    WITH RECURSIVE prereq_chain AS (
        SELECT course, prereq
        FROM Prerequisites
        WHERE course = ?
        UNION
        SELECT p.course, p.prereq
        FROM Prerequisites AS p
        INNER JOIN prereq_chain AS pc ON p.course = pc.prereq
    )
    SELECT * FROM prereq_chain
    `;

    connectMade.query(query, [course], (err, results) => {
        if(err){
            console.error('There has been an error getting the prerequisites from the prerequisites table.');
            res.status(500).send('Seems to be that of course to be selected is not at all being seen in the prerequisites table.');
            return;
        }
        res.json(results);
    });
});

// Get only the prerequisite of a given course
router.get('/:course', (req,res) => {
    const course = req.params.course;

    const query = `SELECT * FROM Prerequisites WHERE course = ?`

    connectMade.query(query, [course], (err, results) => {
        if(err){
            console.error('There has been an error getting the prerequisites from the prerequisites table.');
            res.status(500).send('Seems to be that of course to be selected is not at all being seen in the prerequisites table.');
            return;
        }
        res.json(results);
    });
});

module.exports = router;