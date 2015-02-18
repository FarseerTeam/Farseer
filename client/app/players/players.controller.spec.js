'use strict';

describe('Controller: PlayersCtrl', function () {

  beforeEach(module('farseerApp'));

  var PlayersCtrl,
      scope,
      mockService,
      addedPlayer;
  var rejectAddPlayer = false;
  var expectedErrorMessage = 'Add player error message';

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

        if(rejectAddPlayer) {
          deferred.reject({data: {message: expectedErrorMessage}});
        } else {
          deferred.resolve();
        }

        return deferred.promise;
      }
    };

    PlayersCtrl = $controller('PlayersCtrl', {
      $scope: scope,
      httpService: mockService
    });

  }));

  describe('players list attached to the scope', function() {
    it('should be empty when promise is not fulfilled', function() {
      expect(scope.players).not.toBe(undefined);
      expect(scope.players.length).toEqual(0);
    });

    it('should be complete when promise if fulfilled', function() {
      scope.$digest();

      expect(scope.players.length).toEqual(3);
      expect(scope.players[0]).toBe('Harry Potter');
      expect(scope.players[1]).toBe('Hermione Granger');
      expect(scope.players[2]).toBe('Ron Weasley');
    });
  });

  describe('adding new player', function() {
    var newPlayer;

    beforeEach(function() {
      newPlayer = '{"name":"Draco","email":"malfoy@email"}';
      scope.newPlayer = newPlayer;
    });

    it('should add new player', function() {
      scope.addPlayer();
      scope.$digest();

      expect(addedPlayer).toBe(newPlayer);
    });

    it('should pass success message to scope when add is successful', function() {
      scope.addPlayer();
      scope.$digest();

      expect(scope.addPlayerResult).not.toBe(undefined);
      expect(scope.addPlayerResult.message).toBe('Success');
    });

    it('should pass error message to scope when add is rejected', function() {
      rejectAddPlayer = true;

      scope.addPlayer();
      scope.$digest();

      expect(scope.addPlayerResult).not.toBe(undefined);
      expect(scope.addPlayerResult.message).toBe(expectedErrorMessage);
    });
  });

});
