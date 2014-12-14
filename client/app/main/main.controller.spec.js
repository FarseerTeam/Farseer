'use strict';

describe('Controller: MainCtrl', function () {

  // load the controller's module
  beforeEach(module('farseerApp'));

  var MainCtrl,
      scope,
      $location;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, _$location_) {
    $location = _$location_;

    scope = $rootScope.$new();
    MainCtrl = $controller('MainCtrl', {
      $scope: scope
    });
  }));

  it('should redirect to players', function () {
    expect($location.path()).toBe('/players');
  });
});
