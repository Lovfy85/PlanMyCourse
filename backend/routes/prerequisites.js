const express = require('express');
const connectMade = require('../config.js');
const router = express.Router();

//This is to make sure that of this nodejs file with its endpoints can be used to refer towards that of the frontend.
const app = express();
const cors = require('cors');
app.use(cors());

//To get all course prerequisites. It selects that of everything that was filled in the 'Prerequisites' table initialized from that of the web scraper file.
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

//To get that of all of a course's prerequisites and those of its prerequisites' prerequisites
router.get('/:prereq', (req,res) => {
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
            res.status(500).send('Seems to be that of course to be selected is not at all being seen in the prerequisites table.');
            return;
        }
        res.json(results);
    });
});

//To get that of all of a course's prerequisites
router.get('/prereq', (req,res) => {


    const searchTerm = req.query.term;
    if (!searchTerm) {
        res.status(400).json({error: "Search term is required"});
        return;
    }

    const query = `
    SELECT * FROM Prerequisites
    WHERE course = ?
    `;
    
    const searchValue = `${searchTerm}`;

    connectMade.query(query, [searchValue], (err, results) => {
        if(err){
            console.error('There has been an error getting the prerequisites from the prerequisites table.');
            res.status(500).send('Seems to be that of course to be selected is not at all being seen in the prerequisites table.');
            return;
        }
        res.json(results);
    });
});

module.exports = router;