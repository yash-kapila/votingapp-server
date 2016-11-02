var express = require("express");
var jwt = require('jsonwebtoken');
var router = express.Router();
var config = require("../config");
var Poll = require("../models/Polls");
var User = require("../models/Users");

router.use(function(req, res, next) {
    console.log('inside post login router use');
    var token = req.cookies.voting_jwt;
    if(token){
        jwt.verify(token, config.secretkey, function(err, decoded) {
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

router.post('/savepoll', function(req, res) {
    var pollURL = config.url+'/#/polls/'+req.body.params.question;
    
    var poll = new Poll({
        username: req.body.params.username
    });
    
    var pollQuestion = {
        question: req.body.params.question,
        option: req.body.params.options,
        url: pollURL
    }
    
    poll.submitPoll(pollQuestion, function(err, record){
        if(err) res.status(500).json("Error while fetching record");
        else
            res.status(200).json({
                success: true,
                url: pollURL
            });       
    });
});

router.get('/mypolls', function(req, res){
    var poll = new Poll({
        username: req.query.username
    });
    
    poll.retrieveUserPolls(function(err, record){
       if(err) res.status(500).json("Error while fetching polls");
       else{
            res.status(200).json({
                success: true,
                polls: record.polls
            });
       }
    });    
});

router.post('/logout', function(req, res){
    res.clearCookie('voting_jwt');
    res.status(200).json('User logged out successfully');
});

router.delete('/removepoll', function(req, res){
    var _id = req.query._id;
    var poll = new Poll();
    
    poll.removePoll(_id, function(err, record){
        if(err) res.status(500).json("Error while fetching poll");
        else{
            res.status(200).json({
                success: true,
                message: "Poll removed successfully"
            })
        }
    });
});

// expose router           
exports = module.exports = router;