'use strict';

describe('Http Service', function () {

  beforeEach(module('farseerApp'));

  var service,
      $httpBackend;

  beforeEach(inject(function (httpService, _$httpBackend_) {
    service = httpService;
    $httpBackend = _$httpBackend_;
  }));

  it('should return players data', function() {
    $httpBackend.expectGET('/api/players')
      .respond(['Harry Potter', 'Hermione Granger', 'Ron Weasley']);

    service.getPlayers().then(function(returnedPlayers) {
      expect(returnedPlayers.length).toEqual(3);
      expect(returnedPlayers[0]).toBe('Harry Potter');
      expect(returnedPlayers[1]).toBe('Hermione Granger');
      expect(returnedPlayers[2]).toBe('Ron Weasley');
    });

    $httpBackend.flush();

  });

  it('should add new player', function() {
    var newPlayer = '{"name":"Draco","email":"malfoy@email"}';
    $httpBackend.expectPOST('/api/players', newPlayer).respond(200);

    service.addPlayer(newPlayer).then(function(response) {
      expect(response.status).toBe(200);
    });
    $httpBackend.flush();
  });

  it('should update existing player', function() {
    var smitty = {name: 'Smith', email: 'smitty@email', _id: 'smitty123'};

    $httpBackend.expectPUT('/api/players/' + smitty._id, smitty).respond(200);

    service.update(smitty).then(function(response) {
      expect(response.status).toBe(200);
    });

    $httpBackend.flush();
  });

});
