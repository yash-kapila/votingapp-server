var express = require("express");
var jwt = require('jsonwebtoken');
var router = express.Router();
var User = require("../models/Users");
var config = require("../config");

router.use(function(req, res, next) {
    console.log('Inside router use');
    next();
});

router.post('/login', function(req, res){
    var user = new User({
        username: req.query.username,
        password: req.query.password
    });

    user.verifyUsername(function(err, record) {
        if(err) 
            res.status(500).json("Error while fetching record");
        else{
            if(record == null) 
                res.status(401).json("Invalid username. Please try again.");
            else{
                user.verifyPassword(function(err, record){
                    if(err) 
                        res.status(500).json("Error while fetching record");
                    else{
                        if(record == null) 
                            res.status(401).json("Invalid password. Please try again.");
                        else{
                            var token = jwt.sign(record.username, config.secretkey);
                            res.status(200).json({
                                success: true,
                                username: record.username,
                                token: token
                            });
                        }
                    }
                });
            }
        }
    });
});

router.post('/signup', function(req, res) {
    console.log('inside signup');
    var user = new User({
        username: req.query.username,
        password: req.query.password,
        email: req.query.email
    });
    user.addUser(function(err, record){
        if(err) console.log("Inside error of signup: " + err);
        console.log(record);
        res.json(record);
    })
})

// expose router           
exports = module.exports = router;
