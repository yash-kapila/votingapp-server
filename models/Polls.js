var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var PollsSchema   = new Schema({
    username: {
        type: String,
        required: true
    },
    polls: {
        type: Array,
        required: true
    }
});

module.exports = mongoose.model('Polls', PollsSchema);