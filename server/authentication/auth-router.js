'use strict';

var express = require('express');
var router = express.Router();

var _prodAuthenticate = function(request, response, next) {
	console.log("I am so authenticating stuff right now!  You're good, please continue...");
	next();
}
// var _prodAuthenticate = passport.authenticate('google', {successRedirect: '/', failureRedirect: '/auth/google'});

var _buildProdRouter = function() {
	router.get('/auth/google', function(request, response) {
		response.send('inside google auth uri');
	});
	router.get('/auth/google/callback', function(request, response) {
		response.send('Inside google callback uri');
	});
	router.use(_prodAuthenticate);
	return router;
}

var _testAuthenticate = function(request, response, next) {
	console.log("I am so authenticating stuff right now!  You're good, please continue...");
	next();
}
// var _testAuthenticate = passport.authenticate('local', {successRedirect: '/', failureRedirect: '/login'}));

var _buildTestRouter = function() {
	// app.get('/test-login', _testAuthenticate);
	router.use(_testAuthenticate);
	return router;
}

var _environmentRouter = function(env) {
	return ('production' === env) ?  _buildProdRouter() : _buildTestRouter();
}

module.exports = _environmentRouter;