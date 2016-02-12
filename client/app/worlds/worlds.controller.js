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

    $scope.convertToLowerCaseNoSpaces = function(nameToConvert) {
      return nameToConvert.replace(/ /g, '').toLowerCase();
    };

    $scope.addWorld = function () {
      httpService.addWorld($scope.newWorld).then(function (response) {
        addNewWorldToScope(response.data);
      });
    };

    function addNewWorldToScope(newWorld) {
      $scope.worlds.push(newWorld);
    }
  });
