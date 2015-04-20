var _ = require('lodash');
var RSVP = require('rsvp');
var players = require("./players");
var teams = require("./teams");

exports.buildTeamPlayersMap = function () {
  return RSVP.hash({
    players: players.Player.find({}).exec(),
    teams: teams.Team.find({}).exec()
  }).then(function (data) {
    var teamPlayersMap = [];

    for (var index = 0; index < data.players.length; index++) {
      var player = data.players[index];
      var destinationTeam = findDestinationTeam(player, teamPlayersMap, data.teams);
      destinationTeam.players.push(player.toJSON());

    }
    return teamPlayersMap;
  });
};

function getTeamNode(teamPath, teamName, teamPlayersMap, teams) {
  for (var index = 0; index < teamPlayersMap.length; index++) {
    var teamSection = teamPlayersMap[index];
    if (teamSection.team === teamName) {
      return teamSection;
    }
  }

  var teamNode = {
    team: teamName,
    players: [],
    subTeams: []
  };

  var team = _.findWhere(teams, {path: teamPath});
  if (team) {
    _.extend(teamNode, team.toObject());
  }

  delete teamNode._id;
  delete teamNode.__v;

  teamPlayersMap.push(teamNode);
  return teamNode;
}

function getPathElements(player) {
  if (player._team) {
    return player._team.split('/');
  } else {
    return [null, undefined];
  }
}

function findDestinationTeam(player, teamPlayersMap, teamsList) {
  var pathElements = getPathElements(player);
  var parentTeam = { subTeams: teamPlayersMap };

  for (var i = 1; i < pathElements.length; i++) {
    var pathElement = pathElements[i];
    parentTeam = getTeamNode(player._team, pathElement, parentTeam.subTeams, teamsList);
  }

  return parentTeam;
}
