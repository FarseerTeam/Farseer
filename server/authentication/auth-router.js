'use strict';

var express = require('express');
var passport = require('passport');
var router = express.Router();


var _prodAuthenticate = passport.authenticate('google');
var _prodAuthCallback = passport.authenticate('google', {successRedirect: '/', failureRedirect: '/auth/google'});
var _testAuthenticate = passport.authenticate('local', {successRedirect: '/', failureRedirect: '/login'});

var _environmentRouter = function(env) {
    return _buildTestRouter();
    //return ('production' === env) ?  _buildProdRouter() : _buildTestRouter();
}

var _buildProdRouter = function() {
    router.get('/auth/google', _prodAuthenticate);
    router.get('/auth/google/callback', _prodAuthCallback);
    router.use(_prodAuthenticate);
    return router;
}

var _buildTestRouter = function() {
    router.all('/test-login', _testAuthenticate);
    router.all('/api/*', _authenticateApiRequest);
    router.all('/*', _authenticatePageRequest);
    return router;
}

var _authenticateApiRequest = function (request, response, next) {
    if (!request.isAuthenticated()) {
        response.sendStatus(401);
    } else {
        console.log('authenticated user: ' + JSON.stringify(request.user, null, ' '));
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

var _authenticateRequestWithRedirect = function (request, response, next) {
    if (!request.isAuthenticated()) {
        response.redirect('/login');
    } else {
        console.log('authenticated user: ' + JSON.stringify(request.user, null, ' '));
        next();
    }
}

module.exports = _environmentRouter;