'use strict';

angular.module('farseerApp')
  .controller('PlayersCtrl', function ($scope, httpService) {
    $scope.players = [];

    httpService.getPlayers().then(function(players) {
      $scope.players = players;
    });

    $scope.update = function(player) {
      httpService.update(player).then(handleSuccess, handleFailure);
    };

    $scope.addPlayer = function() {
      httpService.addPlayer($scope.newPlayer).then(handleSuccessAndUpdateScope, handleFailure);
    };

    function handleSuccess() {
      $scope.handler = {
        message: 'Success'
      };
    }

    function handleSuccessAndUpdateScope(response) {
      var newPlayer = response.data;
      $scope.players.push(newPlayer);

      handleSuccess();
    }

    function handleFailure(error) {
      $scope.handler = {
        message: error.data.message
      };
    }

  });
