'use strict';

var LocalStrategy = require('passport-local').Strategy;

var _verifyCB = function(username, password, done) {
	// userDataService.findOrCreate(username + "._temp", function (user) {
	//     done(null, user);
	// });
	console.log('*********************************************************************');
	console.log('inside verfify for local auth strategy\nusername: ' + username + '\npassword: ' + password);
	console.log('*********************************************************************');
	
	return done(null, {id: username});
}

var _strategy = new LocalStrategy(_verifyCB);

module.exports = {
	strategy: _strategy
}