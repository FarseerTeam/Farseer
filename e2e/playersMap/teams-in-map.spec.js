'use strict';

var setup = require('../common/data-setup');
var page = require('./players-map.po');
var RSVP = require('rsvp');

describe('The playersMap page has teams on it, and... ', function() {

	describe('when there are no teams... ', function() {

		describe('and there are no players... ', function() {

			beforeEach(function(done){
				browser.get('playersMap')
					.then(done);
			});

			it('then there is no team displayed on screen.', function() {
				expect(page.allTeams.count()).toBe(0);
			});
		});

		describe('and there is at least one player... ', function(){

			beforeEach(function(done) {
				setup.addPlayer('harry', 'potter@gmail.com')
					.then(browser.get('playersMap'))
					.then(done);
			});

			afterEach(function(done) {
				setup.purgeData().then(done);
			});

			it('there is a single team displayed on screen.', function() {
				expect(page.allTeams.count()).toBe(1);
			});

			it('the team is assigned the name "unassigned"', function() {
				expect(page.team('unassigned')).toBeDefined();
			});
		});
	});

	describe('there is a team with no players... ', function(){
		
		beforeEach(function(done) {
			setup.addTeam('team1', '/team1')
				.then(browser.get('playersMap'))
				.then(done);
		});

		afterEach(function(done) {
			setup.purgeData().then(done);
		});

		it('the team is not shown on screen', function() {
			expect(page.allTeams.count()).toBe(0);
		});
	}); 

	describe('when there are N teams defined with no parent teams (but with players)... ', function() {

		beforeEach(function(done) {
			setup.addTeam('team1', '/team1')
				.then(setup.addTeam('team2', '/team2'))
				.then(setup.addPlayer('a', 'amail', '/team1'))
				.then(setup.addPlayer('b', 'bmail', '/team2'))
				.then(browser.get('playersMap'))
				.then(done);
		});

		afterEach(function(done) {
			setup.purgeData().then(done);
		});

		it('every team is displayed on screen.', function(){
			expect(page.allTeams.count()).toBe(2);
		});

		it('each team name is displayed on screen.', function(done){
			RSVP.hash({
				first: page.teamNameFor(page.allTeams.get(0)),
				second: page.teamNameFor(page.allTeams.get(1))
			}).then(function(teamNames){
				expect(teamNames.first === 'team1' || teamNames.first == 'team2');
				expect(teamNames.second === 'team1' || teamNames.second == 'team2');
			}).then(done);
		});
	});

	describe('when there is a team defined that has a parent team... ', function() {
		
		beforeEach(function(done) {
			setup.addTeam('outerTeam', '/outerTeam')
				.then(setup.addTeam('innerTeam', '/outerTeam/innerTeam'))
				.then(setup.addPlayer('a', 'amail', '/outerTeam'))
				.then(setup.addPlayer('b', 'bmail', '/outerTeam/innerTeam'))
				.then(browser.get('playersMap'))
				.then(done);
		});

		afterEach(function(done) {
			setup.purgeData().then(done);
		});

		it('every team is displayed on screen.', function(){
			expect(page.allTeams.count()).toBe(2);
		});

		it('the child team is held inside of the parent on screen.', function(){
			expect(page.childTeamsOf('outerTeam').count()).toBe(1);
			expect(page.teamNameFor(page.childTeamsOf('outerTeam').get(0))).toBe('innerTeam');
		});

	});

	describe('when there are parent teams having no players... ', function() {

		beforeEach(function(done) {
			setup.addTeam('outerTeam', '/outerTeam')
				.then(setup.addTeam('middleTeam', '/outerTeam/middleTeam'))
				.then(setup.addTeam('innerTeam', '/outerTeam/middleTeam/innerTeam'))
				.then(setup.addPlayer('a', 'amail', '/outerTeam/middleTeam/innerTeam'))
				.then(browser.get('playersMap'))
				.then(done);
		});

		afterEach(function(done) {
			setup.purgeData().then(done);
		});

		it('the parent teams are still shown on screen', function(){
			expect(page.allTeams.count()).toBe(3);
		});

	});
});