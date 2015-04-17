var _ = require('lodash');
var players = require("./players");
var teams = require("./teams");

var ROOT = {id: "ROOT"}
var doBuildTeamPlayersMap = function (parentTeams, existingPlayers, cb) {
  var hashOfPlayers = _.reduce(existingPlayers,
    function (memo, item) {
      memo[item._team] = memo[item._team] || []
      memo[item._team].push({name: item.name});
      return memo;
    }, {});

  var buildNode = function (teams) {
    return _.map(teams, function (team) {

      var result = {
        team: team.name,
        players: hashOfPlayers[team._id] || []
      };
      if (!_.isEmpty(team.children))
        result.subTeams = buildNode(team.children);
      return result;
    });
  };

  var result = buildNode(parentTeams);

  if (hashOfPlayers[undefined]) {
    result.push({'team': undefined, players: hashOfPlayers[undefined]});
  }

  cb(result);
};


exports.buildTeamPlayersMap = function () {
  function getTeamMap(teamName, teamPlayersMap) {
    for (var index = 0; index < teamPlayersMap.length; index++) {
      var teamSection = teamPlayersMap[index];
      if(teamSection.team === teamName) {
        return teamSection;
      }
    }

    var map = {
      team: teamName,
      players: [],
      subTeams: []
    };
    teamPlayersMap.push(map);
    return map;
  }

  return players.Player.find({}).exec().then(function (foundPlayers) {
    var teamPlayersMap = [];

    for (var index = 0; index < foundPlayers.length; index++) {
      var player = foundPlayers[index];
      var pathElements = player._team.split('/');

      var map = getTeamMap(pathElements[1], teamPlayersMap);

      var parentTeam = map;
      var subTeam = map;
      for (var i = 2; i < pathElements.length; i++) {
        var pathElement = pathElements[i];
        subTeam = getTeamMap(pathElement, parentTeam.subTeams);
      };

      subTeam.players.push(player.toJSON());
    }
    return teamPlayersMap;
  });
};
