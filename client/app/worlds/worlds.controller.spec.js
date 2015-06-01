'use strict';

describe('Controller: WorldsCtrl', function () {

  // load the controller's module
  beforeEach(module('farseerApp'));

  var WorldsCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    WorldsCtrl = $controller('WorldsCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
