'use strict';

var _ = require('lodash');

var maps = require("../../components/maps");

exports.index = function(req, res) {
	var world = req.params.worldId;
	maps.buildTeamPlayersMap(world, req.path).then(function(result) {
    res.json(result);
  });
};
