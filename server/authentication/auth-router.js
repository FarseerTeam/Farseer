'use strict';

var express = require('express');
var passport = require('passport');
var router = express.Router();

var _authenticateApiRequest = function (request, response, next) {
    if (!request.isAuthenticated()) {
        // console.log(request);
        console.log('user: ' + JSON.stringify(request.user, null, ' '));
        response.sendStatus(401);
    } else {
        // if (request.user.email.indexOf('._temp') != -1) {
        //     request.dataService = tempDataService;
        // } else {
        //     request.dataService = couplingDataService;
        // }
        console.log('user: ' + JSON.stringify(request.user, null, ' '));
        console.log('authorized!!!!!')
        next();
    }
}

var _authenticateRequestWithRedirect = function (request, response, next) {
    if (!request.isAuthenticated()) {
        // console.log(request);
        console.log('not authenticated: ' + request.user );
        response.redirect('/login');
    } else {
        // if (request.user.email.indexOf('._temp') != -1) {
        //     request.dataService = tempDataService;
        // } else {
        //     request.dataService = couplingDataService;
        // }
        console.log('user: ' + request.user );
        console.log('authorized!!!!!')
        next();
    }
}

var _authenticatePageRequest = function(req, res, next) {
	if ('/login' === req.url) {
		next();
	} else {
		_authenticateRequestWithRedirect(req, res, next);
	}
}

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

// var _testAuthenticate = function(request, response, next) {
// 	console.log("I am so test authenticating stuff right now!  You're good, please continue...");
// 	next();
// }
var _testAuthenticate = passport.authenticate('local', {successRedirect: '/', failureRedirect: '/login'});

var _buildTestRouter = function() {
	router.all('/test-login', _testAuthenticate);

	router.all('/api/*', _authenticateApiRequest);

	router.all('/*', _authenticatePageRequest);
	return router;
}

var _environmentRouter = function(env) {
	return _buildTestRouter();
	//return ('production' === env) ?  _buildProdRouter() : _buildTestRouter();
}

module.exports = _environmentRouter;