// app/ models/image.js

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ImageSchema = new Schema({
	id: Number,
	name: String,
	url: String,
	lat: String,
	long: String
});

module.exports = mongoose.model('Image', ImageSchema);
