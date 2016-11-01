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
                    votes: Number
                }
            ],
            url: String
        }
    ]
});

// add methods to schema. This is done at 'repository' layer in Spring MVC.
PollsSchema.methods.submitPoll = function(pollQuestion, callback) {
    var query = { username: this.username };
    //this.model('Poll').findOneAndUpdate(query, { $push: { polls: this.polls }}, callback);
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

module.exports = mongoose.model('Poll', PollsSchema);