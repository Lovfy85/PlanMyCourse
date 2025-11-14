const jwt = require('jsonwebtoken');
require('dotenv').config();

function getToken(req, res, next){
    const authenticationThings = req.headers.authorization;

    if(!authenticationThings){
        return res.status(401).json({message: "There was no token gotten."});
    }

    const gottenToken = authenticationThings.split(" ")[1];

    jwt.verify(gottenToken, process.env.JWT_SECRET, (err, decoded) => {
        if(err){
            return res.status(401).json({message: "The gotten token seems to be invalid."});
        }

        req.user = decoded;
        next();
    });
}

module.exports = { getToken };