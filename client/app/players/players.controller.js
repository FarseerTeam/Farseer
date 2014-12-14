'use strict';

angular.module('farseerApp')
  .controller('PlayersCtrl', function ($scope) {
    $scope.players = ['Harry Potter', 'Hermione Granger', 'Ron Weasley'];
  });
