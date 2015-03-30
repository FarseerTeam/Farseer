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
var players = require('../../components/players');
var teams = require('../../components/teams');

exports.index = function(req, res) {
	maps.buildTeamPlayersMap(function(result) {
		res.json(result);
	});
};

exports.update = function(req, res) {
	var teamName = req.params.teamName;
	var playerEmail = req.params.playerEmail;

	var dbCallFailure = function(err) {
		res.status(409).json({message: 'An unexpected application error has occured.  Please try again.'});
	};

  var playerNotFound = function(err) {
    res.status(404).json({message: 'Player with email "'+playerEmail+'" does not exist.'});
  };

	var badInputFailure = function(errorText) {
		res.status(400).json({message: errorText});
	};

	players.findByEmail(playerEmail, function(player) {
		if (!player) {
			badInputFailure('The provided playerEmail (' + playerEmail + ') does not exist.');
			return;
		}

		teams.findByName(teamName, function(team) {
			if (!team) {
				badInputFailure('The provided teamName (' + teamName + ') does not exist.');
				return;
			}

			player._team = team;
			player.save(function(err, updatedPlayer) {
				maps.buildTeamPlayersMap(function(result) {
					res.json(result);
				});
			}, dbCallFailure);
		}, dbCallFailure);
	}, playerNotFound);
};
