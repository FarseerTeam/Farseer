'use strict';

describe('Controller: PlayersCtrl', function () {

  // load the controller's module
  beforeEach(module('farseerApp'));

  var PlayersCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PlayersCtrl = $controller('PlayersCtrl', {
      $scope: scope
    });
  }));

  it('should provide a list of players', function () {
    expect(scope.players.length).toEqual(3);
  });
});
