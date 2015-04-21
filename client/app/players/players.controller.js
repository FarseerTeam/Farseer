'use strict';

angular.module('farseerApp')
  .controller('PlayersCtrl', function ($scope, httpService) {
    $scope.players = [];
    $scope.teamPlayersMap = [];

    httpService.getPlayers().then(function(players) {
      $scope.players = players;
    });

    httpService.getTeamToPlayersMap().then(function(map) {
      $scope.teamPlayersMap = map;
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

    $scope.playerDroppedIntoTeamCB = function(player, team) {
      if (player._team === team.path) {
        return player;
      }

      player._team = team.path ? team.path : null;
      httpService.update(player);
      return player;
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
