'use strict';

angular.module('farseerApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/worlds/:worldId/players', {
        templateUrl: 'app/players/players.html',
        controller: 'PlayersCtrl'
      }).
      when('/worlds/:worldId/playersMap', {
        templateUrl: 'app/players/playersMap.html',
        controller: 'PlayersCtrl'
      }).
      when('/auth/google', {
        redirectTo: function () {
          window.location = '/auth/google';
        }
      });
  });
