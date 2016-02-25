'use strict'
var players = require('../../server/components/players');
var teams = require('../../server/components/teams');
var worlds = require('../../server/components/worlds');
var setup = require('./data-setup');
var dataService = require('../../server/components/dataService');

describe('The data-setup module... ', function() {

	dataService.connect();

	var findAllPlayers = function() {
		return players.Player.find().exec();
	};

	var findAllTeams = function() {
		return teams.Team.find().exec();
	};

  var findAllWorlds = function() {
    return worlds.World.find().exec();
  };

	var validateCountOf = function(expectedCount) {
		return function(queryResults) {
			expect(queryResults.length).toEqual(expectedCount);
		}
	};

	var handleError = function(done) {
		return function(err) {
			console.log('Error!! - ' + error);
			done(err);
		}
	};

	describe('the purgeData function... ', function() {

		beforeEach(function(done) {
			setup.addPlayer('Harry Potter', 'harry@potter.com', '/Gryffindor', 'hogwarts')
				.then(setup.addPlayer('Hermione Granger', 'hermione@granger.com', '/Gryffindor', 'hogwarts'))
				.then(setup.addTeam('Gryffindor', '/Gryffindor'))
				.then(setup.addTeam('Slytherin', '/Slytherin'))
				.then(done);
		});

		it('clears all players from the database.', function(done) {
			setup.purgeData()
				.then(findAllPlayers)
				.then(validateCountOf(0))
				.then(done);
		});

		it('clears all teams from the database.', function(done) {
			setup.purgeData()
				.then(findAllTeams)
				.then(validateCountOf(0))
				.then(done);
		});

		it('returns no value - so that calling done like this will work: (like setup.purgeData().then(done);)', function(done) {
			setup.purgeData()
				.then(function(args) {
					expect(args).not.toBeDefined();
					done();
				});
		});
	});

	describe('the addPlayer function... ', function() {

		beforeEach(function(done) {
			setup.purgeData().then(done);
		});

		afterEach(function(done) {
			setup.purgeData().then(done);
		});

		var validatePlayerFields = function(name, email, team, world){
			return function(players) {
				var player = players[0];
				expect(player.name).toEqual(name);
				expect(player.email).toEqual(email);
				expect(player.world).toEqual(world);
				expect(player._team).toEqual(team);
			}
		};

		it('can insert a single player using promises.', function(done) {
			setup.addPlayer('Harry Potter','harry@potter.com','/Gryffindor', 'hogwarts')
				.then(findAllPlayers)
				.then(validateCountOf(1))
				.then(done)
				.then(null, handleError(done));
		});

		it('can insert two players using promises.', function(done) {
			setup.addPlayer('Harry Potter','harry@potter.com','/Gryffindor', 'hogwarts')
				.then(setup.addPlayer('Hermione Granger','hermione@granger.com','/Gryffindor', 'hogwarts'))
				.then(findAllPlayers)
				.then(validateCountOf(2))
				.then(done)
				.then(null, handleError(done));
		});

		it('inserts the correct fields into the new player', function(done) {
			setup.addPlayer('Harry Potter','harry@potter.com','/Gryffindor', 'hogwarts')
				.then(findAllPlayers)
				.then(validatePlayerFields('Harry Potter','harry@potter.com','/Gryffindor', 'hogwarts'))
				.then(done);
		});

		it('returns no value - so that calling done like this will work: setup.addPlayer(player).then(done);', function() {
			setup.addPlayer('Harry Potter','harry@potter.com','/Gryffindor', 'hogwarts')
				.then(function(arg){
					expect(arg).not.toBeDefined();
					done();
				});
		});
	});

	describe('the deleteWorld function...', function() {

		beforeEach(function(done) {
			setup.purgeData().then(done);
		});

		afterEach(function(done) {
			setup.purgeData().then(done);
		});

		//TODO: need to base on id, not name
		//it('deletes the specified world', function(done) {
		//	console.log("=========");
		//	setup.addWorld('Pandora')
		//		.then(setup.deleteWorld('Pandora'))
		//		.then(findAllWorlds)
		//		.then(validateCountOf(0))
		//		.then(done)
		//		.then(null, handleError(done));
		//	console.log("=========");
		//});

	});

	describe('the addTeam function... ', function() {

		beforeEach(function(done) {
			setup.purgeData().then(done);
		});

		afterEach(function(done) {
			setup.purgeData().then(done);
		});

		var validateTeamFields = function(name, path){
			return function(teams) {
				var team = teams[0];
				expect(team.name).toEqual(name);
				expect(team.path).toEqual(path);
			}
		};

		it('can insert a single team using promises.', function(done) {
			setup.addTeam('Gryffindor', '/Gryffindor')
				.then(findAllTeams)
				.then(validateCountOf(1))
				.then(done)
				.then(null, handleError(done));
		});

		it('can insert two teams using promises.', function(done) {
			setup.addTeam('Gryffindor', '/Gryffindor')
				.then(setup.addTeam('Slytherin', '/Slytherin'))
				.then(findAllTeams)
				.then(validateCountOf(2))
				.then(done)
				.then(null, handleError(done));
		});

		it('inserts the correct fields into the new team', function(done) {
			setup.addTeam('Gryffindor', '/Gryffindor')
				.then(findAllTeams)
				.then(validateTeamFields('Gryffindor', '/Gryffindor'))
				.then(done);
		});

		it('returns no value - so that calling done like this will work: setup.addTeam(team).then(done);', function() {
			setup.addTeam('Gryffindor', '/Gryffindor')
				.then(function(arg){
					expect(arg).not.toBeDefined();
					done();
				});
		});
	});

	describe('the addWorld function... ', function() {

		beforeEach(function(done) {
			setup.purgeData().then(done);
		});

		afterEach(function(done) {
			setup.purgeData().then(done);
		});

		it('can insert a single world using promises.', function(done) {
			setup.addWorld('Pandora')
				.then(findAllWorlds)
				.then(validateCountOf(1))
				.then(done)
				.then(null, handleError(done));
		});

		it('can insert two worlds using promises.', function(done) {
			setup.addWorld('Pandora')
				.then(setup.addWorld('Neptune'))
				.then(findAllWorlds)
				.then(validateCountOf(2))
				.then(done)
				.then(null, handleError(done));
		});

		it('returns no value - so that calling done like this will work: setup.addWorld(world).then(done);', function() {
			setup.addWorld('Pandora')
				.then(function(arg){
					expect(arg).not.toBeDefined();
					done();
				});
		});
	});

});
