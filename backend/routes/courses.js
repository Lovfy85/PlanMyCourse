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

//To get all courses from that of the Courses table.
router.get('/', (req, res) => {
    try{
        connectMade.query('SELECT * FROM Courses', (err, results) => {
        if(err){
            console.error('There has been a query error.', err);
            res.status(500).send('There has been an error with getting the courses table.');
            return;
        }
        res.json(results);
    });
    }
    catch{
        console.error('There seems to be no way of getting the courses from the courses table overall.');
        res.status(500).send('Courses table seems to not be gotten at all.');
    }
});

//To get that of the a course's by name, subject or level.
router.get('/search', (req,res) => {

    const searchTerm = req.query.term;
    if (!searchTerm) {
        res.status(400).json({error: "Search term is required"})
        return
    }

    //This is to get that of the course to be searched based on just seeing that of a class's name, subject or its course number,
    // to which if these can be gotten, it can be displayed when searched. 
    var query = `SELECT * FROM Courses WHERE 
                    class_name LIKE ? 
                  OR subject LIKE ? 
                  OR FLOOR(number / 100) * 100 = ?`
    
    var searchValue = `%${searchTerm}`;
    if (Number(searchTerm)) {
        searchValue = `${Number(searchTerm)}`;
    }

    connectMade.query(query, [searchValue, searchValue, searchValue], (err, results) => {
        if(err){
            console.error('There has been an error getting the course from the courses table.');
            res.status(500).send('Seems to be that of course to be selected is not at all being seen in the courses table.');
            return;
        }
        res.json(results);
    });
});

//Makes sure that these endpoints can be referred to towards that of the server.js
module.exports = router;