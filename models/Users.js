var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        // validator: function(){
            
        // }
        required: true
    }
});

// add methods to schema. This is done at 'repository' layer in Spring MVC.
UserSchema.methods.verifyUsername = function(callback) {
    return this.model('User').findOne({ username: this.username }, callback);
};

UserSchema.methods.verifyPassword = function(callback) {
    return this.model('User').findOne(
        { 
            $and: [
                { username: this.username },
                { password: this.password }
            ]
        }, callback);
};

UserSchema.methods.verifyEmail = function(callback) {
    return this.model('User').findOne({ email: this.email }, callback);
};

UserSchema.methods.addUser = function(callback) {
    return this.model('User').create(
        { 
            username: this.username, 
            password: this.password, 
            email: this.email 
        }, callback);
};

exports = module.exports = mongoose.model('User', UserSchema);
