'use strict';

var _ = require('lodash');
var worlds = require('../../components/worlds');

exports.index = function(req, res) {
  worlds.World.find({}, function(err, doc) {
      res.json(doc);
  });
};