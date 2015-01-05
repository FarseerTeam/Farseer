'use strict';

angular.module('farseerApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/players', {
        templateUrl: 'app/players/players.html',
        controller: 'PlayersCtrl'
      }).
      when('/playersCards', {
        templateUrl: 'app/players/playersCards.html',
        controller: 'PlayersCtrl'
      });
  });
