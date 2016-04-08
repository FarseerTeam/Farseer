'use strict';

var express = require('express');
var passport = require('passport');
var router = express.Router();


var _authenticate = passport.authenticate('google');
var _authCallback = passport.authenticate('google', { successRedirect: '/', failureRedirect: '/auth/google' });

var _environmentRouter = function(env) {
    router.get('/auth/google', _authenticate);
    router.get('/auth/google/callback', _authCallback);

    if ('development' === env || 'test' === env) {
        router.get('/test-login', passport.authenticate('local', { successRedirect: '/', failureRedirect: '/login' }));
    }

    router.all('/api/*', _authenticateApiRequest);
    return router;
}

function _authenticateApiRequest(request, response, next) {
    next();
}

module.exports = _environmentRouter;
