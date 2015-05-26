'use strict';

var page = require('./players-map.po');
var setup = require('../common/data-setup');
var $ = require('jquery');

describe('The playersMap page has images for each player on it, and... ', function() {

	beforeEach(function(done) {
		setup.purgeData()
			.then(setup.addTeam('team1', '/team1'))
			.then(setup.addTeam('team2', '/team1/team2'))
			.then(setup.addPlayer('p0', 'p0@somewhere.com'))
			.then(setup.addPlayer('p1', 'p1@somewhere.com', '/team1'))
			.then(setup.addPlayer('p2', 'p2@somewhere.com', '/team1/team2'))
			.then(browser.get('playersMap'))
			.then(done);
	});

	afterEach(function(done) {
		setup.purgeData().then(done);
	});

	it('the images are retrieved from gravatar.', function() {
		expect(page.playerImages.count()).toBe(3);
		for (var i = 0; i < 3; i++) {
			expect(page.imageSrc(page.playerImages.get(i))).toContain('gravatar.com/avatar');
		}
	});
});