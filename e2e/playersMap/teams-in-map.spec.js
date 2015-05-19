'use strict';

var setup = require('../common/data-setup');
var page = require('./players-map.po');

describe('The playersMap page has teams on it, and... ', function() {

	describe('when there are no teams... ', function() {

		describe('and there are no players... ', function() {

			beforeEach(function(done){
				browser.get('#/playersMap')
					.then(done);
			});

			it('then there is no team displayed on screen.', function() {
				expect(page.teams.count()).toBe(0);
			});
		});

		describe('and there is at least one player... ', function(){

			beforeEach(function(done) {
				setup.addPlayer({name:'harry', email:'potter@gmail.com'})
					.then(browser.get('#/playersMap'))
					.then(done);
			});

			afterEach(function(done) {
				setup.purgeData().then(done);
			});

			it('there is a single team displayed on screen.', function(done) {
				// console.log('\n\npage: ' + page + '\n');
				// console.log('page.teams: ' + page.teams + '\n');
				// for (var p in page.teams) {
				// 	console.log("-" + p);
				// }

				// ///////////////////
				expect(page.teams.count()).toBe(1);
				done();
			});

			it('the team is assigned the name "unassigned"', function(done) {
				expect(page.teamNameFor(page.teams.get(0)).getText()).toBe('unassigned');
				done();
			});
		});
	});

	describe('when there are N teams defined with no parent teams... ', function() {


	});

	describe('when there is a team defined that has a parent team... ', function() {


	});
});