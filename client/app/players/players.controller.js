'use strict';

angular.module('farseerApp')
  .controller('PlayersCtrl', function ($scope, $timeout, httpService, $routeParams, $location) {
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

    $scope.update = function (player, form) {
      if (!form.$invalid) {
        httpService.update(player).then(function () {
          handleResponse('Success', player, false);
        }, function (error) {
          handleResponse(error.data.message, player, true);
        });
      } else {
        handleResponse('Check team url of player. Update not successful.', player, true);
      }

    };

    $scope.addPlayer = function (form) {
      if (playerExists() === undefined && !form.$invalid) {
        $scope.newPlayer.world = worldId;
        httpService.addPlayer($scope.newPlayer).then(function (response) {
          addNewPlayerToScope(response.data);
          handleResponse('Success', $scope.newPlayer, false);
          $scope.newPlayer = null;
        }, function (error) {
          handleResponse(error.data.message, $scope.newPlayer, true);
        });
      } else {
        handleResponse('Check team url of player. Add not successful.', $scope.newPlayer, true);
      }
    };

    $scope.goToTeam = function (teamPath, worldid) {
      if (worldid === undefined) {
        worldid = $scope.world.id;
      }
      loadTeamToPlayersMap(teamPath, worldid);
    };

    $scope.playerDroppedIntoTeamCB = function (player, team) {
      if (player._team === team.path) {
        return player;
      }

      player._team = team.path ? team.path : null;
      httpService.update(player).catch(errorUpdatingPlayer);
      return player;
    };

    function playerExists() {
      return _.find(_.pluck($scope.players, 'email'), function (email) {
        return email === $scope.newPlayer.email;
      });
    }

    function getTeamPathFromUrl(url) {
      var path = url.split('/');
      if (path.length > 4) {
        return '/' + url.substring(url.indexOf(path[4]));
      }
      return null;
    }

    function loadPlayers(world) {
      httpService.getPlayers(world).then(function (players) {
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
      if (teamPath === null) {
        teamPath = getTeamPathFromUrl($location.path());
      }
      return httpService.getTeamToPlayersMap(teamPath, world).then(function (map) {
        $scope.teamPlayersMap = map;
        $scope.currentPath = teamPath;
        if (teamPath) {
          $location.path($scope.homeUrl + teamPath, false);
          $scope.url = $location.path();
        }
      });
    }

    function loadWorld(worldId) {
      httpService.getWorld(worldId).then(function (world) {
        $scope.world = world;
        $scope.homeUrl = '/worlds/' + worldId + '/playersMap';
      });
    }

    function displayErrorMessage(errorMessage) {
      $scope.error = {message: errorMessage};
      $timeout(function () {
        $scope.error = undefined;
      }, 3000);
    }

  });
