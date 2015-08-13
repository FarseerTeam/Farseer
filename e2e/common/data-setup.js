'use strict';

var RSVP = require('rsvp');

module.exports = (function () {

  var dataService = require('../../server/components/dataService');
  var players = require('../../server/components/players');
  var teams = require('../../server/components/teams');

  dataService.connect();

  return {
    addPlayer: function (playerName, playerEmail, playerTeam, playerWorld) {
      var player = new players.Player({name: playerName, email: playerEmail, _team: playerTeam, world: playerWorld});
      return player.save().then(function () {
        return undefined;
      });
    },
    addTeam: function (teamName, teamPath, world) {
      var team = teams.Team({name: teamName, path: teamPath, world: world});
      return team.save().then(function () {
        return undefined;
      });
    },
    purgeData: function () {
      return RSVP.all([
        players.Player.remove({}),
        teams.Team.remove({})])
        .then(function () {
          return undefined;
        });
    }
  }
})();
