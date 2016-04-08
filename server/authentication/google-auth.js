'use strict';

var config = require('../config/environment');
var users = require('../components/users');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

var _verifyCB = function(accessToken, refreshToken, profile, done) {
    users.User.findOneAndUpdate({ email: profile.emails[0].value }, { email: profile.emails[0].value }, { upsert: true, new: true }, function(err, user) {
        if (err) {
            console.log(err);
        }
        return done(err, user);
    });
};

var _strategy = new GoogleStrategy({
    clientID: config.googleClientId,
    clientSecret: config.googleClientSecret,
    callbackURL: config.googleAuthCallbackURL,
    scope: 'https://www.googleapis.com/auth/plus.login email'
}, _verifyCB);

module.exports = {
    strategy: _strategy
};
