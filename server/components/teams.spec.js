/*
	{team: 'fireNation', subteams: [{team: 'royalty', players: [{name: 'Zuko'}, {name: 'Iroh'}]}]}]
	Teams contains Names that are unique
	Teams contains other Teams called subteams
	Teams contains other Teams called subteams that have other subteams
	
	Players are part of one team


*/

var mongoose = require("mongoose");
var expect = require("expect.js");
var teams = require("./teams");
var should = require('should');
var config = require('../config/environment/test');

var dataService = require('./dataService')

dataService.connect();

describe("Teams", function() {
	var theTeam = null;
	beforeEach(function(done) {
		teams.Team.remove({});
		teams.Team.create({
			name: "Ford"
		}, function(err, doc) {
			theTeam = doc;
			done();
		});
	});

	it("contains names", function() {
		expect(theTeam).to.be.ok();
		theTeam.save(function(err, doc) {
			expect(err).to.be(null);
			expect(doc.name).equal(theTeam.name);
		});
	});
	it("that is unique ", function() {
		var teamFailed = new teams.Team();
		teamFailed.name = theTeam.name;
		teamFailed.save(function(err) {
			expect(err).to.be.ok();
			expect(err.code).to.be.equal(11000);
		});
	});
	it("contains other teams", function() {

		var subTeam = new teams.Team();
		subTeam.parent = theTeam;
		subTeam.save(function(err) {
			expect(err).to.be(null);
			theTeam.getChildren(function(err, childrenTeam) {
				expect(childrenTeam).to.be.an('array');
				expect(childrenTeam[0]).to.eql(subTeam);
			});
		});
	});

	afterEach(function(done) {
		teams.Team.remove({}, function() {
			done();
		});
	});
});