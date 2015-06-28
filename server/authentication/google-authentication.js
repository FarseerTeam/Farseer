'use strict';

var _authenticate = function(request, response, next) {
	console.log("I am so authenticating stuff right now!  You're good, please continue...");
	next();
}

module.exports = {
	authenticate: _authenticate
}