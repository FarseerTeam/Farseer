'use strict';

angular.module('farseerApp')
  .controller('PlayersCtrl', function ($scope, $http) {
    $scope.players = [];

    $http.get('/api/players').success(function(players) {
      $scope.players = players;
    });

    $scope.addPlayer = function() {
      $http.post('/api/players', $scope.newPlayer);
    };

  });
