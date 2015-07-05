'use strict';

angular.module('farseerApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/login', {
        templateUrl: 'app/login/login.html'
      });
  });
