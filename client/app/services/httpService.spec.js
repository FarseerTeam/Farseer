'use strict';

describe('Http Service', function () {

  beforeEach(module('farseerApp'));

  var service, $httpBackend;

  beforeEach(inject(function (httpService, _$httpBackend_) {
    service = httpService;
    $httpBackend = _$httpBackend_;
  }));

  var defaultWorldName = 'pandora';

  describe('player services', function() {
    it('should return players data', function () {

      $httpBackend.expectGET('/api/worlds/' + defaultWorldName + '/players')
        .respond(['Harry Potter', 'Hermione Granger', 'Ron Weasley']);

      service.getPlayers(defaultWorldName).then(function (returnedPlayers) {
        expect(returnedPlayers.length).toEqual(3);
        expect(returnedPlayers[0]).toBe('Harry Potter');
        expect(returnedPlayers[1]).toBe('Hermione Granger');
        expect(returnedPlayers[2]).toBe('Ron Weasley');
      });

    });

    it('should add new player', function () {
      var newPlayer = {
        name: 'Draco',
        email: 'malfoy@email',
        world: defaultWorldName
      };

      var playersUrl = '/api/worlds/' + defaultWorldName + '/players';
      $httpBackend.expectPOST(playersUrl, newPlayer).respond(200);

      service.addPlayer(newPlayer).then(function (response) {
        expect(response.status).toBe(200);
      });
    });

    it('should update existing player', function () {
      var smitty = { name: 'Smith', email: 'smitty@email', _id: 'smitty123', world: defaultWorldName };

      $httpBackend.expectPUT('/api/worlds/' + smitty.world + '/players/' + smitty._id, smitty).respond(200);

      service.update(smitty).then(function (response) {
        expect(response.status).toBe(200);
      });
    });
  });

  describe('player map services', function() {
    it('should return team-to-players map data', function () {
      var expectedResult = [{ team: 'Gryffindor', players: [{ name: 'Harry Potter' }] }];
      $httpBackend.expectGET('/api/worlds/' + defaultWorldName +'/maps').respond(expectedResult);

      service.getTeamToPlayersMap(null, defaultWorldName).then(function (returnedMap) {
        expect(returnedMap).toEqual(expectedResult);
      });
    });

    it('should return team-to-players map data for a specified subteam', function () {
      var expectedResult = [{ team: 'Ravenclaw', players: [{ name: 'Luna Lovegood' }] }];
      $httpBackend.expectGET('/api/worlds/' + defaultWorldName + '/maps/Hogwarts/Ravenclaw').respond(expectedResult);

      service.getTeamToPlayersMap('/Hogwarts/Ravenclaw', defaultWorldName).then(function (returnedMap) {
        expect(returnedMap).toEqual(expectedResult);
      });
    });
  });

  describe('world services', function() {

    it('should return list of worlds', function () {
      $httpBackend.expectGET('/api/worlds')
        .respond(['Hogwarts', 'Beauxbatons', 'Durmstrang']);

      service.getWorlds().then(function (returnedWorlds) {
        expect(returnedWorlds.length).toEqual(3);
        expect(returnedWorlds[0]).toBe('Hogwarts');
        expect(returnedWorlds[1]).toBe('Beauxbatons');
        expect(returnedWorlds[2]).toBe('Durmstrang');
      });
    });

    it('should return requested world', function() {
        $httpBackend.expectGET('/api/worlds/durmstrang')
            .respond('Durmstrang');

        service.getWorld('durmstrang').then(function(returnedWorld) {
            expect(returnedWorld).toBe('Durmstrang');
        });
    });

    it('should add new world', function () {
      var newWorld = '{"id":"starcraft"}';
      $httpBackend.expectPOST('/api/worlds', newWorld).respond(200);

      service.addWorld(newWorld).then(function (response) {
        expect(response.status).toBe(200);
      });
    });

    it('should return modified world on world update', function() {
      var worldId = 'somewhere';
      var updatedWorldName = 'supername';
      $httpBackend.expectPUT('/api/worlds/', {worldId: worldId, updatedWorldName: updatedWorldName}).respond(200);

      service.updateWorld(worldId, updatedWorldName).then(function(response) {
        expect(response.status).toBe(200);
      });
    });

    it('should remove a world on world delete', function(){
      var worldId = 'somewhere';
      $httpBackend.expectDELETE('/api/worlds').respond(200);

      service.deleteWorld(worldId).then(function(response){
        expect(response.status).toBe(200);
      });
    });
  });
});
