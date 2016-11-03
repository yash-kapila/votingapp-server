var express = require("express");
var jwt = require('jsonwebtoken');
var router = express.Router();
var User = require("../models/Users");
var Poll = require("../models/Polls");
var config = require("../config");

router.use(function(req, res, next) {
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

router.get('/getpolldetails', function(req, res){
    var pollURL = config.url+'/#/polls/'+req.query.url;
    var poll = new Poll();
    
    poll.retrievePollByURL(pollURL, function(err, record){
        if(err) res.status(500).json("Error while fetching poll");
        else{
            var poll = new Poll({
                _id: record._id
            });
            
            poll.retrieveUsername(function(err, user){
                if (err) res.status(500).json("Error while fetching poll");
                else{
                    res.status(200).json({
                        success: true,
                        poll: record,
                        user: user.username
                    });
                }
            });
        }
    });
});

router.put('/submitvote', function(req, res){
    var _id = {
        userID: req.body.params.userID,
        questionID: req.body.params.questionID,
        optionID: req.body.params.optionID
    }
    var poll = new Poll();

    poll.submitVote(_id, function(err, record){
        if(err) res.status(500).json("Couldn't count the vote this time");
        else{
            var item = record.polls[0].option;
            for(var i=0;i<item.length;i++){
                if(item[i]._id == _id.optionID){
                    item[i].votes++;
                    break;
                }                
            }

            record.save(function(err){
                if(err) res.status(500).json("Couldn't count the vote this time");
                res.status(200).json({
                    success: true,
                    msg: "Vote has been registered successfully",
                    poll: record.polls[0]
                })
            })
        }
    })
});

// expose router           
exports = module.exports = router;