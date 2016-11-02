var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var PollsSchema = new Schema({
    username: String,
    polls: [
        {
            question: String,
            option: [
                {
                    value: String,
                    votes: { type: Number, default: 0 }
                }
            ],
            url: String
        }
    ]
});

// add methods to schema. This is done at 'repository' layer in Spring MVC.
PollsSchema.methods.submitPoll = function(pollQuestion, callback) {
    var query = { username: this.username };
    this.model('Poll').findOneAndUpdate(
        query,
        {
            $push: {"polls": pollQuestion}
        },
        {
            upsert: true, 
            new: true
        },
        callback
    );
};

PollsSchema.methods.retrieveUserPolls = function(callback) {
    return this.model('Poll').findOne({ username: this.username }, callback);
};

PollsSchema.methods.removePoll = function(id, callback){
    var query = { polls: { $elemMatch: { _id: id } } };
    this.model('Poll').findOneAndUpdate(
        query,
        {
            $pull: {
                polls: { _id: id }
            }
        },
        {
            upsert: true, 
            new: true
        },
        callback
    );   
};

PollsSchema.methods.retrievePollByURL = function(url, callback){
    var projection = { polls: { $elemMatch: { url: url } } };
    var query = {
        'polls.url': url    
    };
    this.model('Poll').findOne(query, projection, callback);
};

PollsSchema.methods.retrieveUsername = function(callback){
    return this.model('Poll').findOne({ _id: this._id }, callback);        
};

PollsSchema.methods.submitVote = function(id, callback){
    var query = {
        '_id': id.userID    
    };
    var projection = {
        'polls': { $elemMatch: { _id: id.questionID } }
    };

    return this.model('Poll').findOne(query, projection, callback);
    //return this.model('Poll').update(query, increment, callback);
};

module.exports = mongoose.model('Poll', PollsSchema);