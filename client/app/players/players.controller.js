'use strict';

angular.module('farseerApp')
  .controller('PlayersCtrl', function ($scope, $timeout, httpService, $routeParams) {
    $scope.players = [];
    $scope.teamPlayersMap = [];
    $scope.error = undefined;
    $scope.currentPath = '';
    $scope.world = '';

    var worldId = $routeParams.worldId;

    (function initializeController() {
        loadWorld(worldId);
        loadTeamToPlayersMap(null, worldId);
        loadPlayers(worldId);
    })();

    $scope.update = function(player) {
      httpService.update(player).then(function() {
        handleResponse('Success', player, false);

      }, function(error) {
        handleResponse(error.data.message, player, true);
      });
    };

    $scope.addPlayer = function() {
      $scope.newPlayer.world = worldId;
      httpService.addPlayer($scope.newPlayer).then(function(response) {
        addNewPlayerToScope(response.data);
        handleResponse('Success', $scope.newPlayer, false);

      }, function(error) {
        handleResponse(error.data.message, $scope.newPlayer, true);
      });
    };

    $scope.goToTeam = function(teamPath, worldid) {
      if(worldid === undefined){
        worldid = $scope.world.id;
      }
      loadTeamToPlayersMap(teamPath, worldid);
    };

    $scope.playerDroppedIntoTeamCB = function(player, team) {
      if (player._team === team.path) {
        return player;
      }

      player._team = team.path ? team.path : null;
      httpService.update(player).catch(errorUpdatingPlayer);
      return player;
    };

    function loadPlayers(world) {
      httpService.getPlayers(world).then(function(players) {
        $scope.players = players;
      });
    }

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

    function errorUpdatingPlayer(error) {
      loadTeamToPlayersMap().then(displayErrorMessage('Error moving player to a new team: ' + error.data.message));
    }

    function loadTeamToPlayersMap(teamPath, world) {
      return httpService.getTeamToPlayersMap(teamPath, world).then(function(map) {
        $scope.teamPlayersMap = map;
        $scope.currentPath = teamPath;
      });
    }

    function loadWorld(worldId) {
        httpService.getWorld(worldId).then(function(world) {
            $scope.world = world;
        });
    }

    function displayErrorMessage(errorMessage) {
      $scope.error = {message: errorMessage};
      $timeout(function() {$scope.error = undefined;}, 3000);
    }

  });
