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
	var aTeam = null;
	beforeEach(function(done) {
		teams.Team.remove({});
		teams.Team.create({name: "Ford"}, function(err, doc){
				aTeam = doc;
				done();
		});
	});

	it("contains names", function() {
		expect(aTeam).to.be.ok();
		aTeam.save(function(err, doc) {
			expect(err).to.be(null);
			expect(doc.name).equal(aTeam.name);
		});
	});
	it("that is unique ", function(){
		var teamFailed = new teams.Team();
		teamFailed.name = aTeam.name;
		teamFailed.save(function(err){
			expect(err).to.be.ok();
			expect(err.code).to.be.equal(11000);
		});
	});
	afterEach(function(done) {
		teams.Team.remove({}, function(){
			done();
		});
	});
});