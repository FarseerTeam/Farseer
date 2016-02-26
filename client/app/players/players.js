'use strict';

angular.module('farseerApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/worlds/:urlFormattedWorldName/players', {
        templateUrl: 'app/players/players.html',
        controller: 'PlayersCtrl'
      }).
      when('/worlds/:urlFormattedWorldName/playersMap', {
        templateUrl: 'app/players/playersMap.html',
        controller: 'PlayersCtrl'
      }).
      when('/auth/google', {
        redirectTo: function () {
          window.location = '/auth/google';
        }
      });
  });
