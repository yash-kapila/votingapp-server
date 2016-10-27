var express = require("express");
var jwt = require('jsonwebtoken');
var router = express.Router();
var config = require("../config");

router.use(function(req, res, next) {
    var token = req.query.token;
    if(token){
        jwt.verify(token, config.secretkey, function(err, decoded) {
            console.log(decoded);
            if(err)
                res.status(403).json("Unauthorized access. Please login");
            else
                next();
        })
    }
    else{
        res.status(403).json("Unauthorized access. Please login");
    }
});

router.get('/users', function(req, res){
    console.log("INSIDE USERS");
    res.json("HELLO WORLD!");
});

// expose router           
exports = module.exports = router;