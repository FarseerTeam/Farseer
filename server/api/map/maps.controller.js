'use strict';

var _ = require('lodash');

var maps = require("../../components/maps");

exports.index = function(req, res) {
	maps.buildTeamPlayersMap(req.path).then(function(result) {
    res.json(result);
  });
};
