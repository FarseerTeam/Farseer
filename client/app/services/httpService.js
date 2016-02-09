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

    this.getPlayers = function (world) {
      return $http.get('/api/worlds/' + world + '/players').then(function (response) {
        return response.data;
      });
    };

    this.addPlayer = function (newPlayer, world) {
      return $http.post('/api/worlds/' + world + '/players', newPlayer).then(function (response) {
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