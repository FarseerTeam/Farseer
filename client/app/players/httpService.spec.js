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

});
