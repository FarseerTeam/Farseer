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


    $scope.dropCallback = function(event, index, player, team) {
      console.log(arguments);
      console.log(event);
      console.log(index);
      console.log(player);
      console.log(team);
      $scope.logListEvent('dropped at', event, index);

      //TODO - call the api to change the player's team - notify the user if an error happened, and revert the changes
      // this dnd functionality allows for shuffling players' ordering within teams - but the api has no way to store internal team ordering. 
      // Do we care? It is a little discordant to be able to arrange team ordering, only to have it disappear the next time page loads

      return player;
    };

    $scope.logEvent = function(message, event) {
        console.log(message, '(triggered by the following', event.type, 'event)');
        console.log(event);
    };

    $scope.logListEvent = function(action, event, index) {
        var message = 'Player element is ' + action + ' position ' + index;
        $scope.logEvent(message, event);
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
