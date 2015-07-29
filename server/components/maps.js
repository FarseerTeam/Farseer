var _ = require('lodash');
var RSVP = require('rsvp');
var players = require("./players");
var teams = require("./teams");

exports.buildTeamPlayersMap = function (worldId, path) {
  return RSVP.hash({
    players: players.Player.find({ world: worldId }).exec(),
    teams: teams.Team.find({}).exec()
  }).then(function (data) {
    var teamPlayersMap = [];

    for (var index = 0; index < data.players.length; index++) {
      var player = data.players[index];
      var destinationTeam = populateMapWithTeamsForPlayer(player, teamPlayersMap, data.teams);
      destinationTeam.players.push(player.toJSON());
    }

    var result = findTeamWithPath(path, teamPlayersMap);

    if (result) {
      return [result];
    }

    return teamPlayersMap;
  });
};

function findTeamWithPath(path, teamMap) {
  for (var index = 0; index < teamMap.length; index++) {
    var team = teamMap[index];

    if (team.path === path) {
      return team;
    } else {
      var result = findTeamWithPath(path, team.subTeams);
      if (result) {
        return result;
      }
    }
  }
}

function populateMapWithTeamsForPlayer(player, teamPlayersMap, teamsList) {
  var pathElements = getPathElements(player);
  var parentTeam = { subTeams: teamPlayersMap };
  var teamPath = '';

  for (var index = 1; index < pathElements.length; index++) {
    var pathElement = pathElements[index];
    teamPath += '/' + pathElement;
    parentTeam = getTeamNode(teamPath, pathElement, parentTeam.subTeams, teamsList);
  }
  return parentTeam;
}

function getPathElements(player) {
  if (player._team) {
    return player._team.split('/');
  } else {
    return [null, 'unassigned'];
  }
}

function getTeamNode(teamPath, teamPathElement, teamPlayersMap, teams) {
  for (var index = 0; index < teamPlayersMap.length; index++) {
    var teamSection = teamPlayersMap[index];
    if (teamSection.team === teamPathElement) {
      return teamSection;
    }
  }

  var team = _.findWhere(teams, { path: teamPath });
  var teamNode = createTeamNode(teamPathElement, team, teamPath);
  teamPlayersMap.push(teamNode);
  return teamNode;
}

function createTeamNode(teamPathElement, team, teamPath) {
  var teamNode = {
    team: teamPathElement,
    path: teamPath,
    players: [],
    subTeams: []
  };

  if (team) {
    _.extend(teamNode, team.toObject());
  }

  delete teamNode._id;
  delete teamNode.__v;
  return teamNode;
}
