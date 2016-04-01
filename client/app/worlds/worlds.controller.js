'use strict';

angular
  .module('farseerApp')
  .controller('WorldsCtrl', function($scope, httpService) {

    $scope.worlds = [];
    $scope.worldEditMode = false;
    $scope.updatedWorldNames = [];

    (function initializeController() {
      loadWorlds();
    })();

    function loadWorlds() {
      httpService.getWorlds().then(function (worlds) {
        $scope.worlds = worlds;
      });
    }

    $scope.addWorld = function () {
      httpService.addWorld($scope.newWorld).then(function (response) {
          addNewWorldToScope(response.data);
      }, function(response){
        window.alert(response.data.message);
        $scope.newWorld = '';
      });
    };

    $scope.updateWorld = function(worldId, worldName, updatedWorldName) {
      httpService.updateWorld(worldId, updatedWorldName).then(function(response) {
        for (var i = 0; i < $scope.worlds.length; i++) {
          if ($scope.worlds[i].id === worldId) {
            $scope.worlds[i].id = response.data.id;
            $scope.worlds[i].name = response.data.name;
            break;
          }
        }
      }, function (response){
        window.alert(response.data.message);
        for (var i = 0; i < $scope.worlds.length; i++) {
          if ($scope.worlds[i].id === worldId) {
            $scope.updatedWorldNames[i] = worldName;
            break;
          }
        }
      });
    };

    $scope.deleteWorldOnUserConfirmation = function(worldId) {
      var result = window.confirm('Are you sure you want to delete this world and all associated players?');
      if (result) {
        deleteWorld(worldId);
        loadWorlds();
      }
    };

    function deleteWorld(worldId) {
      httpService.deleteWorld(worldId).then(function(response) {
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
