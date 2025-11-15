const jwt = require('jsonwebtoken');
require('dotenv').config();

function getToken(req, res, next){

    //Gets that of the token based on the user that is logged in. If that of the token cannot be gotten, send an error.
    const authenticationThings = req.headers.authorization;
    if(!authenticationThings){
        return res.status(401).json({message: "There was no token gotten."});
    }

    //Checks to see if that of the gotten taken is valid to be used (meaning it has not been expired). If it is expired or invalid, the token
    // cannot be used to make the user log in.
    const gottenToken = authenticationThings.split(" ")[1];
    jwt.verify(gottenToken, process.env.JWT_SECRET, (err, decoded) => {
        if(err){
            return res.status(401).json({message: "The gotten token seems to be invalid."});
        }

        //This is to then have the token for a user to hold the user's name and password for the website.
        req.user = decoded;
        next();
    });
}

module.exports = { getToken };