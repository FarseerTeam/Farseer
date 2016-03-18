'use strict';

angular.module('farseerApp')
  .service('httpService', function ($http) {
    this.getWorlds = function () {
      return $http.get('/api/worlds').then(function (response) {
        return response.data;
      });
    };

    this.addWorld = function (newWorld) {
      return $http.post('/api/worlds', newWorld).then(function (response) {
        return response;
      });
    };

    this.updateWorld = function(oldWorldName, updatedWorldName) {
      var data = {
        oldWorldName: oldWorldName,
        updatedWorldName: updatedWorldName
      };
      return $http.put('/api/worlds/', data).then(function(response) {
        return response;
      });
    };

    this.deleteWorld = function(worldName) {
      return $http({
        url: '/api/worlds',
        method: 'DELETE',
        data: {worldName: worldName},
        headers: {'Content-Type': 'application/json;charset=utf-8'}
      }).then(function(response){
        return response;
      });
    };

    this.getPlayers = function (world) {
      return $http.get('/api/worlds/' + world + '/players').then(function (response) {
        return response.data;
      });
    };

    this.addPlayer = function (newPlayer) {
      return $http.post('/api/worlds/' + newPlayer.world + '/players', newPlayer).then(function (response) {
        return response;
      });
    };

    this.update = function (player) {
      return $http.put('/api/worlds/' + player.world + '/players/' + player._id, player).then(function (response) {
        return response;
      });
    };


    this.getTeamToPlayersMap = function (path, world) {
      var request = '/api/worlds/' + world + '/maps';
      if (path) {
        request += path;
      }
      return $http.get(request).then(function (response) {
        return response.data;
      });
    };
  });
