'use strict';

describe('Controller: PlayersCtrl', function () {

  beforeEach(module('farseerApp'));

  var PlayersCtrl,
      scope,
      mockService,
      addedPlayer;

  beforeEach(inject(function ($controller, $rootScope, $q) {
    scope = $rootScope.$new();

    mockService = {
      getPlayers: function() {
        var deferred = $q.defer();
        deferred.resolve(['Harry Potter', 'Hermione Granger', 'Ron Weasley']);
        return deferred.promise;
      },
      addPlayer: function(newPlayer) {
        addedPlayer = newPlayer;

        var deferred = $q.defer();
        deferred.resolve();
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

  it('should add new player', function() {
    var newPlayer = '{"name":"Draco","email":"malfoy@email"}';
    scope.newPlayer = newPlayer;
    scope.addPlayer();

    scope.$digest();
    expect(addedPlayer).toBe(newPlayer);
  });

});
