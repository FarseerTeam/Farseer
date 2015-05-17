module.exports = (function() {
	
	var players = require('../../server/components/players');
	var teams = require('../../server/components/teams');

	var _addPlayer = function(playerToSave) {
		var player = new players.Player(playerToSave);
		return player.save().then(function(){return;}); 
	}

	var _addTeam = function(teamToSave) {
		var team = teams.Team(teamToSave);
		return team.save().then(function(){return;});
	}

	var _purgeData = function() {
		return players.Player.remove({})
			.then(teams.Team.remove({}))
			.then(function(){return;});
	}

	return {
		addPlayer: _addPlayer,
		addTeam: _addTeam,
		purgeData: _purgeData
	}
})();