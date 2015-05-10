// server.js

// BASE SETUP
// =============================================================================

var mongoose = require('mongoose');

var database = require('./config/database.js');
mongoose.connect(database.url);

var port_socket = 3700;

var connection_count = 0;

var payload_level = 0;

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var dist1, dist2;
var rand1, rand2;

var io = require('socket.io').listen(app.listen(port_socket));


// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/scripts', express.static(__dirname + '/public/scripts'));
app.use('/stylesheets', express.static(__dirname + '/public/styles'));

var port = process.env.PORT || 8080;        // set our port

//routes =======================================================================
require('./app/routes')(app);


// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);


function verify(){
	if(connection_count == 2){
		io.emit('game-ready', {message: "test"});
	}
};

io.sockets.on('connection', function (socket) {
	console.log('one connection');
	connection_count++;
	verify();
});

io.on('connection', function(socket){
	socket.on('answer-payload', function(data){
	console.log('I am in');
	if(payload_level == 0){
		dist1 = data.distance;
		rand1 = data.rand;
		payload_level++;
	}
	else if (payload_level == 1){
		dist2 = data.distance;
		rand2 = data.rand;
		if (dist1 <= dist2){
			io.emit('Winner', {
				rand: rand1
			});
		}else{
			io.emit('Winner', {
				rand: rand2
			});
		}
		payload_level--;	
	}
});	
});