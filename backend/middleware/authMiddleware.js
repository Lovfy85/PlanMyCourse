const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyToken = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
            if (err) {
                console.log(err.message);
                return res.status(401).json({error: "Token is not valid"});
            } else {
                console.log(decodedToken)
                req.user = decodedToken;
                next();
            }
        });
    } else {
        res.status(401).json({ error: "You are not authenticated" });
    }
}

module.exports = { verifyToken };