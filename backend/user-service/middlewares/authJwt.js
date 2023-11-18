const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models/index.js");

verifyToken = (req,res,next) => {
    console.log("Authenticating with verifyToken.");
    let token = req.session.token; 
    if (!token) {
        console.log("No token found.");
        return res.status(401).send({ message: "No token provided." });
    }
    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
            console.log(err.message);
            return res.status(401).send({ message: "Authorization failed." });
        }
        req.userId = decoded.id; 
        console.log("Authorization success.");
        if (!req.headers['x-original-uri']) { // if this is not a request from the gateway, i.e. a request from user-service
            next();                           // note: this implies gateway set an x-original-uri header when routing here from other services
            return;
        }
        return res.status(200).send({ message: "Authorization succeeded." });
    });
};


isAdmin = (req,res,next) => {
    console.log("Authenticating with verifyAdmin.")
    let token = req.session.token; 
    if (!token) {
        console.log("No token found.");
        return res.status(401).send({ message: "No token provided." });
    }
    jwt.verify(token, config.secret, (err,decoded) => {
        if (err) {
            console.log(err.message);
            return res.status(401).send({ message: "Authorization failed." });
        }
        if (decoded.isAdmin) {
            if (!req.session.token) {
                req.userId = decoded.id;
            }
            console.log("Admin authorization success.");
            if (!req.headers['x-original-uri']) { // if this is not a request from the gateway, i.e. a request from user-service
                next();                           // note: this implies gateway set an x-original-uri header when routing here from other services
                return;
            }
            return res.status(200).send({ message: "Admin authorization succeeded." });
        }
        console.log("No admin authorization. Forbidden.");
        return res.status(403).send({ message: "Admin authorization needed. Forbidden." });
    });
};


const authJwt = {
    verifyToken,
    isAdmin,
}; 
module.exports = authJwt;
