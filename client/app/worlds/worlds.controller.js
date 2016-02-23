'use strict';

angular
  .module('farseerApp')
  .controller('WorldsCtrl', function($scope, httpService, $route, $uibModal) {

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

    $scope.deleteWorld = function(worldName) {
      httpService.deleteWorld(worldName).then(function(response){
        console.log('delete response', response);
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
      //$scope.worldEditMode = false;
      //TODO: ugly, need another way to update the view. Do not refresh the entire page.
      $route.reload();
    };

    $scope.open = function (size) {
      var modalInstance = $uibModal.open({
        templateUrl: 'worldsModal1.html',
        //template: '<div>asdfadf</div>',
        controller: 'ModalInstanceCtrl',
        size: size,
        resolve: {
          items: function () {
            //return $scope.items;
            return "asdfa";
          }
        }
      });

      modalInstance.result.then(function (selectedItem) {
        console.log("modalInstance result");
      }, function () {
        console.log('Modal dismissed at: ' + new Date());
      });
    };

    function addNewWorldToScope(newWorld) {
      $scope.worlds.push(newWorld);
    }
  });

angular.module('farseerApp').controller('ModalInstanceCtrl', function ($scope, $uibModalInstance) {

  $scope.ok = function () {
    console.log("I'm in a ModalInstanceCtrl");
    //$uibModalInstance.close($scope.selected.item);
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };

});
