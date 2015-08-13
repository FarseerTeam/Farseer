'use strict';

var config = require('../config/environment');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

var _verifyCB = function (accessToken, refreshToken, profile, done) {
  // User.findOrCreate({ googleId: profile.id }, function (err, user) {
  //   return done(err, user);
  // });
  return done(null, {id: profile.id});
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
