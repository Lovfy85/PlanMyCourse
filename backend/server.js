const express = require('express');
const connectMade = require('./config.js')

const app = express();
app.use(express.json());

app.get('/courses', (req, res) => {
    connectMade.query('SELECT * FROM Courses', (err, results) => {
        if(err){
            console.error('There has been a query error.', err);
            res.status(500).send('There has been an error with getting the database.');
            return;
        }
        res.json(results);
    });
});

app.listen(3001, () => {
    console.log("Server is running on port 3001")
});