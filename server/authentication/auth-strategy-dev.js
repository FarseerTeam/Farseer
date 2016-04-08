'use strict';

var LocalStrategy = require('passport-local').Strategy;
var users = require('../components/users');

var _verifyCB = function(username, password, done) {
    users.User.findOneAndUpdate({ email: username }, { email: username }, { upsert: true, new: true }, function(err, user) {
        if (err) {
            console.log(err);
        }
        return done(err, user);
    });
};

var _strategy = new LocalStrategy(_verifyCB);

module.exports = {
    strategy: _strategy
}