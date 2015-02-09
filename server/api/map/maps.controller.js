/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /players              ->  index
 * POST    /players              ->  create
 * GET     /players/:id          ->  show
 * PUT     /players/:id          ->  update
 * DELETE  /players/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');

var maps = require("../../components/maps");
// Get list of players

exports.index = function(req, res) {
	maps.buildTeamPlayersMap(function(result) {
		res.json(result);
	});
};