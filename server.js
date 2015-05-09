// server.js

// BASE SETUP
// =============================================================================

var mongoose = require('mongoose');

var database = require('./config/database.js');
mongoose.connect(database.url);



// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/scripts', express.static(__dirname + '/public/js'));

var port = process.env.PORT || 8080;        // set our port

//routes =======================================================================
require('./app/routes')(app);


// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
