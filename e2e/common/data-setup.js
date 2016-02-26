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
    addWorld: function (worldName) {
      var world = worlds.World({name: worldName});
      return world.save();
    },
    deleteWorld: function(worldId) {
      return worlds.World({_id: worldId}).remove();
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
