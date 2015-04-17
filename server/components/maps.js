var _ = require('lodash');
var RSVP = require('rsvp');
var players = require("./players");
var teams = require("./teams");

exports.buildTeamPlayersMap = function () {
  function getTeamMap(teamPath, teamName, teamPlayersMap, teams) {
    for (var index = 0; index < teamPlayersMap.length; index++) {
      var teamSection = teamPlayersMap[index];
      if (teamSection.team === teamName) {
        return teamSection;
      }
    }

    var map = {
      team: teamName,
      players: [],
      subTeams: []
    };

    var team = _.findWhere(teams, {path: teamPath});
    if (team) {
      _.extend(map, team.toObject());
    }

    delete map._id;
    delete map.__v;

    teamPlayersMap.push(map);
    return map;
  }

  function getPathElements(player) {
    if (player._team) {
      return player._team.split('/');
    } else {
      return [null, undefined];
    }
  }

  return RSVP.hash({
    players: players.Player.find({}).exec(),
    teams: teams.Team.find({}).exec()
  }).then(function (data) {
    var teamPlayersMap = [];

    for (var index = 0; index < data.players.length; index++) {
      var player = data.players[index];

      var pathElements = getPathElements(player);

      var map = getTeamMap(player._team, pathElements[1], teamPlayersMap, data.teams);

      var parentTeam = map;
      var subTeam = map;
      for (var i = 2; i < pathElements.length; i++) {
        var pathElement = pathElements[i];
        subTeam = getTeamMap(player._team, pathElement, parentTeam.subTeams, data.teams);
      }

      subTeam.players.push(player.toJSON());

    }
    return teamPlayersMap;
  });
};
