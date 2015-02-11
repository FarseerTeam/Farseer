var _ = require('lodash');
var players = require("./players");
var teams = require("./teams");


var doBuildTeamPlayersMap = function(existingTeams, existingPlayers) {
    var hashOfPlayers = _.reduce(existingPlayers,
            function(memo, item) {
                memo[item._team] = memo[item._team] || [] 
                memo[item._team].push({
                    name: item.name
                });
                return memo;
            }, {});

    var result = _.map(existingTeams, function(team) {
        return {
            team: team.name,
        players: hashOfPlayers[team.id]
        };
    });
    return result;
};


exports.buildTeamPlayersMap = function(callbackWithResult) {
    teams.Team.find({}, function(err, foundTeams) {
        players.Player.find({}, function(err, foundPlayers) {
            // console.log(foundPlayers);
            var actual = doBuildTeamPlayersMap(foundTeams, foundPlayers);
            callbackWithResult(actual);
        });
    });
};
