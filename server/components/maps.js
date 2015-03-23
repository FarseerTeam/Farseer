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


exports.buildTeamPlayersMap = function(callbackWithResult) {
    players.Player.find({}).exec().then(function(foundPlayers){
      teams.Team.getChildrenTree(function(err, fullTree){
      doBuildTeamPlayersMap(fullTree, foundPlayers, callbackWithResult);
    });
  });
};
