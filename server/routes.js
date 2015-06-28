/**
 * Main application routes
 */

'use strict';

var errors = require('./components/errors');
var authentication = require('./authentication/google-authentication');

module.exports = function (app) {

  app.use(authentication);

  app.use('/api/worlds', require('./api/world'));

  app.route('/*').get(function (req, res) {
    res.sendfile(app.get('appPath') + '/index.html');
  });
};
