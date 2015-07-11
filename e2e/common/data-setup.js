'use strict'

var RSVP = require('rsvp');

module.exports = (function() {
	
	var dataService = require('../../server/components/dataService');
	var players = require('../../server/components/players');
	var teams = require('../../server/components/teams');

	dataService.connect();

	var _addPlayer = function(playerName, playerEmail, playerTeam, playerWorld) {
		var player = new players.Player({name: playerName, email: playerEmail, _team: playerTeam, world: playerWorld});
		return player.save().then(function(){return;}); 
	}

	var _addTeam = function(teamName, teamPath) {
		var team = teams.Team({name: teamName, path: teamPath});
		return team.save().then(function(){return;});
	}

	var _purgeData = function() {
		return RSVP.all([
				players.Player.remove({}), 
				teams.Team.remove({})])
			.then(function(){return;});
	}

	return {
		addPlayer: _addPlayer,
		addTeam: _addTeam,
		purgeData: _purgeData
	}
})();