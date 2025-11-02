const express = require('express');
const connectMade = require('../config.js');
const router = express.Router();

//To get all course prerequisites
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

//To get that of all of a course's prerequisites
router.get('/search', (req,res) => {

    const searchTerm = req.query.term;
    if (!searchTerm) {
        res.status(400).json({error: "Search term is required"});
        return;
    }

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
    
    const searchValue = `${searchTerm}`;

    connectMade.query(query, [searchValue], (err, results) => {
        if(err){
            console.error('There has been an error getting the prerequisites from the prerequisites table.');
            console.error('SQL Error:', err.sqlMessage || err.message);
            res.status(500).send('Seems to be that of course to be selected is not at all being seen in the prerequisites table.');
            return;
        }
        res.json(results);
    });
});

module.exports = router;