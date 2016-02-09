'use strict';

var RSVP = require('rsvp');

module.exports = (function () {

  var dataService = require('../../server/components/dataService');
  var players = require('../../server/components/players');
  var teams = require('../../server/components/teams');
  var worlds = require('../../server/components/worlds');

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
    addWorld: function (worldName, worldPath) {
      var world = worlds.World({name: worldName, path: worldPath});

      return world.save().then(function () {
        return undefined;
      });
    },
    purgeData: function () {
      return RSVP.all([
        players.Player.remove({}),
        teams.Team.remove({}),
        worlds.World.remove({})])
        .then(function () {
          return undefined;
        });
    }
  }
})();
