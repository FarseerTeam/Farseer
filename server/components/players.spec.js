/*jshint expr: true*/
var mongoose = require("mongoose");
var players = require("./players");
var teams = require("./teams");
var should = require('should');
var config = require('../config/environment/test');

var dataService = require('./dataService')

dataService.connect();


describe("Players", function() {
	//holds a players to use in the each test
	var currentCustomer = null;
	beforeEach(function(done) {

		//add some test data
		players.Player.create({
			name: "John",
			email: "test@test.com"
		}, function(err, doc) {
			currentCustomer = doc;
			done();
		});
	});
	it("can be retrieved by email", function(done) {
		players.findByEmail(currentCustomer.email, function(doc) {
			doc.email.should.equal(currentCustomer.email);
			done();
		}, function(e) {});
	});
	afterEach(function(done) {
		players.Player.remove({}, function() {
			done();
		});
	});

	describe("has an optional", function() {
		it("team reference", function(done) {
			var aTeam = {
				name: "Ford"
			};
			teams.Team.create(aTeam,
				function(err, team) {
					should(team._id).be.ok;
					var thePlayer = {
						name: "AJohn",
						email: "Atest@test.com",
						_team: team
					};

					players.Player.create(thePlayer, function(err, doc) {
						should(err).not.be.ok;
						should(team._id.equals(doc._team)).be.truthy;
						done();
					});
				});
		});


		afterEach(function(done) {
			players.Player.remove({}, function() {
				teams.Team.remove({}, function() {
					done();
				})
			});
		});

	});

});
