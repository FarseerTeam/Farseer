'use strict';

describe('Controller: WorldsCtrl', function () {

  beforeEach(module('farseerApp'));

  var WorldsCtrl, scope, mockService;


  beforeEach(inject(function ($controller, $rootScope, $q) {
    mockService = {
      getWorlds: function () {
        var deferred = $q.defer();
        deferred.resolve(['Hogwarts School of Witchcraft and Wizardry', 'Beauxbatons Academy of Magic', 'Durmstrang Institute']);
        return deferred.promise;
      }
    };
    
    scope = $rootScope.$new();
    WorldsCtrl = $controller('WorldsCtrl', {
      $scope: scope,
      httpService: mockService
    });
  }));

  describe('worlds list in the scope', function () {

    it('should be empty when promise is not fulfilled', function () {
      expect(scope.worlds).not.toBe(undefined);
      expect(scope.worlds.length).toEqual(0);
    });

    it('should be complete when promise is fulfilled', function () {
      scope.$digest();

      expect(scope.worlds.length).toEqual(3);
    });

  });
});
