'use strict';

angular.module('farseerApp')
  .controller('WorldsCtrl', function ($scope, httpService) {
    $scope.worlds = [];
    $scope.worldEditMode = false;

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

    $scope.updateWorld = function(oldWorldName, updatedWorldName) {
      httpService.updateWorld(oldWorldName, updatedWorldName).then(function(response) {
        for (var i = 0; i < $scope.worlds.length; i++) {
          if ($scope.worlds[i] === oldWorldName) {
            $scope.worlds[i] = response.data;
            break;
          }
        }
      });
    };

    function addNewWorldToScope(newWorld) {
      $scope.worlds.push(newWorld);
    }
  });
