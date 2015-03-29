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
	var failure = function(err) {console.log(err);};

	console.log('About to call find by email:');
	players.findByEmail(playerEmail, function(player) {
		console.log("Here with player: " + JSON.stringify(player, null, "  "));
		teams.findByName(teamName, function(team) {
			console.log("Here with team: " + JSON.stringify(team, null, "  "));
			player._team = team;
			player.save(function(err, updatedPlayer) {
				console.log("Here with updated player: " + JSON.stringify(updatedPlayer, null, "  "));
				maps.buildTeamPlayersMap(function(result) {
					console.log("Here with result: " + JSON.stringify(result, null, "  "));
					res.json(result);
				});
			}, failure);
		}, failure);
	}, failure);


	//TODO - 
	// get the player 
	// get the team
	// add the team to the player (overwriting if another team connection exists ?)
	// save it to mongo
	// ? return the new map?
	// what if an error happens inside of the save function?  - probably need some kind of err check and call the failure function

	// ? need a DELETE function for a mapping ?

};