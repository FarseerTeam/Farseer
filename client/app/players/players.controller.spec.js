'use strict';

describe('Controller: PlayersCtrl', function () {

  beforeEach(module('farseerApp'));

  var PlayersCtrl,
      scope,
      $httpBackend;

  beforeEach(inject(function (_$httpBackend_, $controller, $rootScope) {
    $httpBackend = _$httpBackend_;
    scope = $rootScope.$new();
    PlayersCtrl = $controller('PlayersCtrl', {
      $scope: scope
    });

    $httpBackend.expectGET('/api/players')
      .respond(['Harry Potter', 'Hermione Granger', 'Ron Weasley']);

  }));

  it('should attach a list of players to the scope', function () {
    $httpBackend.flush();
    expect(scope.players.length).toEqual(3);
  });

  describe('adding new player', function() {

    it('should post new player to the api', function () {
      var newPlayer = '{"name":"Draco","email":"malfoy@email"}';
      scope.newPlayer = newPlayer;
      $httpBackend.expectPOST('/api/players', newPlayer).respond(200);

      scope.addPlayer();
      $httpBackend.flush();
    });

  });

});
