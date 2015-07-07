'use strict';

var authenticatedRequest = require('./authentication-test-helper');
var INVALID = authenticatedRequest.INVALID;
var VALID_USER = authenticatedRequest.VALID_USER;
var players = require("../components/players");
var teams = require("../components/teams");
var worlds = require("../components/worlds");


describe('When a user IS NOT successfully authenticated... ', function() {

	authenticatedRequest.useAuth(INVALID);

	var verifyAccessDeniedForGET = function(endpoint, done) {
		authenticatedRequest
			.get(endpoint)
			.expect(401)
			.end(function(err, res) {
				if (err) return done(err);
				done();
			});
	}

	var verifyAccessDeniedForPOST = function(endpoint, postingObject, done) {
		authenticatedRequest
			.post(endpoint)
			.send(postingObject)
			.expect(401)
			.end(function(err, res) {
				if (err) return done(err);
				done();
			});
	}

	var verifyAccessDeniedForPUT = function(endpoint, puttingObject, done) {
		authenticatedRequest
			.put(endpoint)
			.send(puttingObject)
			.expect(401)
			.end(function(err, res) {
				if (err) return done(err);
				done();
			});
	}

	var verifyAccessDeniedForDELETE = function(endpoint, done) {
		authenticatedRequest
			.put(endpoint)
			.expect(401)
			.end(function(err, res) {
				if (err) return done(err);
				done();
			});
	}

	describe(' for players... ', function() {
		it('they cannot access GET', function(done){
			verifyAccessDeniedForGET('/api/worlds/world/players', done);
		});
		
		it('they cannot access POST', function(done){
			verifyAccessDeniedForPOST('/api/worlds/world/players', {name: 'Smith',email: 'test@test.smith.com'}, done);
		});
		
		it('they cannot access PUT', function(done){
			verifyAccessDeniedForPUT('/api/worlds/world/players/1234', {name: 'Smith',email: 'test@test.smith.com'}, done);
		});
		
		it('they cannot access DELETE', function(done){
			verifyAccessDeniedForDELETE('/api/worlds/world/players/1234', done);
		});
	});

	describe(' for teams... ', function() {
		it('they cannot access GET', function(done){
			verifyAccessDeniedForGET('/api/worlds/world/teams', done);
		});
		
		it('they cannot access POST', function(done){
			verifyAccessDeniedForPOST('/api/worlds/world/teams', {name: "Pillar", path: '/Pillar'}, done);
		});
		
		it('they cannot access PUT', function(done){
			verifyAccessDeniedForPUT('/api/worlds/world/teams/1234', {name: "Pillar", path: '/Pillar'}, done);
		});
		
		it('they cannot access DELETE', function(done){
			verifyAccessDeniedForDELETE('/api/worlds/world/teams/1234', done);
		});
	});

	describe(' for teams... ', function() {
		it('they cannot access GET', function(done){
			verifyAccessDeniedForGET('/api/worlds/world/teams', done);
		});
		
		it('they cannot access POST', function(done){
			verifyAccessDeniedForPOST('/api/worlds/world/teams', {name: "Pillar", path: '/Pillar'}, done);
		});
		
		it('they cannot access PUT', function(done){
			verifyAccessDeniedForPUT('/api/worlds/world/teams/1234', {name: "Pillar", path: '/Pillar'}, done);
		});
		
		it('they cannot access DELETE', function(done){
			verifyAccessDeniedForDELETE('/api/worlds/world/teams/1234', done);
		});
	});

	describe(' for map... ', function() {
		it('they cannot access GET', function(done){
			verifyAccessDeniedForGET('/api/worlds/world/maps', done);
		});
	});

	describe(' for worlds... ', function() {
		it('they cannot access GET', function(done){
			verifyAccessDeniedForGET('/api/worlds', done);
		});
		
		it('they cannot access POST', function(done){
			verifyAccessDeniedForPOST('/api/worlds', {name: 'Mars'}, done);
		});
	});
});

describe('When a user IS successfully authenticated... ', function() {

	authenticatedRequest.useAuth(VALID_USER);

	var verifyAccessGrantedForGET = function(endpoint, done) {
		authenticatedRequest
			.get(endpoint)
			.expect(200)
			.end(function(err, res) {
				if (err) return done(err);
				done();
			});
	}

	var verifyAccessGrantedForPOST = function(endpoint, postingObject, done) {
		authenticatedRequest
			.post(endpoint)
			.send(postingObject)
			.expect(200)
			.end(function(err, res) {
				if (err) return done(err);
				done();
			});
	}

	var verifyAccessGrantedForPUT = function(endpoint, puttingObject, done) {
		authenticatedRequest
			.put(endpoint)
			.send(puttingObject)
			.expect(200)
			.end(function(err, res) {
				if (err) return done(err);
				done();
			});
	}

	var verifyAccessGrantedForDELETE = function(endpoint, done) {
		authenticatedRequest
			.put(endpoint)
			.expect(200)
			.end(function(err, res) {
				if (err) return done(err);
				done();
			});
	}

	describe(' for players... ', function() {
		var playerId;

		beforeEach(function(done) {
			players.Player
				.create({ name: "John",email: "test@test.com"})
				.then(function(player) {
					playerId = player.id;
					done();
				});
		});

		afterEach(function(done) {
			players.Player.remove({}, done);
		});

		it('they can access GET', function(done){
			verifyAccessGrantedForGET('/api/worlds/world/players', done);
		});
		
		it('they can access POST', function(done){
			verifyAccessGrantedForPOST('/api/worlds/world/players', {name: 'Smith',email: 'test@test.smith.com'}, done);
		});
		
		it('they can access PUT', function(done){
			verifyAccessGrantedForPUT('/api/worlds/world/players/' + playerId, {name: 'Smith',email: 'test@test.smith.com'}, done);
		});
		
		it('they can access DELETE', function(done){
			verifyAccessGrantedForDELETE('/api/worlds/world/players/' + playerId, done);
		});
	});

	describe(' for teams... ', function() {
		var teamPath;

		beforeEach(function(done) {
			teams.Team
				.create({name: "Onstar", path: '/Onstar'})
				.then(function(team) {
					console.log(team);
					teamPath = team.path;
					done();
				});
		});

		afterEach(function(done) {
			teams.Team.remove({}, done);
		});

		it('they can access GET', function(done){
			verifyAccessGrantedForGET('/api/worlds/world/teams', done);
		});
		
		it('they can access POST', function(done){
			verifyAccessGrantedForPOST('/api/worlds/world/teams', {name: "Pillar", path: '/Pillar'}, done);
		});
		
		it('they can access PUT', function(done){
			verifyAccessGrantedForPUT('/api/worlds/world/teams' + teamPath, {name: "Pillar", path: '/Pillar'}, done);
		});
		
		it('they can access DELETE', function(done){
			verifyAccessGrantedForDELETE('/api/worlds/world/teams' + teamPath, done);
		});
	});

	describe(' for map... ', function() {
		it('they can access GET', function(done){
			verifyAccessGrantedForGET('/api/worlds/world/maps', done);
		});
	});

	describe(' for worlds... ', function() {
		beforeEach(function(done) {
			worlds.World.create({name: 'Mars'}, done);
		});

		afterEach(function(done) {
			worlds.World.remove({}, done);
		});

		it('they can access GET', function(done){
			verifyAccessGrantedForGET('/api/worlds', done);
		});
		
		it('they can access POST', function(done){
			verifyAccessGrantedForPOST('/api/worlds', {name: 'Jupiter'}, done);
		});
	});
});
