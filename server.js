var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var config = require("./config");

var mongoose = require('mongoose');
mongoose.connect(config.database);

var prelogin_routes = require("./routes/prelogin_routes");
var postlogin_routes = require("./routes/postlogin_routes");

// read POST parameters of request and parse application/x-www-form-urlencoded
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// configure routes of the application
app.use('/api', prelogin_routes);
app.use('/api/v1', postlogin_routes);

// keep port number configuration in a config file for different environments
app.listen(8080, function(){
    console.log("Listening at port 8080");
})

// expose app           
exports = module.exports = app;