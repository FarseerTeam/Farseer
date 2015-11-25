'use strict';

var express = require('express');
var passport = require('passport');
var router = express.Router();


var _authenticate = passport.authenticate('google');
var _authCallback = passport.authenticate('google', {successRedirect: '/', failureRedirect: '/auth/google'});

var _environmentRouter = function(env) {
    return _buildProdRouter();
};

function _buildProdRouter() {
    router.get('/auth/google', _authenticate);
    router.get('/auth/google/callback', _authCallback);

    router.all('/api/*', _authenticateApiRequest);
    return router;
}

function _authenticateApiRequest(request, response, next) {
        next();
}

module.exports = _environmentRouter;
