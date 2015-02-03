'use strict';

angular.module('farseerApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/players', {
        templateUrl: 'app/players/players.html',
        controller: 'PlayersCtrl'
      }).
      when('/playersMap', {
        templateUrl: 'app/players/playersMap.html',
        controller: 'PlayersCtrl'
      });
  });
