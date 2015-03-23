'use strict';

describe('Controller: PlayersCtrl', function () {

  beforeEach(module('farseerApp'));

  var PlayersCtrl,
      scope,
      mockService,
      addedPlayer,
      updatedPlayer;
  var rejectAddPlayer = false;
  var rejectUpdatePlayer = false;
  var expectedErrorMessage = 'Error Message, Error Message!';

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
          deferred.resolve({data: newPlayer});
        }

        return deferred.promise;
      },
      update: function(player) {
        updatedPlayer = player;

        var deferred = $q.defer();
        if(rejectUpdatePlayer) {
          deferred.reject({data: {message: expectedErrorMessage}});
        } else {
          deferred.resolve();
        }
        return deferred.promise;
      },
      getTeamToPlayersMap: function() {
        var deferred = $q.defer();
        deferred.resolve([{team: 'Gryffindor', players: [{name: 'Harry Potter'}]}, {team: undefined, players: [{name: 'Poppy Pomfrey'}, {name: 'Irma Pince'}]}]);
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

  describe('team-to-players map attached to the scope: ', function() {
    it('should be empty when promise is not fulfilled', function() {
      expect(scope.teamPlayersMap).not.toBe(undefined);
      expect(scope.teamPlayersMap.length).toEqual(0);
    });

    it('should be complete when promise if fulfilled', function() {
      scope.$digest();

      expect(scope.teamPlayersMap.length).toEqual(2);

      expect(scope.teamPlayersMap[0].team).toBe('Gryffindor');
      expect(scope.teamPlayersMap[0].players.length).toBe(1);
      expect(scope.teamPlayersMap[0].players[0].name).toBe('Harry Potter');

      expect(scope.teamPlayersMap[1].team).toBe(undefined);
      expect(scope.teamPlayersMap[1].players.length).toBe(2);
      expect(scope.teamPlayersMap[1].players[0].name).toBe('Poppy Pomfrey');
      expect(scope.teamPlayersMap[1].players[1].name).toBe('Irma Pince');
    });
  });

  describe('adding new player', function() {
    var newPlayer;

    beforeEach(function() {
      newPlayer = {name:'Draco',email:'malfoy@email'};
      scope.newPlayer = newPlayer;
    });

    it('should add new player', function() {
      scope.addPlayer();
      scope.$digest();

      expect(addedPlayer).toBe(newPlayer);
    });

    it('should add new player to the empty list of players in scope when successful', function() {
      scope.$digest();
      scope.players = [];

      scope.addPlayer();
      scope.$digest();

      expect(scope.players.length).toBe(1);
      expect(scope.players[0]).toBe(newPlayer);
    });

    it('should add new player to the list of existing players in scope when successful', function() {
      scope.addPlayer();
      scope.$digest();

      expect(scope.players.length).toBe(4);
      expect(_.last(scope.players)).toBe(newPlayer);
    });

    it('should pass success message to scope when add is successful', function() {
      scope.newPlayer.error = true;
      scope.addPlayer();
      scope.$digest();

      expect(scope.handler).not.toBe(undefined);
      expect(scope.handler.message).toBe('Success');
      expect(scope.handler.error).toBe(false);
      expect(scope.newPlayer.error).toBe(false);
    });

    it('should pass error message to scope when add is rejected', function() {
      scope.newPlayer.error = false;
      rejectAddPlayer = true;

      scope.addPlayer();
      scope.$digest();

      expect(scope.handler).not.toBe(undefined);
      expect(scope.handler.message).toBe(expectedErrorMessage);
      expect(scope.handler.error).toBe(true);
      expect(scope.newPlayer.error).toBe(true);
    });
  });

  describe('updating existing player', function() {
    var existingPlayer;

    beforeEach(function() {
      existingPlayer = {name: 'smitty', email: 'smith@email'};
    });

    it('should update player', function() {
      scope.update(existingPlayer);
      scope.$digest();

      expect(updatedPlayer).toBe(existingPlayer);
    });

    it('should pass success message to scope when update is successful', function() {
      scope.update(existingPlayer);
      scope.$digest();

      expect(scope.handler).not.toBe(undefined);
      expect(scope.handler.message).toBe('Success');
      expect(existingPlayer.error).toBe(false);
    });

    it('should pass error message to scope when update is rejected', function() {
      rejectUpdatePlayer = true;

      scope.update(existingPlayer);
      scope.$digest();

      expect(scope.handler).not.toBe(undefined);
      expect(scope.handler.message).toBe(expectedErrorMessage);
      expect(existingPlayer.error).toBe(true);
    });

  });

});
