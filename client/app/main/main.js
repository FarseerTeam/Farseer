'use strict';

angular.module('farseerApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        redirectTo: '/playersMap'
      });
  });