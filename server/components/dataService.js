var mongoose = require("mongoose");

var config = require('../config/environment');
// /components/dataService.js
// /config/environment/index.js

module.exports = {
	connect: function() {
			 mongoose.connection.on('error', function(err) {
				 // console.log("connection already opened");
			 });
			 mongoose.connect(config.mongo.uri);
		 }
}
