'use strict';

describe('Controller: PlayersCtrl', function () {

  beforeEach(module('farseerApp'));

  var PlayersCtrl,
      scope,
      $httpBackend,
      mockService;

  beforeEach(inject(function (_$httpBackend_, $controller, $rootScope, $q) {
    $httpBackend = _$httpBackend_;
    scope = $rootScope.$new();

    mockService = {
      getPlayers: function() {
        var deferred = $q.defer();
        deferred.resolve(['Harry Potter', 'Hermione Granger', 'Ron Weasley']);
        return deferred.promise;
      }
    };

    PlayersCtrl = $controller('PlayersCtrl', {
      $scope: scope,
      httpService: mockService
    });

  }));

  it('should attach empty list of players to the scope when promise is not fulfilled', function() {
    expect(scope.players).not.toBe(undefined);
    expect(scope.players.length).toEqual(0);
  });

  it('should attach list of players to the scope', function() {
    scope.$digest();

    expect(scope.players.length).toEqual(3);
    expect(scope.players[0]).toBe('Harry Potter');
    expect(scope.players[1]).toBe('Hermione Granger');
    expect(scope.players[2]).toBe('Ron Weasley');
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
