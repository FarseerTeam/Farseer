'use strict';

angular.module('farseerApp')
  .controller('WorldsCtrl', function ($scope, httpService, $route) {
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
        //TODO: need to make sure this is invoked and projected to the world's view.
        $scope.testValue = "myTestValue";
        for (var i = 0; i < $scope.worlds.length; i++) {
          if ($scope.worlds[i].name === oldWorldName) {
            $scope.worlds[i].name = response.data.name;
            break;
          }
        }

      });
      //$scope.worldEditMode = false;
      //TODO: ugly, need another way to update the view. Do not refresh the entire page.
      $route.reload();


    };

    function addNewWorldToScope(newWorld) {
      $scope.worlds.push(newWorld);
    }
  });
