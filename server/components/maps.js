var _ = require('lodash');
var players = require("./players");
var teams = require("./teams");

var ROOT = {id:"ROOT"}
var doBuildTeamPlayersMap = function(parentTeams, existingPlayers, cb) {
    var hashOfPlayers = _.reduce(existingPlayers,
        function(memo, item) {
            memo[item._team] = memo[item._team] || []
            memo[item._team].push({name:item.name});
            return memo;
        }, {});

    var buildNode = function(teams){
        return  _.map(teams, function(team){

            var result = {
                team: team.name,
            players: hashOfPlayers[team._id] || []
            };
            if(!_.isEmpty(team.children))
                result.subTeams = buildNode(team.children);
            return result;
        });
    };

    var result = buildNode(parentTeams);

    if (hashOfPlayers[undefined]) {
        result.push({'team': undefined, players : hashOfPlayers[undefined]});
    }

    cb(result);
};


exports.buildTeamPlayersMap = function() {
    return players.Player.find({}).exec().then(function(foundPlayers) {
      var teamPlayersMap = [];

      for (var i = foundPlayers.length - 1; i >= 0; i--) {
        var player = foundPlayers[i]
        var pathElements = player._team.split('/');
        var map = {
          team : pathElements[1],
          players : [player.toJSON()]
        }

console.log('SERVER');
        console.info(player);
        teamPlayersMap.push(map);
      }

      return teamPlayersMap;
    });
};
