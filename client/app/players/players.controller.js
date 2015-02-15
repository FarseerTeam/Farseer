'use strict';

angular.module('farseerApp')
  .controller('PlayersCtrl', function ($scope, $http, httpService) {
    $scope.players = [];

    httpService.getPlayers().then(function(players) {
      $scope.players = players;
    });

    $scope.addPlayer = function() {
      var postPromise = $http.post('/api/players', $scope.newPlayer);

      postPromise.success(function() {
        $('.message').text('SUCCESS');
      });

      postPromise.error(function() {
        $('.message').text('ERROR');
      });
    };

  });
