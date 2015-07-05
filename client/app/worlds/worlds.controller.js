'use strict';

angular.module('farseerApp')
  .controller('WorldsCtrl', function ($scope, httpService) {
  $scope.worlds = [];

  (function initializeController() {
    loadWorlds();
  })();

  function loadWorlds() {
    httpService.getWorlds().then(function (worlds) {
      $scope.worlds = worlds;
    });
  }
});
