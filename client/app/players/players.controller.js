'use strict';

angular.module('farseerApp')
  .controller('PlayersCtrl', function ($scope, httpService) {
    $scope.players = [];

    httpService.getPlayers().then(function(players) {
      $scope.players = players;
    });

    $scope.update = function(player) {
      httpService.update(player).then(function() {
        handleResponse('Success', player, false);

      }, function(error) {
        handleResponse(error.data.message, player, true);
      });
    };

    $scope.addPlayer = function() {
      httpService.addPlayer($scope.newPlayer).then(function(response) {
        addNewPlayerToScope(response.data);
        handleResponse('Success', $scope.newPlayer, false);

      }, function(error) {
        handleResponse(error.data.message, $scope.newPlayer, true);
      });
    };

    function handleResponse(messageText, player, isError) {
      player.error = isError;

      $scope.handler = {
        message: messageText,
        error: isError
      };
    }

    function addNewPlayerToScope(newPlayer) {
        $scope.players.push(newPlayer);
    }

  });
