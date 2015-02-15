'use strict';

angular.module('farseerApp')
  .service('httpService', function ($http) {

    this.getPlayers = function(){
      return $http.get('/api/players').then(function(response) {
        return response.data;
      });
    };

    this.addPlayer = function(newPlayer) {
      return $http.post('/api/players', newPlayer).then(function(response) {
        return response;
      });
    };

  });
