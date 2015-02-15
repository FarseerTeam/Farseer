'use strict';

angular.module('farseerApp')
  .controller('PlayersCtrl', function ($scope, httpService) {
    $scope.players = [];

    httpService.getPlayers().then(function(players) {
      $scope.players = players;
    });

    $scope.addPlayer = function() {
      httpService.addPlayer($scope.newPlayer);
    };

  });
