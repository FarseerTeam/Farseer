/**
 * Express configuration
 */

'use strict';

var express = require('express');
var favicon = require('serve-favicon');
var morgan = require('morgan');
var compression = require('compression');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var cookieParser = require('cookie-parser');
var errorHandler = require('errorhandler');
var path = require('path');
var config = require('./environment');
var session = require('express-session');
var passport = require('passport');
var localAuth = require('../authentication/auth-strategy-dev');
var googleAuthentication = require('../authentication/google-auth');
var users = require('../components/users');

module.exports = function (app) {
    var env = app.get('env');

    app.set('views', config.root + '/server/views');
    app.set('view engine', 'jade');
    app.use(compression());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.use(methodOverride());
    app.use(cookieParser());

    app.use(session({ secret: config.secrets.session }));
    app.use(passport.initialize());
    app.use(passport.session());

    passport.serializeUser(function (user, done) {
        if (user) {
            done(null, user);
        } else {
            done('The user did not have an id to serialize.');
        }
    });

    passport.deserializeUser(function (id, done) {
        users.User.find({ _id: id }, function (error, documents) {
            if (error) {
                console.log(error);
                done(error);
                return;
            }

            if (documents.length > 0)
                done(error, documents[0]);
            else
                done('The user with id: ' + id + ' could not be found in the database.');
        });
    });

    if ('production' === env) {
        app.use(favicon(path.join(config.root, 'public', 'favicon.ico')));
        app.use(express.static(path.join(config.root, 'public')));
        app.set('appPath', config.root + '/public');
        app.use(morgan('dev'));
    }

    passport.use(googleAuthentication.strategy);

    if ('development' === env || 'test' === env) {
        app.use(require('connect-livereload')());
        app.use(express.static(path.join(config.root, '.tmp')));
        app.use(express.static(path.join(config.root, 'client')));
        app.set('appPath', 'client');
        app.use(morgan('dev'));
        passport.use(localAuth.strategy);
        app.use(errorHandler()); // Error handler - has to be last
    }
};
