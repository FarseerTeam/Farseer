var mongoose = require("mongoose");
var config = require('../config/environment');

module.exports = {
	connect: function() {
			 mongoose.connection.on('error', function(err) {
			 });

			 mongoose.connect(config.mongo.uri);
		 }
}
