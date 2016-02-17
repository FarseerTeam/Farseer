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
        deferred.resolve({data: updatedWorld});
        return deferred.promise;
      }
    };

    scope = $rootScope.$new();
    testWorlds = ['Hogwarts School of Witchcraft and Wizardry', 'Beauxbatons Academy of Magic', 'Durmstrang Institute', 'Pillar'];
    WorldsCtrl = $controller('WorldsCtrl', {
      $scope: scope,
      httpService: mockService
    });
  }));

  describe('updating an existing world', function() {

    it('should return an updated world from the service', function() {
      var SECOND_WORLD_INDEX = 1;
      var UPDATED_WORLD = 'Pandora';
      scope.updateWorld(testWorlds[SECOND_WORLD_INDEX], UPDATED_WORLD);
      scope.$digest();

      expect(scope.worlds[SECOND_WORLD_INDEX]).toBe(UPDATED_WORLD);
    });

    it('should not update if world not found', function() {
      var NON_EXISTING_WORLD = 'asdf';
      var UPDATED_WORLD = 'Pandora';
      scope.updateWorld(NON_EXISTING_WORLD, UPDATED_WORLD);
      scope.$digest();

      expect(testWorlds).toBe(testWorlds);
    });

  });

  describe('urls are translated properly', function() {

    it('should return mixed case as lower case', function() {
      scope.$digest();

      var actual = scope.convertToLowerCaseNoSpaces(scope.worlds[testWorlds.indexOf('Pillar')]);
      expect(actual).toBe('pillar');
    });

    it('should remove embedded spaces', function() {
      scope.$digest();

      var actual = scope.convertToLowerCaseNoSpaces(scope.worlds[testWorlds.indexOf('Hogwarts School of Witchcraft and Wizardry')]);
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

  describe('adding new world', function () {
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
  });


});
