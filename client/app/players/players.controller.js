'use strict';

angular.module('farseerApp')
  .controller('PlayersCtrl', function ($scope, httpService) {
    $scope.players = [];

    httpService.getPlayers().then(function(players) {
      $scope.players = players;
    });

    $scope.addPlayer = function() {
      httpService.addPlayer($scope.newPlayer).then(handleSuccess, handleFailure);
    };

    function handleSuccess() {
      $scope.addPlayerResult = {
        message: 'Success'
      };
    }

    function handleFailure(error) {
      $scope.addPlayerResult = {
        message: error.data.message
      };
    }

  });
