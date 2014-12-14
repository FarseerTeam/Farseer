'use strict';

angular.module('farseerApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/players', {
        templateUrl: 'app/players/players.html',
        controller: 'PlayersCtrl'
      });
  });
