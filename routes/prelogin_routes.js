var express = require("express");
var jwt = require('jsonwebtoken');
var router = express.Router();
var User = require("../models/Users");
var config = require("../config");

router.use(function(req, res, next) {
    console.log('Inside prelogin router use');
    next();
});

router.post('/login', function(req, res){
    var user = new User({
        username: req.body.params.username,
        password: req.body.params.password
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
                            res.cookie('voting_jwt', token, { maxAge: 3600000 });   // option 'secure: true' for cookies over https
                            res.status(200).json({
                                success: true,
                                username: record.username,
                                id: record._id                                
                            });
                        }
                    }
                });
            }
        }
    });
});

router.post('/signup', function(req, res) {
    var user = new User({
        username: req.body.params.username,
        password: req.body.params.password,
        email: req.body.params.email
    });
    
    user.verifyUsername(function(err, record) {
        if(err) 
            res.status(500).json("Error while fetching record");
        else{
            if(record == null){
                user.verifyEmail(function(err, record) {
                    if(err)
                        res.status(500).json("Error while fetching record");
                    else{
                        if(record == null){
                            user.addUser(function(err, record){
                                if(err) 
                                    res.status(400).json("Couldn't sign you up. Please try again.");
                                else{
                                    var token = jwt.sign(record.username, config.secretkey);
                                    res.cookie('voting_jwt', token, { maxAge: 3600000 });   // option 'secure: true' for cookies over https
                                    res.status(200).json({
                                        success: true,
                                        username: record.username,
                                        id: record._id                                
                                    });
                                }
                            });                            
                        }
                        else{
                            res.status(401).json(record.email + ' already exists in our system. Please try with a different email address');
                        }
                    }
                });
            }
            else{
                res.status(401).json(record.username + ' already exists in our system. Please try with a different username');
            }
        }
    });
});

// expose router           
exports = module.exports = router;