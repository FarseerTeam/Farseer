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

function _buildProdRouter() {
    router.get('/auth/google', _prodAuthenticate);
    router.get('/auth/google/callback', _prodAuthCallback);
    router.use(_prodAuthenticate);
    return router;
}

function _buildTestRouter() {
    router.all('/test-login', _testAuthenticate);
    router.all('/api/*', _authenticateApiRequest);
    router.all('/*', _authenticatePageRequest);
    return router;
}

function _authenticateApiRequest(request, response, next) {
    if (!request.isAuthenticated()) {
        response.sendStatus(401);
    } else {
        next();
    }
}

function _authenticatePageRequest(req, res, next) {
	if ('/login' === req.url) {
		next();
	} else {
		_authenticateRequestWithRedirect(req, res, next);
	}
}

function _authenticateRequestWithRedirect(request, response, next) {
    if (!request.isAuthenticated()) {
        response.redirect('/login');
    } else {
        next();
    }
}

module.exports = _environmentRouter;