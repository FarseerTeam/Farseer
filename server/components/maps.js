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
    cb(result);
};


exports.buildTeamPlayersMap = function(callbackWithResult) {
    var found = {};
    var promise = teams.Team.find({parent:null}).exec();

    promise = promise.then(function(foundTeams){
        found.teams = foundTeams;
        return  players.Player.find({}).exec(); 
    }); 
    promise.then(function(foundPlayers){
        found.players = foundPlayers;
        teams.Team.getChildrenTree(function(err, fullTree){
                doBuildTeamPlayersMap(fullTree, found.players, callbackWithResult);
        });
    });    
};
