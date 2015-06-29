/**
 * Main application routes
 */

'use strict';

var errors = require('./components/errors');
var authentication = require('./authentication/auth-router');

module.exports = function (app) {
	var env = app.get('env');
	app.use(authentication(env));

  	app.use('/api/worlds', require('./api/world'));

  	app.route('/*').get(function (req, res) {
    res.sendfile(app.get('appPath') + '/index.html');
  });
};
