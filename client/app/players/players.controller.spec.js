'use strict';

describe('Controller: PlayersCtrl', function () {

  beforeEach(module('farseerApp'));

  var PlayersCtrl,
      scope,
      mockService,
      mockTimeout,
      addedPlayer,
      updatedPlayer;
  var subteamPath = '/Hogwarts/Ravenclaw';
  var rejectAddPlayer = false;
  var rejectUpdatePlayer = false;
  var timeoutWasCalledWithTime = -1;
  var shouldCallTimeoutFunctionImmediately = false;
  var expectedErrorMessage = 'Error Message, Error Message!';
  var teamToPlayersMapFromServer = [{team: 'Gryffindor', path:'/Gryffindor' , players: [{name: 'Harry Potter', _team:'/Gryffindor'}]}, {/*team: undefined,*/ players: [{name: 'Poppy Pomfrey'}, {name: 'Irma Pince'}]}, {team: 'Ravenclaw', path:'/Ravenclaw' , players: [{name: 'Penelope Clearwater', _team:'/Ravenclaw'}]}];
  var subteamPlayersMapFromServer = [{team: 'Ravenclaw', path: '/Hogwarts/Raveclaw', players: ['Padma Patil'], subteams: []}];
  var cloneObject = function(objectToClone){return JSON.parse(JSON.stringify(objectToClone));};

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
      getTeamToPlayersMap: function(path) {
        var deferred = $q.defer();
        if(path === subteamPath) {
          deferred.resolve(cloneObject(subteamPlayersMapFromServer));
        } else {        
          deferred.resolve(cloneObject(teamToPlayersMapFromServer));
        }
        return deferred.promise;
      } 
    };

    mockTimeout = function(functionToPerform, timeout) {
      timeoutWasCalledWithTime = timeout;
      if (shouldCallTimeoutFunctionImmediately) {
        functionToPerform();
      }
    };

    PlayersCtrl = $controller('PlayersCtrl', {
      $scope: scope,
      $timeout: mockTimeout,
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
      expect(scope.teamPlayersMap).toEqual(teamToPlayersMapFromServer);
    });
  });

  describe('the error object attached to the scope: ', function() {
    it('should be undefined when the page is loaded', function() {
      expect(scope.error).toBe(undefined);
      scope.$digest();
      expect(scope.error).toBe(undefined);
    });
  });

  describe('going to a subteam view', function() {
    it('should only display desired subteam map', function() {
      scope.goToTeam(subteamPath);
      scope.$digest();
      expect(scope.teamPlayersMap).toEqual(subteamPlayersMapFromServer);
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

    beforeEach(function() {
      scope.update(updateWasNeverCalled);
      scope.$digest();
      playerWithTeam = scope.teamPlayersMap[0].players[0];
      playerWithNoTeam = scope.teamPlayersMap[1].players[0];
      originalTeam = scope.teamPlayersMap[0];
      targetTeam = scope.teamPlayersMap[2];
      undefinedTeam = scope.teamPlayersMap[1];
    });

    it('the player is updated (using the httpService) with the new team, when moving from one team to another.', function() {
      scope.playerDroppedIntoTeamCB(playerWithTeam, targetTeam);
      scope.$digest();
      expect(updatedPlayer.name).toBe(playerWithTeam.name);
      expect(updatedPlayer._team).toBe(targetTeam.path);
    }); 

    it('the player is updated (using the httpService) with the new team, when moving from no team (the undefined team) to a team.', function() {
      scope.playerDroppedIntoTeamCB(playerWithNoTeam, targetTeam);
      scope.$digest();
      expect(updatedPlayer.name).toBe(playerWithNoTeam.name);
      expect(updatedPlayer._team).toBe(targetTeam.path);
    }); 

    it('the player is updated with an null team (not undefined), when moving from a team to no team (the undefined team).', function() {
      scope.playerDroppedIntoTeamCB(playerWithTeam, undefinedTeam);
      scope.$digest();
      expect(updatedPlayer.name).toBe(playerWithTeam.name);
      expect(updatedPlayer._team).toBe(null);
    }); 

    it('when moved to the same team, no update is made.', function() {
      scope.playerDroppedIntoTeamCB(playerWithTeam, originalTeam);
      scope.$digest();
      expect(updatedPlayer).toBe(updateWasNeverCalled);
    }); 

    it('when an update happens, a copy of the updated player is returned.', function() {
      var returnedValue = scope.playerDroppedIntoTeamCB(playerWithTeam, targetTeam);
      scope.$digest();
      expect(returnedValue).toBe(updatedPlayer);
    });

    it('when no update is needed (moved within the same team), the player is returned unchanged.', function() {
      var returnedValue = scope.playerDroppedIntoTeamCB(playerWithTeam, originalTeam);
      scope.$digest();
      expect(returnedValue).toBe(playerWithTeam);
    }); 

    describe('when the update fails... ', function(){

      beforeEach(function() {
        rejectUpdatePlayer = true;
        scope.teamPlayersMap = [];
      });

      it('the entire map is reloaded.', function() {
        scope.playerDroppedIntoTeamCB(playerWithTeam, targetTeam);
        scope.$digest();
        expect(scope.teamPlayersMap).toEqual(teamToPlayersMapFromServer);
      });

      it('the error object in scope is updated.', function() {
        scope.playerDroppedIntoTeamCB(playerWithTeam, targetTeam);
        scope.$digest();
        expect(scope.error).not.toBe(undefined);
        expect(scope.error.message).not.toBe(undefined);
      });

      it('the error object disappears after a 3 seconds.', function() {
        shouldCallTimeoutFunctionImmediately = true;
        scope.playerDroppedIntoTeamCB(playerWithTeam, targetTeam);
        scope.$digest();

        expect(timeoutWasCalledWithTime).toEqual(3000);
        expect(scope.error).toBe(undefined);
      });

    });

  });

});
