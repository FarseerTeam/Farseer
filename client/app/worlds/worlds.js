'use strict';

angular.module('farseerApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/worlds', {
        templateUrl: 'app/worlds/worlds.html',
        controller: 'WorldsCtrl'
      });
  });
