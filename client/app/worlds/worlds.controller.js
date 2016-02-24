'use strict';

angular
  .module('farseerApp')
  .controller('WorldsCtrl', function($scope, httpService, $route) {

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
        for (var i = 0; i < $scope.worlds.length; i++) {
          if ($scope.worlds[i] === oldWorldName) {
            $scope.worlds[i] = response.data.name;
            break;
          }
        }

      });
      //TODO: ugly, need another way to update the view. Do not refresh the entire page.
      $route.reload();
    };

    $scope.deleteWorldOnUserConfirmation = function(worldName) {
      var result = window.confirm('Are you sure you want to delete this world and all associated players?');
      if (result) {
        deleteWorld(worldName);
        loadWorlds();
      }
    };

    function deleteWorld(worldName) {
      httpService.deleteWorld(worldName).then(function(response) {
        if (response.data.ok === 1) {
          $scope.deleteWorldStatus = response.data.ok;
        } else {
          $scope.deleteWorldStatus = -1;
        }
      });
    }

    function addNewWorldToScope(newWorld) {
      $scope.worlds.push(newWorld);
    }


  });
