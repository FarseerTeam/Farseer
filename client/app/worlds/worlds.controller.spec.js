'use strict';

describe('Controller: WorldsCtrl', function () {

  beforeEach(module('farseerApp'));

  var WorldsCtrl,
      scope,
      mockService,
      addedWorld,
      testWorlds;


  beforeEach(inject(function ($controller, $rootScope, $q) {

    mockService = {
      getWorlds: function () {
        var deferred = $q.defer();
        deferred.resolve(testWorlds);
        return deferred.promise;
      },
      addWorld: function (newWorld) {
        addedWorld = newWorld;
        var deferred = $q.defer();
        deferred.resolve({ data: newWorld });
        return deferred.promise;
      },
      updateWorld: function (oldWorld, updatedWorld) {
        var deferred = $q.defer();
        deferred.resolve({data: { name: updatedWorld }});
        return deferred.promise;
      },
      deleteWorld: function () {
        var deferred = $q.defer();
        deferred.resolve({data: { ok: 1 }});
        return deferred.promise;
      }
    };

    scope = $rootScope.$new();
    testWorlds = [{name: 'Hogwarts School of Witchcraft and Wizardry'}, {name: 'Beauxbatons Academy of Magic'}, {name: 'Durmstrang Institute'}, {name: 'Pillar'}];
    WorldsCtrl = $controller('WorldsCtrl', {
      $scope: scope,
      httpService: mockService
    });
  }));

  describe('updating an existing world', function() {

    it('should return an updated world from the service', function() {
      var SECOND_WORLD_INDEX = 1;
      var UPDATED_WORLD = 'Pandora';
      scope.updateWorld(testWorlds[SECOND_WORLD_INDEX].name, UPDATED_WORLD);
      scope.$digest();

      expect(scope.worlds[SECOND_WORLD_INDEX].name).toBe(UPDATED_WORLD);
    });

    it('should not update if world not found', function() {
      var SECOND_WORLD_INDEX = 1;
      var NON_EXISTING_WORLD = 'asdf';
      var UPDATED_WORLD = 'Pandora';
      scope.updateWorld(NON_EXISTING_WORLD, UPDATED_WORLD);
      scope.$digest();

      expect(scope.worlds[SECOND_WORLD_INDEX].name).not.toBe(UPDATED_WORLD);
    });

    it('should show alert and set updatedWorldName to old world name if http request is rejected', function(){
      var expectedMessage = 'The Displayed Message';
      var SECOND_WORLD_INDEX = 1;
      var oldWorldName = testWorlds[SECOND_WORLD_INDEX].name;

      spyOn(window, 'alert');

      setupMockServiceToRejectUpdateWorldAndReturnMessage(expectedMessage);

      scope.updateWorld(oldWorldName, 'Some other name');
      scope.$digest();

      expect(window.alert).toHaveBeenCalledWith(expectedMessage);
      expect(scope.updatedWorldNames[SECOND_WORLD_INDEX]).toBe(oldWorldName);
    });

    function setupMockServiceToRejectUpdateWorldAndReturnMessage(messageToReturn){
      inject(function ($controller, $rootScope, $q) {
        mockService = {
          getWorlds: function () {
            var deferred = $q.defer();
            deferred.resolve(testWorlds);
            return deferred.promise;
          },
          updateWorld : function () {
            var deferred = $q.defer();
            deferred.reject({data: {message: messageToReturn}});
            return deferred.promise;
          }
        };

        scope = $rootScope.$new();
        WorldsCtrl = $controller('WorldsCtrl', {
          $scope: scope,
          httpService: mockService
        });
      });
    }
  });

  describe('urls are translated properly', function() {

    it('should return mixed case as lower case', function() {
      scope.$digest();
      var worldIndex = 3;

      var actual = scope.convertToLowerCaseNoSpaces(scope.worlds[worldIndex].name);
      expect(actual).toBe('pillar');
    });

    it('should remove embedded spaces', function() {
      scope.$digest();
      var worldIndex = 0;

      var actual = scope.convertToLowerCaseNoSpaces(scope.worlds[worldIndex].name);
      expect(actual).toBe('hogwartsschoolofwitchcraftandwizardry');
    });

  });

  describe('worlds list in the scope', function () {

    it('should be empty when promise is not fulfilled', function () {
      expect(scope.worlds).not.toBe(undefined);
      expect(scope.worlds.length).toEqual(0);
    });

    it('should be complete when promise is fulfilled', function () {
      scope.$digest();

      expect(scope.worlds.length).toEqual(testWorlds.length);
    });

  });

  describe('adding a new world', function () {
    var newWorld;

    beforeEach(function () {
      newWorld = { name: 'Warcraft' };
      scope.newWorld = newWorld;
    });

    it('should add new world', function () {
      scope.addWorld();
      scope.$digest();

      expect(addedWorld).toBe(newWorld);
    });

    it('should add new world to the empty list of worlds in scope when successful', function () {
      scope.$digest();
      scope.worlds = [];

      scope.addWorld();
      scope.$digest();

      expect(scope.worlds.length).toBe(1);
      expect(scope.worlds[0]).toBe(newWorld);
    });

    it('should add new world to the list of existing worlds in scope when successful', function () {
      scope.addWorld();
      scope.$digest();

      expect(scope.worlds.length).toBe(testWorlds.length);
      expect(_.last(scope.worlds)).toBe(newWorld);
    });

    it('should show alert with message and set newWorld to empty string if http request is rejected', function(){
      var expectedMessage = 'Here is a Message';
      scope.newWorld = 'I am a new world and I am happy to be added';

      spyOn(window, 'alert');

      setupMockServiceToRejectAddWorldAndReturnMessage(expectedMessage);

      scope.$digest();
      scope.worlds = [];
      scope.addWorld();
      scope.$digest();

      expect(scope.worlds).toEqual([]);
      expect(scope.newWorld).toEqual('');
      expect(window.alert).toHaveBeenCalledWith(expectedMessage);
    });

    function setupMockServiceToRejectAddWorldAndReturnMessage(messageToReturn){
      inject(function ($controller, $rootScope, $q) {
        mockService = {
          getWorlds: function () {
            var deferred = $q.defer();
            deferred.resolve(testWorlds);
            return deferred.promise;
          },
          addWorld : function () {
            var deferred = $q.defer();
            deferred.reject({data: {message: messageToReturn}});
            return deferred.promise;
          }
        };

        scope = $rootScope.$new();
        WorldsCtrl = $controller('WorldsCtrl', {
          $scope: scope,
          httpService: mockService
        });
      });
    }
  });

  describe('delete a world', function() {
    var world;

    beforeEach(function () {
      world = { name: 'Warcraft' };
    });

    it('should delete a world on confirmation', function() {
      spyOn(window, 'confirm').and.returnValue(true);

      scope.deleteWorldOnUserConfirmation(world);
      scope.$digest();

      expect(scope.deleteWorldStatus).toBe(1);
    });

    it('should not delete a world on cancellation', function() {
      spyOn(window, 'confirm').and.returnValue(false);

      scope.deleteWorldOnUserConfirmation(world);
      scope.$digest();

      expect(scope.deleteWorldStatus).toBe(undefined);
    });
  });

});
