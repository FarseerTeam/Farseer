'use strict';

var page = require('./players-map.po');
var setup = require('../common/data-setup');

describe('The playersMap page has players on it, and... ', function() {

	describe('when there are multiple players belonging to several teams... ', function() {

		//more cases pending
	});

	describe('when there is a player with no team assigned... ', function() {

		beforeEach(function(done) {
			setup.addPlayer('newPlayer', 'some@gmail.com')
				.then(browser.get('playersMap'))
				.then(done);
		});

		afterEach(function(done){
			setup.purgeData().then(done);
		});

		it('the player is placed in a group titled "unassigned"', function() {
      var unassignedTeam = page.team('unassigned');
      expect(page.playerOnTeam(unassignedTeam, 'newPlayer').isPresent()).toBe(true);
		});
	});

});
