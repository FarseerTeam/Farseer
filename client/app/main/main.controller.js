'use strict';

angular.module('farseerApp')
  .controller('MainCtrl', function ($scope, $location) {
    $location.path('/players');
  });
