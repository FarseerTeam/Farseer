'use strict';

var express = require('express');
var passport = require('passport');
var router = express.Router();


var _prodAuthenticate = passport.authenticate('google');
var _prodAuthCallback = passport.authenticate('google', {successRedirect: '/', failureRedirect: '/auth/google'});

var _environmentRouter = function(env) {
    return _buildProdRouter();
};

function _buildProdRouter() {
    router.get('/auth/google', _prodAuthenticate);
    router.get('/auth/google/callback', _prodAuthCallback);

    router.all('/api/*', _authenticateApiRequest);
    return router;
}

function _authenticateApiRequest(request, response, next) {
    //if (!request.isAuthenticated()) {
    //    response.sendStatus(401);
    //} else {
        next();
    //}
}

module.exports = _environmentRouter;
