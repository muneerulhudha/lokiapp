var Image = require('./models/image');
var express = require('express');

module.exports =function(app) {

	// ROUTES FOR OUR API
	// =============================================================================
	var router = express.Router();              // get an instance of the express Router

	// middleware to use for all requests
	router.use(function(req, res, next) {
	    // do logging
	    console.log('Something is happening.');
	    next(); // make sure we go to the next routes and don't stop here
	});

	// on routes that end in /images
	// ----------------------------------------------------
	router.route('/images')

	    // create a image (accessed at POST http://localhost:8080/api/images)
	    .post(function(req, res) {
	        
	        var image = new Image();      // create a new instance of the Image model
	        image.id = req.body.id;
	        image.name = req.body.name;  // set the image name (comes from the request)
	        image.url = req.body.url;
	        image.lat = req.body.lat;
	        image.long = req.body.long;

	        // save the image and check for errors
	        image.save(function(err) {
	            if (err)
	                res.send(err);

	            res.json({ message: 'Image created!' });
	        });
	        
	    })

	    // get all the images (accessed at GET http://localhost:8080/api/images)
	    .get(function(req, res) {
	        Image.find(function(err, images) {
	            if (err)
	                res.send(err);

	            res.json(images);
	        });
	    });


	// on routes that end in /images/:image_id
	// ----------------------------------------------------
	router.route('/images/:image_id')

	    // get the image with that id (accessed at GET http://localhost:8080/api/images/:image_id)
	    .get(function(req, res) {
	        Image.findById(req.params.image_id, function(err, image) {
	            if (err)
	                res.send(err);
	            res.json(image);
	        });
	    })


	    // update the image with this id (accessed at PUT http://localhost:8080/api/images/:image_id)
	    .put(function(req, res) {

	        // use our image model to find the image we want
	        Image.findById(req.params.image_id, function(err, image) {

	            if (err)
	                res.send(err);

	            image.id = req.body.id;
	            image.name = req.body.name;  // update the images info
	            image.url = req.body.url;
	        	image.lat = req.body.lat;
	        	image.long = req.body.long;

	            // save the image
	            image.save(function(err) {
	                if (err)
	                    res.send(err);

	                res.json({ message: 'Image updated!' });
	            });

	        });
	    })

	    // delete the image with this id (accessed at DELETE http://localhost:8080/api/images/:image_id)
	    .delete(function(req, res) {
	        Image.remove({
	            _id: req.params.image_id
	        }, function(err, image) {
	            if (err)
	                res.send(err);

	            res.json({ message: 'Image Successfully deleted' });
	        });
	    });


	

	// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
	router.get('/', function(req, res) {
	    res.json({ message: 'hooray! welcome to Loki!' });   
	});

	// REGISTER OUR ROUTES -------------------------------
	// all of our routes will be prefixed with /api
	app.use('/api', router);

	app.get('*', function(req, res){
		//res.json({message: 'in base router'});
		res.sendfile('./public/index.html');  //load the single view file. Angular will handle the changes on front end
	});

	// more routes for our API will happen here


};