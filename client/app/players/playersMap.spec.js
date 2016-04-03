'use strict';

describe('Attempt to test jade template', function () {

  beforeEach(module('farseerApp'));
  beforeEach(module('app/players/playersMap.html'));

  var PlayersCtrl,
      scope,
      compile,
      pageHtml,
      processedHtml;
  var teamToPlayersMapFromServer = [{team: 'Gryffindor', path:'/Gryffindor' , players: [{name: 'Harry Potter', email:'hp@gmail.com', _team:'/Gryffindor'}]}, {/*team: undefined,*/ players: [{name: 'Poppy Pomfrey', email:'pp@gmail.com'}, {name: 'Irma Pince', email:'ip@gmail.com'}]}, {team: 'Ravenclaw', path:'/Ravenclaw' , players: [{name: 'Penelope Clearwater', email:'pc@gmail.com', _team:'/Ravenclaw'}]}];
  var cloneObject = function(objectToClone){return JSON.parse(JSON.stringify(objectToClone));};
  var $httpBackend;

  beforeEach(inject(function ($controller, $rootScope, $q, $templateCache, $compile, _$httpBackend_) {
    scope = $rootScope.$new();
    pageHtml = $templateCache.get('app/players/playersMap.html');
    compile = $compile;
    $httpBackend = _$httpBackend_;

    var mockService = {
      getPlayers: function() {
        var deferred = $q.defer();
        deferred.resolve([]);
        return deferred.promise;
      },
      getTeamToPlayersMap: function() {
        var deferred = $q.defer();
        deferred.resolve(cloneObject(teamToPlayersMapFromServer));
        return deferred.promise;
      },
      getWorld: function() {
          var deferred = $q.defer();
          deferred.resolve({ id: 'pillar', name: 'Pillar' });
          return deferred.promise;
      }
    };

    PlayersCtrl = $controller('PlayersCtrl', {
      $scope: scope,
      httpService: mockService
    });

  }));

  beforeEach(function() {
     $httpBackend.expectGET('app/players/players-common/players-common.html').respond('');
     processedHtml = compile(pageHtml)(scope);
     scope.$digest();
  });

  it('there is one image for each player from teamToPlayersMap', function() {
     expect(processedHtml.find('img').length).toEqual(4);
  });

  it('each image is retrieved from gravatar.coms avatar service', function() {
    var allImages = processedHtml.find('img');
    for (var i = 0; i < allImages.length; i++) {
      expect(allImages[i].getAttribute('src')).toContain('gravatar.com/avatar');
    }
  });

});
