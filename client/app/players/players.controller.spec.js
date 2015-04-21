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
        deferred.resolve([{team: 'Gryffindor', path:'/Gryffindor' , players: [{name: 'Harry Potter', _team:'/Gryffindor'}]}, {team: undefined, players: [{name: 'Poppy Pomfrey'}, {name: 'Irma Pince'}]}, {team: 'Ravenclaw', path:'/Ravenclaw' , players: [{name: 'Penelope Clearwater', _team:'/Ravenclaw'}]}]);
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

      expect(scope.teamPlayersMap.length).toEqual(3);

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

  describe('when a player is dropped onto a team... ', function() {

    var playerWithTeam;
    var playerWithNoTeam;
    var originalTeam;
    var targetTeam;
    var undefinedTeam;
    var updateWasNeverCalled = {name: 'neverCalled'};
    var index = 'does not matter, but would be the index of the new location of the player in the new team'; 
    var event = 'does not matter'; 

    beforeEach(function() {
      scope.update(updateWasNeverCalled);
      scope.$digest();
      playerWithTeam = scope.teamPlayersMap[0].players[0];
      playerWithNoTeam = scope.teamPlayersMap[1].players[0];
      originalTeam = scope.teamPlayersMap[0];
      targetTeam = scope.teamPlayersMap[2];
      undefinedTeam = scope.teamPlayersMap[1];
      scope.update(updateWasNeverCalled);
    });

    it('the player is updated (using the httpService) with the new team, when moving from one team to another.', function() {
      scope.playerDroppedIntoTeamCB(playerWithTeam, targetTeam, index, event);
      scope.$digest();
      expect(updatedPlayer.name).toBe(playerWithTeam.name);
      expect(updatedPlayer._team).toBe(targetTeam.path);
    }); 

    it('the player is updated (using the httpService) with the new team, when moving from no team (the undefined team) to a team.', function() {
      scope.playerDroppedIntoTeamCB(playerWithNoTeam, targetTeam, index, event);
      scope.$digest();
      expect(updatedPlayer.name).toBe(playerWithNoTeam.name);
      expect(updatedPlayer._team).toBe(targetTeam.path);
    }); 

    it('the player is updated with an null team (not undefined), when moving from a team to no team (the undefined team).', function() {
      scope.playerDroppedIntoTeamCB(playerWithTeam, undefinedTeam, index, event);
      scope.$digest();
      expect(updatedPlayer.name).toBe(playerWithTeam.name);
      expect(updatedPlayer._team).toBe(null);
    }); 

    it('when moved to the same team, no update is made.', function() {
      scope.playerDroppedIntoTeamCB(playerWithTeam, originalTeam, index, event);
      scope.$digest();
      expect(updatedPlayer).toBe(updateWasNeverCalled);
    }); 

    it('when an update happens, a copy of the updated player is returned.', function() {
      var returnedValue = scope.playerDroppedIntoTeamCB(playerWithTeam, targetTeam, index, event);
      scope.$digest();
      expect(returnedValue).toBe(updatedPlayer);
    });

    // it('when the update fails, some awesome error handling happens.', function() {

    // });

    it('when no update is needed (moved within the same team), the player is returned unchanged.', function() {
      var returnedValue = scope.playerDroppedIntoTeamCB(playerWithTeam, originalTeam, index, event);
      scope.$digest();
      expect(returnedValue).toBe(playerWithTeam);
    }); 

  });

});
